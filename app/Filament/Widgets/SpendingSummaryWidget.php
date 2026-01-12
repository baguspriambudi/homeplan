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
use Illuminate\Database\Eloquent\Builder;

class SpendingSummaryWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 1;

    protected static ?string $heading = 'SPENDING REKAP';

    protected static ?int $sort = 2;

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
                // Mulai query kategori tipe spending
                $query = Category::query()->where('type', 'spending');

                // Ambil data Fiscal Year yang sedang aktif
                $fiscal = FiscalYear::find($this->activeFiscalId);

                // Jika ada fiscal year terpilih, tambahkan filter
                if ($fiscal) {
                    // FITUR BARU: whereHas
                    // Hanya tampilkan kategori yang PUNYA expense di rentang tanggal ini
                    $query->whereHas('expenses', function (Builder $q) use ($fiscal) {
                        $q->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date]);
                        // Opsional: Tambahkan ->where('amount', '>', 0) jika ingin memastikan nilainya positif
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
                            ->money('IDR', locale: 'id') // ✅ FORMAT UANG
                            ->using(function () {
                                $fiscal = FiscalYear::find($this->activeFiscalId);
                                if (! $fiscal) {
                                    return 0;
                                }

                                return Expense::whereHas(
                                    'category',
                                    fn($q) => $q->where('type', 'spending')
                                )
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
