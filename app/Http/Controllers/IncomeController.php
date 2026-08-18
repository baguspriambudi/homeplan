<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FiscalYear;
use App\Models\Income;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! auth()->user()->can('view incomes'), 403);

        $fiscalYears = FiscalYear::orderBy('start_date', 'desc')->get();
        $activeFiscal = $fiscalYears->where('status', 'open')->first() ?? $fiscalYears->first();

        $selectedFiscalId = $request->integer('fiscal_year_id', $activeFiscal?->id);
        $selectedFiscal = FiscalYear::find($selectedFiscalId);

        $incomes = Income::with(['category:id,name,type', 'creator:id,name'])
            ->when($selectedFiscal, fn($q) =>
                $q->whereBetween('income_date', [$selectedFiscal->start_date, $selectedFiscal->end_date])
            )
            ->orderBy('income_date', 'desc')
            ->get();

        $categories = Category::where('type', 'income')
            ->orderBy('name')
            ->get(['id', 'name', 'type']);

        return Inertia::render('incomes/index', [
            'incomes'          => $incomes,
            'categories'       => $categories,
            'fiscalYears'      => $fiscalYears,
            'selectedFiscalId' => $selectedFiscalId,
            'totalIncome'      => $incomes->sum('amount'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create incomes'), 403);

        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'amount'         => 'required|numeric|min:1',
            'description'    => 'nullable|string|max:255',
            'income_date'    => 'required|date',
            'adjust_to_cash' => 'boolean',
        ]);

        $this->validateFiscalYear($validated['income_date']);

        $validated['created_by'] = auth()->id();
        $validated['adjust_to_cash'] = $validated['adjust_to_cash'] ?? false;
        Income::create($validated);

        return back()->with('success', 'Income recorded successfully.');
    }

    public function update(Request $request, Income $income): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit incomes'), 403);

        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'amount'         => 'required|numeric|min:1',
            'description'    => 'nullable|string|max:255',
            'income_date'    => 'required|date',
            'adjust_to_cash' => 'boolean',
        ]);

        $this->validateFiscalYear($validated['income_date']);

        $validated['adjust_to_cash'] = $validated['adjust_to_cash'] ?? false;
        $income->update($validated);

        return back()->with('success', 'Income updated successfully.');
    }

    public function destroy(Income $income): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete incomes'), 403);

        $income->delete();

        return back()->with('success', 'Income deleted successfully.');
    }

    /**
     * Tanggal transaksi harus jatuh di dalam salah satu periode fiscal year
     * yang masih open — sama seperti aturan pada expenses.
     */
    private function validateFiscalYear(string $date): void
    {
        $fiscal = FiscalYear::where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->first();

        if (! $fiscal) {
            throw ValidationException::withMessages([
                'income_date' => 'This date does not fall within any fiscal year period.',
            ]);
        }

        if ($fiscal->isClosed()) {
            throw ValidationException::withMessages([
                'income_date' => 'The fiscal year for this date is already closed.',
            ]);
        }
    }
}
