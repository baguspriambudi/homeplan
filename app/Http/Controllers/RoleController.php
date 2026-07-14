<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn(Role $role) => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name'),
                'users_count' => $role->users()->count(),
            ]);

        $permissions = Permission::orderBy('name')->pluck('name');

        return Inertia::render('roles/index', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
        ]);

        Role::create(['name' => $validated['name']]);

        return back()->with('success', 'Role created successfully.');
    }

    public function updatePermissions(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', "Permissions updated for role \"{$role->name}\".");
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['super-admin', 'admin', 'user'])) {
            return back()->with('error', 'Cannot delete a built-in role.');
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
}
