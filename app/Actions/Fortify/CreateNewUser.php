<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Household;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password'       => $this->passwordRules(),
            'household_name' => ['required', 'string', 'max:255'],
        ])->validate();

        return DB::transaction(function () use ($input) {
            // Pendaftar baru otomatis membuat rumah tangga dan menjadi admin-nya
            $household = Household::create(['name' => $input['household_name']]);

            $user = User::create([
                'name'         => $input['name'],
                'email'        => $input['email'],
                'password'     => $input['password'],
                'household_id' => $household->id,
            ]);

            $user->assignRole('admin');

            return $user;
        });
    }
}
