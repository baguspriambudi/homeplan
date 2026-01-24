<?php

namespace App\Filament\Widgets;

use App\Models\Expense;
use App\Models\FiscalYear;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Livewire\Attributes\On; // <--- WAJIB TAMBAH INI

class ExpenseOverview extends BaseWidget
{
    // Agar muncul tepat di bawah filter (sort 2), 
    // pastikan sort widget tabel tadi kamu naikkan menjadi 3 dan 4.
    protected static ?int $sort = 2;

    public ?int $activeFiscalId = null;

    // Mendengarkan sinyal dari GlobalFiscalFilter
    #[On('fiscalPeriodUpdated')]
    public function updateFiscalPeriod($id)
    {
        $this->activeFiscalId = $id;
    }

    public function mount()
    {
        // Default awal saat load halaman
        $this->activeFiscalId = FiscalYear::open()->first()?->id;
    }

    protected function getStats(): array
    {
        // 1. Ambil Fiscal Year berdasarkan pilihan filter global
        $activeFiscal = FiscalYear::find($this->activeFiscalId);

        // 2. Ambil Opening Balance
        $openingBalance = $activeFiscal?->opening_balance ?? 0;

        // 3. Hitung Total Expenses berdasarkan pilihan filter
        $totalSpent = 0;
        if ($activeFiscal) {
            $totalSpent = Expense::whereBetween('expense_date', [
                $activeFiscal->start_date,
                $activeFiscal->end_date
            ])->sum('amount');
        }

        // 4. Hitung Sisa Budget
        $remaining = $openingBalance - $totalSpent;

        return [
            // CARD 1: OPENING BALANCE
            Stat::make('Opening Balance', 'Rp ' . number_format($openingBalance, 2, ',', '.'))
                ->description($activeFiscal ? "Period: {$activeFiscal->name}" : 'No active period')
                ->icon('heroicon-o-banknotes')
                ->color('info')
                ->chart([5, 5, 6, 6, 7, 8, 9]),

            // CARD 2: TOTAL EXPENSES
            Stat::make('Total Expenses', 'Rp ' . number_format($totalSpent, 2, ',', '.'))
                ->description('Total spent in this period')
                ->icon('heroicon-o-arrow-trending-down')
                ->color('danger')
                ->chart([10, 2, 8, 3, 12, 5, 15]),

            // CARD 3: REMAINING BUDGET
            Stat::make('Remaining Budget', 'Rp ' . number_format($remaining, 2, ',', '.'))
                ->description($remaining < 0 ? 'Budget Overlimit!' : 'Available funds')
                ->icon('heroicon-o-wallet')
                ->color($remaining >= 0 ? 'success' : 'danger')
                ->chart($remaining >= 0 ? [7, 3, 5, 2, 10] : [10, 2, 5, 3, 7]),
        ];
    }
}
