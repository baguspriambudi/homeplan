<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Bulanan',
                'duration_days' => 30,
                'price' => 25000,
                'description' => 'Akses penuh selama 30 hari',
                'sort_order' => 1,
            ],
            [
                'name' => 'Tahunan',
                'duration_days' => 365,
                'price' => 250000,
                'description' => 'Akses penuh selama 1 tahun — hemat 2 bulan',
                'sort_order' => 2,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::firstOrCreate(
                ['name' => $plan['name']],
                [...$plan, 'is_active' => true],
            );
        }
    }
}
