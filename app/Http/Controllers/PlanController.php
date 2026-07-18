<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('manage plans'), 403);

        $plans = Plan::withCount('paymentOrders')
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return Inertia::render('plans/index', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('manage plans'), 403);

        $validated = $this->validatePlan($request);
        Plan::create($validated);

        return back()->with('success', 'Plan created successfully.');
    }

    public function update(Request $request, Plan $plan): RedirectResponse
    {
        abort_if(! auth()->user()->can('manage plans'), 403);

        $validated = $this->validatePlan($request);
        $plan->update($validated);

        return back()->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan): RedirectResponse
    {
        abort_if(! auth()->user()->can('manage plans'), 403);

        if ($plan->paymentOrders()->exists()) {
            return back()->with('error', 'Cannot delete plan that has payment orders. Deactivate it instead.');
        }

        $plan->delete();

        return back()->with('success', 'Plan deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePlan(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'duration_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'price' => ['required', 'integer', 'min:1000', 'max:100000000'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ]);
    }
}
