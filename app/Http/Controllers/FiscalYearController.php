<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FiscalYearController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('view fiscal-years'), 403);

        $fiscalYears = FiscalYear::latest()->get();

        return Inertia::render('fiscal-years/index', [
            'fiscalYears' => $fiscalYears,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create fiscal-years'), 403);

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after:start_date',
            'opening_balance' => 'required|numeric|min:0',
        ]);

        FiscalYear::create($validated);

        return back()->with('success', 'Fiscal year created successfully.');
    }

    public function update(Request $request, FiscalYear $fiscalYear): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit fiscal-years'), 403);

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after:start_date',
            'opening_balance' => 'required|numeric|min:0',
            'status'          => 'required|in:open,closed',
        ]);

        $fiscalYear->update($validated);

        return back()->with('success', 'Fiscal year updated successfully.');
    }

    public function destroy(FiscalYear $fiscalYear): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete fiscal-years'), 403);

        if ($fiscalYear->isOpen()) {
            return back()->with('error', 'Cannot delete an open fiscal year.');
        }

        $fiscalYear->delete();

        return back()->with('success', 'Fiscal year deleted successfully.');
    }
}
