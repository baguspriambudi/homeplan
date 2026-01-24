<?php

namespace App\Filament\Resources\Incomes\Schemas;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Income;
use App\Models\FiscalYear;
use Closure;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;

class IncomeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('income_date')
                    ->label('Income Date')
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
                        $query->whereIn('type', ['income', 'saving'])
                    )
                    ->searchable()
                    ->preload()
                    ->live()
                    ->required(),

                Textarea::make('description')
                    ->label('Description'),

                TextInput::make('amount')
                    ->label('Amount')
                    ->required()
                    ->currencyMask(thousandSeparator: '.', decimalSeparator: ',', precision: 0)
                    ->prefix('Rp'),

                // Checkbox::make('adjust_to_cash')
                //     ->label('Adjust to Incoming Cash')
                //     ->helperText('If checked, this income will be added to the fiscal year opening balance.')
                //     ->default(false),
                Checkbox::make('adjust_to_cash')
                    ->label('Adjust to Incoming Cash')
                    ->helperText('If checked, this income will be added to the fiscal year opening balance.')
                    ->default(false)
                    ->visible(function (\Filament\Schemas\Components\Utilities\Get $get) {
                        $categoryId = $get('category_id');

                        if (!$categoryId) {
                            return false;
                        }

                        return Category::where('id', $categoryId)
                            ->where('type', 'income')
                            ->exists();
                    }),

                Hidden::make('created_by')
                    ->default(auth()->id())
                    ->required(),
            ]);
    }
}
