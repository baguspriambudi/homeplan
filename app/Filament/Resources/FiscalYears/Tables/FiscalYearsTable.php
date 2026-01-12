<?php

namespace App\Filament\Resources\FiscalYears\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FiscalYearsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Name')
                    ->searchable(),

                TextColumn::make('start_date')
                    ->label('Start Date')
                    ->date(),

                TextColumn::make('end_date')
                    ->label('End Date')
                    ->date(),

                TextColumn::make('opening_balance')
                    ->label('Opening Balance')
                    ->money('IDR', locale: 'id'),

                TextColumn::make('total_expenses')
                    ->label('Total Expenses')
                    ->money('IDR', locale: 'id')
                    ->toggleable(),

                TextColumn::make('remaining_amount')
                    ->label('Remaining')
                    ->money('IDR', locale: 'id')
                    ->toggleable(),

                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'success' => 'open',
                        'danger'  => 'closed',
                    ]),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
            ]);
    }
}
