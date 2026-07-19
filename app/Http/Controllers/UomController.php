<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UomController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('view uoms'), 403);

        $uoms = Uom::with('creator:id,name')
            ->withCount('ingredients')
            ->orderBy('name')
            ->get();

        return Inertia::render('uoms/index', [
            'uoms' => $uoms,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create uoms'), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', Rule::unique('uoms')->where('household_id', auth()->user()->household_id)],
        ]);

        $validated['created_by'] = auth()->id();
        Uom::create($validated);

        return back()->with('success', 'Unit created successfully.');
    }

    public function update(Request $request, Uom $uom): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit uoms'), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', Rule::unique('uoms')->where('household_id', $uom->household_id)->ignore($uom->id)],
        ]);

        $uom->update($validated);

        return back()->with('success', 'Unit updated successfully.');
    }

    public function destroy(Uom $uom): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete uoms'), 403);

        if ($uom->ingredients()->exists()) {
            return back()->with('error', 'Cannot delete unit that is used by menu ingredients.');
        }

        $uom->delete();

        return back()->with('success', 'Unit deleted successfully.');
    }
}
