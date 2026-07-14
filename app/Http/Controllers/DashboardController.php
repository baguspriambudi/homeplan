<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FiscalYear;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $fiscalYears = FiscalYear::orderBy('start_date', 'desc')->get();
        $activeFiscal = $fiscalYears->where('status', 'open')->first() ?? $fiscalYears->first();

        $selectedFiscalId = $request->integer('fiscal_year_id', $activeFiscal?->id);
        $selectedFiscal = FiscalYear::find($selectedFiscalId);

        $openingBalance = 0;
        $totalSpent = 0;
        $remaining = 0;
        $savingsData = ['emergency' => 0, 'kids' => 0, 'total' => 0];
        $cashflow = [];

        if ($selectedFiscal) {
            $start = $selectedFiscal->start_date;
            $end   = $selectedFiscal->end_date;
            $openingBalance = (float) $selectedFiscal->opening_balance;

            $totalSpent = (float) Expense::whereBetween('expense_date', [$start, $end])->sum('amount');
            $remaining  = $openingBalance - $totalSpent;

            // Savings stats — pakai Eloquent agar terfilter household
            $savingSums = Income::join('categories', 'categories.id', '=', 'incomes.category_id')
                ->whereIn('categories.name', ['EMERGENCY SAVINGS', 'KIDS SAVINGS'])
                ->whereBetween('incomes.income_date', [$start, $end])
                ->groupBy('categories.name')
                ->selectRaw('categories.name as cat_name, SUM(incomes.amount) as total')
                ->pluck('total', 'cat_name');

            $emergency = (float) ($savingSums['EMERGENCY SAVINGS'] ?? 0);
            $kids      = (float) ($savingSums['KIDS SAVINGS'] ?? 0);

            $savingsData = [
                'emergency' => $emergency,
                'kids'      => $kids,
                'total'     => $emergency + $kids,
            ];

            // Cash flow statement
            $cashflow = $this->buildCashflow($selectedFiscal);
        }

        return Inertia::render('dashboard', [
            'fiscalYears'     => $fiscalYears,
            'selectedFiscalId'=> $selectedFiscalId,
            'stats'           => [
                'opening_balance' => $openingBalance,
                'total_spent'     => $totalSpent,
                'remaining'       => $remaining,
            ],
            'savings'  => $savingsData,
            'cashflow' => $cashflow,
            'period'   => $selectedFiscal ? [
                'start'  => $selectedFiscal->start_date->format('Y-m-d'),
                'end'    => $selectedFiscal->end_date->format('Y-m-d'),
                'status' => $selectedFiscal->status,
            ] : null,
        ]);
    }

    private function buildCashflow(FiscalYear $fiscal): array
    {
        $start   = $fiscal->start_date;
        $end     = $fiscal->end_date;
        $opening = (float) $fiscal->opening_balance;

        $rows = [];
        $runningBalance = $opening;

        $rows[] = [
            'id'      => 'opening',
            'name'    => 'Opening Balance',
            'type'    => 'opening',
            'debit'   => $opening,
            'kredit'  => null,
            'balance' => $runningBalance,
        ];

        $categoryOrder = ['income', 'saving', 'spending', 'bills', 'instalment'];
        $categories = Category::whereIn('type', $categoryOrder)
            ->get()
            ->sortBy(fn($cat) => array_search($cat->type, $categoryOrder));

        // Satu query untuk total semua kategori, via Eloquent agar terfilter household
        $categoryTotals = Expense::whereBetween('expense_date', [$start, $end])
            ->groupBy('category_id')
            ->selectRaw('category_id, SUM(amount) as total')
            ->pluck('total', 'category_id');

        $totalIncome  = 0;
        $totalExpense = 0;

        foreach ($categories as $cat) {
            $total = (float) ($categoryTotals[$cat->id] ?? 0);

            if ($total == 0) continue;

            if ($cat->type === 'income') {
                $totalIncome += $total;
                $runningBalance += $total;
                $rows[] = [
                    'id'      => 'cat_' . $cat->id,
                    'name'    => ucwords(strtolower($cat->name)),
                    'type'    => $cat->type,
                    'debit'   => $total,
                    'kredit'  => null,
                    'balance' => $runningBalance,
                ];
            } else {
                $totalExpense += $total;
                $runningBalance -= $total;
                $rows[] = [
                    'id'      => 'cat_' . $cat->id,
                    'name'    => ucwords(strtolower($cat->name)),
                    'type'    => $cat->type,
                    'debit'   => null,
                    'kredit'  => $total,
                    'balance' => $runningBalance,
                ];
            }
        }

        $rows[] = [
            'id'      => 'total',
            'name'    => 'TOTAL',
            'type'    => 'total',
            'debit'   => $totalIncome,
            'kredit'  => $totalExpense,
            'balance' => $opening + $totalIncome - $totalExpense,
        ];

        return $rows;
    }
}
