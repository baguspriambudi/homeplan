<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        $auth = auth()->user();
        $canManage = $auth->can('manage users');

        $users = User::with(['roles', 'household'])
            ->when(! $auth->isSuperAdmin(), fn($q) => $q->where('household_id', $auth->household_id))
            ->when(
                $auth->isSuperAdmin() && session('household_filter'),
                fn($q) => $q->where('household_id', session('household_filter'))
            )
            ->latest()
            ->get()
            ->map(fn(User $user) => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'roles'      => $user->roles->pluck('name'),
                'household'  => $user->household?->name,
                'created_at' => $user->created_at->format('Y-m-d H:i'),
                // Cermin aturan update()/destroy() agar tombol yang pasti
                // ditolak server tidak perlu tampil
                'editable'   => $canManage || $user->id === $auth->id,
                'deletable'  => $canManage && $user->id !== $auth->id,
            ]);

        // Pilihan role hanya milik super admin — admin household selalu
        // membuat anggota ber-role 'user'
        $roles = $auth->isSuperAdmin()
            ? Role::orderBy('name')->pluck('name')
            : collect();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
            'canManage' => $canManage,
            'canChooseRole' => $auth->isSuperAdmin(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $auth = auth()->user();

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults(), 'confirmed'],
            'role'     => [$auth->isSuperAdmin() ? 'required' : 'nullable', 'string', 'exists:roles,name'],
        ]);

        // Admin household selalu membuat anggota ber-role 'user';
        // pilihan role hanya milik super admin
        $role = $auth->isSuperAdmin() ? $validated['role'] : 'user';

        // Anggota baru masuk ke household pembuatnya; super admin memakai filter aktif
        $householdId = $auth->isSuperAdmin() ? session('household_filter') : $auth->household_id;

        if (! $householdId && $role !== 'super-admin') {
            return back()->with('error', 'Select a household first (use the household switcher).');
        }

        $user = User::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'password'     => Hash::make($validated['password']),
            'household_id' => $role === 'super-admin' ? null : $householdId,
        ]);

        $user->assignRole($role);

        return back()->with('success', "User {$user->name} created successfully.");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $auth = auth()->user();

        // Role 'user' hanya boleh mengedit akunnya sendiri
        if (! $auth->can('manage users') && $user->id !== $auth->id) {
            abort(403);
        }

        if (! $auth->isSuperAdmin() && $user->household_id !== $auth->household_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', Password::defaults(), 'confirmed'],
            'role'     => ['nullable', 'string', 'exists:roles,name'],
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);

        // Perubahan role hanya milik super admin
        if ($auth->isSuperAdmin() && ($validated['role'] ?? null)) {
            // Guard admin terakhir di household yang sama
            if (
                $user->hasRole('admin') &&
                $validated['role'] !== 'admin' &&
                User::role('admin')->where('household_id', $user->household_id)->count() <= 1
            ) {
                return back()->with('error', 'Cannot remove the last admin of this household.');
            }

            $user->syncRoles([$validated['role']]);
        }

        return back()->with('success', "User {$user->name} updated successfully.");
    }

    public function destroy(User $user): RedirectResponse
    {
        $auth = auth()->user();

        if (! $auth->isSuperAdmin() && $user->household_id !== $auth->household_id) {
            abort(403);
        }

        if ($user->id === $auth->id) {
            return back()->with('error', 'You cannot delete your own account here.');
        }

        if (
            $user->hasRole('admin') &&
            User::role('admin')->where('household_id', $user->household_id)->count() <= 1
        ) {
            return back()->with('error', 'Cannot delete the last admin of this household.');
        }

        // Transaksi keuangan dilindungi FK restrictOnDelete. Pindahkan kepemilikan
        // (created_by) ke admin yang menghapus agar data tetap ada, lalu hapus user.
        DB::transaction(function () use ($user, $auth) {
            Expense::where('created_by', $user->id)->update(['created_by' => $auth->id]);
            Income::where('created_by', $user->id)->update(['created_by' => $auth->id]);

            $user->delete();
        });

        return back()->with('success', 'User deleted successfully.');
    }
}
