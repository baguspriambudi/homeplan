<?php

namespace App\Filament\Resources\Expenses\Tables;

use App\Models\FiscalYear;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;

class ExpensesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category.name')
                    ->label('Category Name')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('amount')
                    ->label('Amount')
                    ->money('IDR', locale: 'id')
                    ->sortable()
                    ->summarize([
                        // 1. Total Expenses
                        Sum::make()
                            ->label('Total Expenses')
                            ->money('IDR', locale: 'id'),

                        // 2. Remaining Balance
                        Summarizer::make()
                            ->label('Remaining Balance')
                            ->money('IDR', locale: 'id')
                            ->using(function ($query) {
                                $filters = request()->get('tableFilters');
                                $selectedFiscalId = $filters['fiscal_year']['value'] ?? null;

                                if ($selectedFiscalId) {
                                    $fiscalYear = FiscalYear::find($selectedFiscalId);
                                } else {
                                    $fiscalYear = FiscalYear::where('status', 'open')->first();
                                }

                                if (!$fiscalYear) return 0;

                                $totalExpenses = (clone $query)->sum('amount');
                                return $fiscalYear->opening_balance - $totalExpenses;
                            }),
                    ]),

                TextColumn::make('description')
                    ->label('Description')
                    ->searchable(),

                TextColumn::make('expense_date')
                    ->label('Expense Date')
                    ->date()
                    ->sortable(),

                TextColumn::make('creator.name')
                    ->label('Created By')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('fiscal_year')
                    ->label('Fiscal Year Periode')
                    ->options(fn() => FiscalYear::pluck('name', 'id'))
                    ->default(fn() => FiscalYear::where('status', 'open')->first()?->id)
                    ->query(function (Builder $query, array $data) {
                        if ($data['value']) {
                            $fiscal = FiscalYear::find($data['value']);
                            if ($fiscal) {
                                $query->whereBetween('expense_date', [
                                    $fiscal->start_date,
                                    $fiscal->end_date
                                ]);
                            }
                        }
                    })
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
