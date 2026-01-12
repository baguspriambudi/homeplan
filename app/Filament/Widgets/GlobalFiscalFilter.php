<?php

namespace App\Filament\Widgets;

use App\Models\FiscalYear;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Widgets\Widget;
use Carbon\Carbon; // Tambahkan ini

class GlobalFiscalFilter extends Widget implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.widgets.global-fiscal-filter';

    protected int | string | array $columnSpan = 'full';

    protected static ?int $sort = 1;

    public ?array $data = [];

    public function mount(): void
    {
        $today = Carbon::today();

        // 1. Cari fiscal year yang mencakup tanggal hari ini
        $currentFiscal = FiscalYear::where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        // 2. Jika tidak ada, ambil yang statusnya 'open' sebagai cadangan
        if (!$currentFiscal) {
            $currentFiscal = FiscalYear::open()->first();
        }

        // 3. Set default value. Jika $currentFiscal tetap null, 
        // maka otomatis akan kembali ke "Select an option" (null)
        $this->form->fill([
            'fiscal_year_id' => $currentFiscal?->id,
        ]);

        // Opsional: Jika ada default, langsung siarkan ID-nya agar widget lain terupdate saat load pertama
        if ($currentFiscal) {
            $this->dispatch('fiscalPeriodUpdated', id: $currentFiscal->id);
        }
    }

    public function form($form)
    {
        return $form
            ->schema([
                Select::make('fiscal_year_id')
                    ->label('Main Fiscal Period')
                    ->placeholder('Select an option') // Label saat tidak ada yang terpilih
                    ->options(FiscalYear::pluck('name', 'id'))
                    ->live()
                    ->afterStateUpdated(function ($state) {
                        $this->dispatch('fiscalPeriodUpdated', id: $state);
                    }),
            ])
            ->statePath('data');
    }
}
