<?php

namespace App\Filament\Widgets;

use App\Models\FiscalYear;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\On;

class SavingsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    public ?int $activeFiscalId = null;

    #[On('fiscalPeriodUpdated')]
    public function updateFiscalPeriod($id): void
    {
        $this->activeFiscalId = $id;
        // Memaksa widget untuk refresh data
    }

    public function mount(): void
    {
        $this->activeFiscalId = FiscalYear::open()->first()?->id;
    }

    // PERBAIKAN: Gunakan getStats() bukan getCards()
    protected function getStats(): array
    {
        $fiscal = FiscalYear::find($this->activeFiscalId);

        // Default jika tidak ada data
        if (!$fiscal) {
            return [
                Stat::make('Emergency Savings', 'Rp 0'),
                Stat::make("Adek's Savings", 'Rp 0'),
                Stat::make('Total Savings', 'Rp 0'),
            ];
        }

        $start = $fiscal->start_date;
        $end = $fiscal->end_date;

        // Ambil nilai mentah (casting ke float)
        $valDarurat = (float) DB::table('incomes')
            ->join('categories', 'categories.id', '=', 'incomes.category_id')
            ->where('categories.name', 'EMERGENCY SAVINGS')
            ->whereBetween('income_date', [$start, $end])
            ->sum('amount');

        $valAdek = (float) DB::table('incomes')
            ->join('categories', 'categories.id', '=', 'incomes.category_id')
            ->where('categories.name', 'KIDS SAVINGS')
            ->whereBetween('income_date', [$start, $end])
            ->sum('amount');

        $valTotal = $valDarurat + $valAdek;

        // Langsung format di sini
        $format = fn($val) => 'Rp ' . number_format($val, 2, ',', '.');

        return [
            // Kita masukkan string hasil format LANGSUNG ke parameter kedua Stat::make
            Stat::make('Emergency Savings', $format($valDarurat))
                ->description('Total savings this period')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->icon('heroicon-o-shield-check'),

            Stat::make("Adek's Savings", $format($valAdek))
                ->description('Total savings this period')
                ->descriptionIcon('heroicon-m-gift')
                ->color('warning')
                ->icon('heroicon-o-gift'),

            Stat::make('Total Savings', $format($valTotal))
                ->description('Combined all savings')
                ->descriptionIcon('heroicon-o-credit-card')
                ->color('info')
                ->icon('heroicon-o-building-library'),
        ];
    }
}
