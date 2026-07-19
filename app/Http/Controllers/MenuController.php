<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Uom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('view menus'), 403);

        $menus = Menu::with(['creator:id,name', 'ingredients.uom:id,name'])
            ->latest()
            ->get();

        return Inertia::render('menus/index', [
            'menus' => $menus,
            'uoms' => Uom::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create menus'), 403);

        $validated = $this->validateMenu($request);

        DB::transaction(function () use ($validated) {
            $menu = Menu::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'created_by' => auth()->id(),
            ]);

            $menu->ingredients()->createMany($validated['ingredients']);
        });

        return back()->with('success', 'Menu created successfully.');
    }

    public function update(Request $request, Menu $menu): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit menus'), 403);

        $validated = $this->validateMenu($request);

        DB::transaction(function () use ($menu, $validated) {
            $menu->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            // Bahan diganti utuh — lebih sederhana daripada diff per baris
            $menu->ingredients()->delete();
            $menu->ingredients()->createMany($validated['ingredients']);
        });

        return back()->with('success', 'Menu updated successfully.');
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete menus'), 403);

        if ($menu->planItems()->exists()) {
            return back()->with('error', 'Cannot delete menu that is scheduled in a meal plan.');
        }

        DB::transaction(function () use ($menu) {
            $menu->ingredients()->delete();
            $menu->delete();
        });

        return back()->with('success', 'Menu deleted successfully.');
    }

    /**
     * Qty menerima format koma ("0,5") maupun titik. UOM divalidasi terhadap
     * master milik household sendiri (query Uom sudah kena global scope).
     */
    private function validateMenu(Request $request): array
    {
        $data = $request->all();

        foreach ($data['ingredients'] ?? [] as $i => $ingredient) {
            if (isset($ingredient['qty']) && is_string($ingredient['qty'])) {
                $data['ingredients'][$i]['qty'] = str_replace(',', '.', trim($ingredient['qty']));
            }
        }

        $uomIds = Uom::pluck('id')->all();

        return validator($data, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.name' => ['required', 'string', 'max:255'],
            'ingredients.*.qty' => ['required', 'numeric', 'gt:0', 'max:999999'],
            'ingredients.*.uom_id' => ['required', 'integer', Rule::in($uomIds)],
        ], [], [
            'ingredients.*.name' => 'ingredient name',
            'ingredients.*.qty' => 'qty',
            'ingredients.*.uom_id' => 'unit',
        ])->validate();
    }
}
