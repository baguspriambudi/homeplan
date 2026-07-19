<?php

namespace Database\Seeders;

use App\Models\Household;
use App\Models\Uom;
use App\Models\User;
use App\Services\HouseholdProvisioner;
use Illuminate\Database\Seeder;

/**
 * Isi master UOM default untuk household lama yang belum punya.
 * Household baru sudah dapat otomatis lewat HouseholdProvisioner.
 */
class UomSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Household::all() as $household) {
            $owner = User::withoutGlobalScopes()
                ->where('household_id', $household->id)
                ->orderBy('id')
                ->first();

            if (! $owner) {
                continue; // household tanpa user (mis. sisa data) dilewati
            }

            foreach (HouseholdProvisioner::DEFAULT_UOMS as $name) {
                $exists = Uom::withoutGlobalScope('household')
                    ->where('household_id', $household->id)
                    ->where('name', $name)
                    ->exists();

                if (! $exists) {
                    $uom = new Uom(['name' => $name, 'created_by' => $owner->id]);
                    $uom->household_id = $household->id;
                    $uom->save();
                }
            }
        }
    }
}
