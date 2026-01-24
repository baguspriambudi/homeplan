<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use App\Models\FiscalYear;
use Filament\Widgets\TableWidget;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Enums\FontWeight;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\On;

class SpendingSummaryWidget extends TableWidget
{
    protected int|string|array $columnSpan = 'full';

    protected static ?int $sort = 4;

    // --- JUDUL DAN IKON WIDGET ---
    protected static ?string $heading = 'Cash Flow Statement';

    public ?int $activeFiscalId = null;

    #[On('fiscalPeriodUpdated')]
    public function updateFiscalPeriod($id): void
    {
        $this->activeFiscalId = $id;
    }

    public function mount(): void
    {
        $this->activeFiscalId = FiscalYear::open()->first()?->id;
    }

    public function table(Table $table): Table
    {
        return $table
            ->records(fn() => $this->cashflowRecords())
            ->recordClasses(function ($record) {
                if ($record['type'] === 'total') {
                    return 'bg-gray-100 dark:bg-gray-800/50';
                }
                return '';
            })
            ->columns([
                TextColumn::make('name')
                    ->label('Description')
                    ->weight(
                        fn($r) =>
                        in_array($r['type'] ?? null, ['opening', 'total'])
                            ? FontWeight::Bold
                            : FontWeight::Medium
                    )
                    ->color(fn($r) => match ($r['type'] ?? null) {
                        'income' => 'success',
                        'spending' => 'danger',
                        'saving' => 'warning',
                        'bills' => 'info',
                        default => null,
                    })
                    ->description(
                        fn($r) =>
                        in_array($r['type'] ?? null, ['opening', 'total'])
                            ? null
                            : strtoupper($r['type'] ?? ''),
                        position: 'above'
                    ),

                TextColumn::make('debit')
                    ->label('Debit (+)')
                    ->alignRight()
                    ->color('success')
                    ->weight(FontWeight::Medium)
                    ->formatStateUsing(function ($state, $record) {
                        $shouldDisplay = in_array($record['type'] ?? null, ['income', 'opening', 'total']);
                        if ($shouldDisplay && $state > 0) {
                            return 'Rp ' . number_format($state, 2, ',', '.');
                        }
                        return null;
                    }),

                TextColumn::make('kredit')
                    ->label('Credit (-)')
                    ->alignRight()
                    ->color('danger')
                    ->weight(FontWeight::Medium)
                    ->formatStateUsing(function ($state, $record) {
                        $shouldDisplay = in_array($record['type'] ?? null, ['spending', 'saving', 'bills', 'total']);
                        if ($shouldDisplay && $state > 0) {
                            return 'Rp ' . number_format($state, 2, ',', '.');
                        }
                        return null;
                    }),

                TextColumn::make('balance')
                    ->label('Balance')
                    ->alignRight()
                    ->money('IDR', locale: 'id')
                    ->weight(FontWeight::SemiBold)
                    ->color(
                        fn($r) => ($r['balance'] ?? 0) < 0 ? 'danger' : 'success'
                    ),
            ])
            ->paginated(false)
            ->striped();
    }

    protected function cashflowRecords(): array
    {
        $fiscal  = FiscalYear::find($this->activeFiscalId);
        $start   = $fiscal?->start_date;
        $end     = $fiscal?->end_date;
        $opening = $fiscal?->opening_balance ?? 0;

        $rows = [];
        $runningBalance = $opening;

        $rows[] = [
            'id'     => 'opening',
            'name'   => 'Opening Balance',
            'type'   => 'opening',
            'debit'  => $opening,
            'kredit' => null,
            'balance' => $runningBalance,
        ];

        $categoryOrder = ['income', 'saving', 'spending', 'bills'];
        $categories = Category::whereIn('type', $categoryOrder)
            ->get()
            ->sortBy(function ($category) use ($categoryOrder) {
                return array_search($category->type, $categoryOrder);
            });

        $totalIncome = 0;
        $totalExpense = 0;

        foreach ($categories as $cat) {
            $total = DB::table('expenses')
                ->where('category_id', $cat->id)
                ->whereBetween('expense_date', [$start, $end])
                ->sum('amount');

            if ($total == 0) continue;

            $formattedName = ucwords(strtolower($cat->name));

            if ($cat->type === 'income') {
                $totalIncome += $total;
                $runningBalance += $total;
                $rows[] = [
                    'id'     => 'cat_' . $cat->id,
                    'name'   => $formattedName,
                    'type'   => $cat->type,
                    'debit'  => $total,
                    'kredit' => null,
                    'balance' => $runningBalance,
                ];
            } else {
                $totalExpense += $total;
                $runningBalance -= $total;
                $rows[] = [
                    'id'     => 'cat_' . $cat->id,
                    'name'   => $formattedName,
                    'type'   => $cat->type,
                    'debit'  => null,
                    'kredit' => $total,
                    'balance' => $runningBalance,
                ];
            }
        }

        $rows[] = [
            'id'     => 'total',
            'name'   => 'TOTAL',
            'type'   => 'total',
            'debit'  => $totalIncome,
            'kredit' => $totalExpense,
            'balance' => $opening + $totalIncome - $totalExpense,
        ];

        return $rows;
    }
}
