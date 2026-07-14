<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FiscalYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! auth()->user()->can('view expenses'), 403);

        $fiscalYears = FiscalYear::orderBy('start_date', 'desc')->get();
        $activeFiscal = $fiscalYears->where('status', 'open')->first() ?? $fiscalYears->first();

        $selectedFiscalId = $request->integer('fiscal_year_id', $activeFiscal?->id);
        $selectedFiscal = FiscalYear::find($selectedFiscalId);

        $expenses = Expense::with(['category:id,name,type', 'creator:id,name'])
            ->whereHas('category', fn($q) => $q->whereNotIn('type', ['income', 'saving']))
            ->when($selectedFiscal, fn($q) =>
                $q->whereBetween('expense_date', [$selectedFiscal->start_date, $selectedFiscal->end_date])
            )
            ->orderBy('expense_date', 'desc')
            ->get();

        $totalSpent = $expenses->sum('amount');
        $openingBalance = $selectedFiscal?->opening_balance ?? 0;
        $remaining = $openingBalance - $totalSpent;

        $categories = Category::whereNotIn('type', ['income', 'saving'])
            ->orderBy('name')
            ->get(['id', 'name', 'type']);

        return Inertia::render('expenses/index', [
            'expenses'         => $expenses,
            'categories'       => $categories,
            'fiscalYears'      => $fiscalYears,
            'selectedFiscalId' => $selectedFiscalId,
            'summary'          => [
                'opening_balance' => $openingBalance,
                'total_spent'     => $totalSpent,
                'remaining'       => $remaining,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create expenses'), 403);

        $validated = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'amount'       => 'required|numeric|min:1',
            'description'  => 'nullable|string|max:255',
            'expense_date' => 'required|date',
        ]);

        $this->validateFiscalYear($validated['expense_date'], $validated['amount']);

        $validated['created_by'] = auth()->id();
        Expense::create($validated);

        return back()->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit expenses'), 403);

        $validated = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'amount'       => 'required|numeric|min:1',
            'description'  => 'nullable|string|max:255',
            'expense_date' => 'required|date',
        ]);

        $this->validateFiscalYear($validated['expense_date'], $validated['amount'], $expense->id);
        $expense->update($validated);

        return back()->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete expenses'), 403);

        $expense->delete();

        return back()->with('success', 'Expense deleted successfully.');
    }

    private function validateFiscalYear(string $date, float $amount, ?int $excludeId = null): void
    {
        $fiscal = FiscalYear::where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->first();

        if (! $fiscal) {
            throw ValidationException::withMessages([
                'expense_date' => 'This date does not fall within any fiscal year period.',
            ]);
        }

        if ($fiscal->isClosed()) {
            throw ValidationException::withMessages([
                'expense_date' => 'The fiscal year for this date is already closed.',
            ]);
        }

        $totalOthers = Expense::whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date])
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->sum('amount');

        $remaining = $fiscal->opening_balance - $totalOthers;

        if ($amount > $remaining) {
            throw ValidationException::withMessages([
                'amount' => 'Insufficient balance. Remaining: Rp ' . number_format($remaining, 0, ',', '.'),
            ]);
        }
    }
}
