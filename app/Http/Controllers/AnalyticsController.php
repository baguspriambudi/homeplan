<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! auth()->user()->can('view dashboard'), 403);

        $fiscalYears = FiscalYear::orderBy('start_date', 'desc')->get();
        $activeFiscal = $fiscalYears->where('status', 'open')->first() ?? $fiscalYears->first();

        $selectedFiscalId = $request->integer('fiscal_year_id', $activeFiscal?->id);
        $selectedFiscal = FiscalYear::find($selectedFiscalId);

        $topCategories = collect();
        $topExpenses = collect();
        $periodTotal = 0.0;

        if ($selectedFiscal) {
            $start = $selectedFiscal->start_date;
            $end   = $selectedFiscal->end_date;

            // Pengeluaran per kategori dalam periode terpilih, terbesar dulu
            $topCategories = Expense::join('categories', 'categories.id', '=', 'expenses.category_id')
                ->whereBetween('expenses.expense_date', [$start, $end])
                ->groupBy('expenses.category_id', 'categories.name', 'categories.type')
                ->selectRaw('categories.name, categories.type, SUM(expenses.amount) as total, COUNT(*) as tx_count')
                ->orderByDesc('total')
                ->get()
                ->map(fn($row) => [
                    'name'     => $row->name,
                    'type'     => $row->type,
                    'total'    => (float) $row->total,
                    'tx_count' => (int) $row->tx_count,
                ]);

            $periodTotal = $topCategories->sum('total');

            // 10 transaksi terbesar dalam periode
            $topExpenses = Expense::with('category:id,name')
                ->whereBetween('expense_date', [$start, $end])
                ->orderByDesc('amount')
                ->limit(10)
                ->get(['id', 'category_id', 'amount', 'description', 'expense_date'])
                ->map(fn($exp) => [
                    'id'           => $exp->id,
                    'category'     => $exp->category?->name,
                    'amount'       => (float) $exp->amount,
                    'description'  => $exp->description,
                    'expense_date' => $exp->expense_date->format('Y-m-d'),
                ]);
        }

        // Total spent semua periode dalam SATU query (hindari N+1 per fiscal year)
        $spentPerFiscal = Expense::join('fiscal_years', function ($join) {
                $join->on('expenses.expense_date', '>=', 'fiscal_years.start_date')
                    ->on('expenses.expense_date', '<=', 'fiscal_years.end_date');
            })
            ->groupBy('fiscal_years.id')
            ->selectRaw('fiscal_years.id as fiscal_id, SUM(expenses.amount) as total')
            ->pluck('total', 'fiscal_id');

        // Perbandingan semua periode: budget vs spent, periode terbaru dulu
        $periods = $fiscalYears
            ->sortByDesc('start_date')
            ->values()
            ->map(function (FiscalYear $fy) use ($spentPerFiscal) {
                $spent = $fy->isClosed() && (float) $fy->total_expenses > 0
                    ? (float) $fy->total_expenses
                    : (float) ($spentPerFiscal[$fy->id] ?? 0);

                return [
                    'id'              => $fy->id,
                    'name'            => $fy->name,
                    'opening_balance' => (float) $fy->opening_balance,
                    'spent'           => $spent,
                    'remaining'       => (float) $fy->opening_balance - $spent,
                    'status'          => $fy->status,
                ];
            });

        // Tren bulanan 12 bulan terakhir
        $monthlySums = Expense::selectRaw("DATE_FORMAT(expense_date, '%Y-%m') as ym, SUM(amount) as total")
            ->where('expense_date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('ym')
            ->pluck('total', 'ym');

        $monthlyTrend = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyTrend[] = [
                'month' => $month->format('M'),
                'year'  => $month->format('Y'),
                'total' => (float) ($monthlySums[$month->format('Y-m')] ?? 0),
            ];
        }

        return Inertia::render('analytics/index', [
            'fiscalYears'      => $fiscalYears,
            'selectedFiscalId' => $selectedFiscalId,
            'topCategories'    => $topCategories,
            'topExpenses'      => $topExpenses,
            'periodTotal'      => $periodTotal,
            'periods'          => $periods,
            'monthlyTrend'     => $monthlyTrend,
        ]);
    }
}
