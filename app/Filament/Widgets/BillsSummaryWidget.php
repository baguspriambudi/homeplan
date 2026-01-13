<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FiscalYear;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Support\Enums\FontWeight;
use Livewire\Attributes\On;
use Illuminate\Database\Eloquent\Builder; // Pastikan ini ada

class BillsSummaryWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 1;

    protected static ?string $heading = 'BILLS REKAP';

    protected static ?int $sort = 3;

    public ?int $activeFiscalId = null;

    #[On('fiscalPeriodUpdated')]
    public function updateFiscalPeriod($id)
    {
        $this->activeFiscalId = $id;
    }

    public function mount()
    {
        $this->activeFiscalId = FiscalYear::open()->first()?->id;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(function () {
                // Cukup ambil semua kategori tipe bills tanpa whereHas
                // Ini memastikan kategori dengan sum 0 tetap muncul
                return Category::query()->where('type', 'bills');
            })
            ->columns([
                TextColumn::make('name')
                    ->label('CATEGORY')
                    ->weight(FontWeight::Bold),

                TextColumn::make('amount_total')
                    ->label('AMOUNT')
                    ->money('IDR', locale: 'id')
                    ->alignRight()
                    ->state(function (Category $record) {
                        $fiscal = FiscalYear::find($this->activeFiscalId);

                        // Jika tidak ada fiscal year aktif, tampilkan 0
                        if (!$fiscal) return 0;

                        // Menghitung jumlah expense untuk kategori ini di periode tertentu
                        return $record->expenses()
                            ->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date])
                            ->sum('amount') ?? 0;
                    })
                    ->summarize(
                        Summarizer::make()
                            ->label('TOTAL')
                            ->money('IDR', locale: 'id')
                            ->using(function () {
                                $fiscal = FiscalYear::find($this->activeFiscalId);
                                if (! $fiscal) return 0;

                                return Expense::whereHas('category', fn($q) => $q->where('type', 'bills'))
                                    ->whereBetween('expense_date', [
                                        $fiscal->start_date,
                                        $fiscal->end_date,
                                    ])
                                    ->sum('amount');
                            })
                    ),
            ])
            ->paginated(false);
    }
}
