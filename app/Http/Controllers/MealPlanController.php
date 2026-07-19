<?php

namespace App\Http\Controllers;

use App\Models\MealPlanItem;
use App\Models\Menu;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MealPlanController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! auth()->user()->can('view meal-plans'), 403);

        // Bulan yang ditampilkan (YYYY-MM) — default bulan berjalan
        $month = (string) $request->query('month', '');
        $start = preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $month)
            ? Carbon::createFromFormat('Y-m-d', $month.'-01')->startOfDay()
            : now()->startOfMonth();

        $items = MealPlanItem::with(['menu.ingredients.uom:id,name', 'creator:id,name'])
            ->whereBetween('date', [$start->toDateString(), $start->copy()->endOfMonth()->toDateString()])
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        return Inertia::render('meal-plans/index', [
            'month' => $start->format('Y-m'),
            'items' => $items,
            'menus' => Menu::with('ingredients.uom:id,name')->orderBy('name')->get(),
            'mealTimes' => MealPlanItem::MEAL_TIMES,
        ]);
    }

    /** Jadwalkan satu menu ke banyak tanggal sekaligus pada satu waktu makan */
    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create meal-plans'), 403);

        $validated = $request->validate([
            'dates' => ['required', 'array', 'min:1', 'max:31'],
            'dates.*' => ['required', 'date_format:Y-m-d'],
            'meal_time' => ['required', Rule::in(MealPlanItem::MEAL_TIMES)],
            'menu_id' => ['required', 'integer'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        // Query Menu kena global scope household — menu milik household lain = 404
        $menu = Menu::findOrFail($validated['menu_id']);

        $dates = array_values(array_unique($validated['dates']));

        // Menu yang sama tidak boleh dijadwalkan dua kali di tanggal + waktu yang sama
        $conflicts = MealPlanItem::whereIn('date', $dates)
            ->where('meal_time', $validated['meal_time'])
            ->where('menu_id', $menu->id)
            ->pluck('date')
            ->map(fn ($d) => $d->locale('id')->isoFormat('D MMM Y'))
            ->all();

        if ($conflicts !== []) {
            throw ValidationException::withMessages([
                'dates' => sprintf(
                    '%s sudah terjadwal waktu %s pada: %s. Hapus centang tanggal tersebut atau pilih waktu/menu lain.',
                    $menu->name,
                    ucfirst($validated['meal_time']),
                    implode(', ', $conflicts),
                ),
            ]);
        }

        foreach ($dates as $date) {
            MealPlanItem::create([
                'date' => $date,
                'meal_time' => $validated['meal_time'],
                'menu_id' => $menu->id,
                'notes' => $validated['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);
        }

        return back()->with('success', "{$menu->name} scheduled on ".count($dates).' date(s).');
    }

    public function destroy(MealPlanItem $mealPlanItem): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete meal-plans'), 403);

        $mealPlanItem->delete();

        return back()->with('success', 'Menu removed from the calendar.');
    }
}
