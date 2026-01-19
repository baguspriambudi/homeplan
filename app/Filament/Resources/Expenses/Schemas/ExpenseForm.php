<?php

namespace App\Filament\Resources\Expenses\Schemas;

use App\Models\Expense;
use App\Models\FiscalYear;
use Closure;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ExpenseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('expense_date')
                    ->label('Spending Date')
                    ->required()
                    ->default(now())
                    ->live()
                    ->native(false)
                    ->displayFormat('d M Y')
                    ->format('Y-m-d')
                    ->rules([
                        fn() => function (string $attribute, $value, Closure $fail) {
                            $fiscalYear = FiscalYear::where('start_date', '<=', $value)
                                ->where('end_date', '>=', $value)
                                ->first();

                            if (!$fiscalYear) {
                                $fail('This date does not fall within any fiscal year period.');
                            }

                            if ($fiscalYear && $fiscalYear->status === 'closed') {
                                $fail('The fiscal year for this date is already closed.');
                            }
                        },
                    ]),

                Select::make('category_id')
                    ->label('Category')
                    ->relationship(
                        name: 'category',
                        titleAttribute: 'name',
                        modifyQueryUsing: fn($query) =>
                        $query->whereNotIn('type', ['income', 'saving'])
                    )
                    ->searchable()
                    ->preload()
                    ->required(),

                Textarea::make('description')
                    ->label('Description'),

                TextInput::make('amount')
                    ->label('Amount')
                    ->required()
                    ->currencyMask(thousandSeparator: '.', decimalSeparator: ',', precision: 0)
                    ->prefix('Rp')
                    ->rules([
                        fn($get) => function (string $attribute, $value, Closure $fail) use ($get) {
                            $date = $get('expense_date');
                            if (!$date) return;

                            $fiscalYear = FiscalYear::where('start_date', '<=', $date)
                                ->where('end_date', '>=', $date)
                                ->first();

                            if ($fiscalYear) {
                                // Calculate other expenses in this period
                                $totalOthers = Expense::whereBetween('expense_date', [$fiscalYear->start_date, $fiscalYear->end_date])
                                    // If editing, exclude current record
                                    ->when($get('id'), fn($q, $id) => $q->where('id', '!=', $id))
                                    ->sum('amount');

                                $remaining = $fiscalYear->opening_balance - $totalOthers;

                                if ($value > $remaining) {
                                    // Error message in English
                                    $fail("Insufficient balance. Remaining balance: Rp " . number_format($remaining, 0, ',', '.'));
                                }
                            }
                        },
                    ]),

                Hidden::make('created_by')
                    ->default(auth()->id())
                    ->required(),
            ]);
    }
}
