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
                // 1. Mulai query kategori tipe 'bills'
                $query = Category::query()->where('type', 'bills');

                // 2. Ambil data Fiscal Year yang sedang aktif
                $fiscal = FiscalYear::find($this->activeFiscalId);

                // 3. Jika ada fiscal year, filter hanya kategori yang punya expense di periode itu
                if ($fiscal) {
                    $query->whereHas('expenses', function (Builder $q) use ($fiscal) {
                        $q->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date]);
                    });
                }

                return $query;
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
                        if (!$fiscal) return 0;

                        return $record->expenses()
                            ->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date])
                            ->sum('amount');
                    })
                    ->summarize(
                        Summarizer::make()
                            ->label('TOTAL')
                            ->money('IDR', locale: 'id')
                            ->using(function () {
                                $fiscal = FiscalYear::find($this->activeFiscalId);
                                if (! $fiscal) {
                                    return 0;
                                }

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
