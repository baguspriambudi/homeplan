<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::withCount('roles')
            ->orderBy('name')
            ->get()
            ->map(fn(Permission $p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'roles_count' => $p->roles_count,
                'created_at'  => $p->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create(['name' => $validated['name']]);

        return back()->with('success', 'Permission created successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back()->with('success', 'Permission deleted successfully.');
    }
}
