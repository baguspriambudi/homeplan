<?php

namespace App\Services;

use App\Models\Category;
use App\Models\FiscalYear;
use App\Models\Household;
use App\Models\User;

/**
 * Menyiapkan data awal household baru hasil approve registrasi agar user
 * bisa langsung mencatat transaksi tanpa setup manual.
 */
class HouseholdProvisioner
{
    public function provision(Household $household, User $owner): void
    {
        $this->copyCategories($household, $owner);
        $this->createInitialFiscalYear($household);
    }

    /**
     * Copy semua kategori dari household tertua yang punya kategori
     * (household milik owner aplikasi) sebagai master data awal. Query
     * tanpa global scope karena yang meng-approve adalah super admin
     * yang mungkin sedang memakai session household_filter.
     */
    private function copyCategories(Household $household, User $owner): void
    {
        $templateId = Category::withoutGlobalScope('household')
            ->whereNotNull('household_id')
            ->where('household_id', '!=', $household->id)
            ->min('household_id');

        if ($templateId === null) {
            return;
        }

        Category::withoutGlobalScope('household')
            ->where('household_id', $templateId)
            ->orderBy('id')
            ->get(['name', 'type'])
            ->each(function (Category $master) use ($household, $owner) {
                $category = new Category([
                    'name' => $master->name,
                    'type' => $master->type,
                    'created_by' => $owner->id,
                ]);
                $category->household_id = $household->id;
                $category->save();
            });
    }

    /**
     * Fiscal year default: satu bulan kalender berjalan (awal s/d akhir
     * bulan saat approve), saldo awal 0 — bisa diubah user nanti.
     */
    private function createInitialFiscalYear(Household $household): void
    {
        $fiscalYear = new FiscalYear([
            'name' => now()->format('F Y'),
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
            'opening_balance' => 0,
            'total_expenses' => 0,
            'remaining_amount' => 0,
            'status' => 'open',
        ]);
        $fiscalYear->household_id = $household->id;
        $fiscalYear->save();
    }
}
