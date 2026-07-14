<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrNew(['email' => 'superadmin@myexpense.test']);
        $user->name = 'Super Admin';
        $user->password = Hash::make('SuperAdmin123!');
        $user->email_verified_at = now();
        $user->household_id = null; // super admin tidak terikat household
        $user->save();

        $user->syncRoles(['super-admin']);
    }
}
