<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('view categories'), 403);

        $categories = Category::with('creator:id,name')
            ->latest()
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->can('create categories'), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,spending,bills,instalment,saving',
        ]);

        $validated['created_by'] = auth()->id();
        Category::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_if(! auth()->user()->can('edit categories'), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,spending,bills,instalment,saving',
        ]);

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        abort_if(! auth()->user()->can('delete categories'), 403);

        if ($category->expenses()->exists() || $category->incomes()->exists()) {
            return back()->with('error', 'Cannot delete category that has transactions.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
