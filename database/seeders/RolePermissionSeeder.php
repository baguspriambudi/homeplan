<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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
            'view users',
            'manage users',
            'manage roles',

            // Subscription & Payments (khusus super admin)
            'manage plans',
            'manage payments',
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

        // Admin: admin rumah tangga — semua permission kecuali yang global
        // (manage roles, master harga, dan konfirmasi pembayaran hanya super admin)
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(array_values(array_diff($permissions, [
            'manage roles',
            'manage plans',
            'manage payments',
        ])));

        // User: anggota household (dibuat oleh admin household) — fitur harian
        // penuh, tapi user management hanya melihat daftar; edit terbatas ke
        // dirinya sendiri (dijaga di UserController)
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
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',
            'view fiscal-years',
            'create fiscal-years',
            'edit fiscal-years',
            'delete fiscal-years',
            'view users',
        ]);

        // Assign admin role ke user pertama jika belum punya role
        $firstUser = User::first();
        if ($firstUser && ! $firstUser->hasAnyRole(['admin', 'user'])) {
            $firstUser->assignRole('admin');
        }
    }
}
