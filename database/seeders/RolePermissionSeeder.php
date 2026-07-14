<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'view dashboard',

            // Categories
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Fiscal Years
            'view fiscal-years',
            'create fiscal-years',
            'edit fiscal-years',
            'delete fiscal-years',

            // Expenses
            'view expenses',
            'create expenses',
            'edit expenses',
            'delete expenses',

            // Incomes
            'view incomes',
            'create incomes',
            'edit incomes',
            'delete incomes',

            // Administration
            'manage users',
            'manage roles',
        ];

        // Hapus permission lama yang tidak dipakai lagi
        $oldPermissions = ['manage categories', 'manage fiscal-years', 'manage expenses', 'manage incomes'];
        Permission::whereIn('name', $oldPermissions)->delete();

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Super Admin: semua permission + bisa lihat data semua household (via Gate::before)
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdmin->syncPermissions($permissions);

        // Admin: admin rumah tangga — semua permission kecuali manage roles (global)
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(array_values(array_diff($permissions, ['manage roles'])));

        // User: hanya expenses & incomes penuh
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->syncPermissions([
            'view dashboard',
            'view expenses',
            'create expenses',
            'edit expenses',
            'delete expenses',
            'view incomes',
            'create incomes',
            'edit incomes',
            'delete incomes',
        ]);

        // Assign admin role ke user pertama jika belum punya role
        $firstUser = User::first();
        if ($firstUser && ! $firstUser->hasAnyRole(['admin', 'user'])) {
            $firstUser->assignRole('admin');
        }
    }
}
