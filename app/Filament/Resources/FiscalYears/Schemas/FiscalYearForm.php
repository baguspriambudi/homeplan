<?php

namespace App\Filament\Resources\FiscalYears\Schemas;

use App\Models\FiscalYear;
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FiscalYearForm
{
    public static function configure(Schema $schema): Schema
    {
        $nextPeriod = self::getNextFiscalPeriod();

        return $schema->components([
            TextInput::make('name')
                ->label('Period Name')
                ->default($nextPeriod['name'])
                ->readOnly()
                ->dehydrated(),

            DatePicker::make('start_date')
                ->label('Start Date')
                ->default($nextPeriod['start_date'])
                ->native(false)
                ->readOnly()
                ->dehydrated(),

            DatePicker::make('end_date')
                ->label('End Date')
                ->default($nextPeriod['end_date'])
                ->native(false)
                ->displayFormat('d M Y')
                ->readOnly()
                ->dehydrated(),

            TextInput::make('opening_balance')
                ->label('Opening Balance')
                ->default(2100000)
                ->currencyMask(thousandSeparator: '.', decimalSeparator: ',', precision: 0)
                ->required(),

            Select::make('status')
                ->label('Status')
                ->options(['open' => 'Open', 'closed' => 'Closed'])
                ->default('open')
                ->required(),
        ]);
    }

    protected static function getNextFiscalPeriod(): array
    {
        $lastFiscal = FiscalYear::orderByDesc('end_date')->first();

        if (!$lastFiscal) {
            $start = now()->day >= 6 ? now()->startOfMonth()->addDays(5) : now()->subMonth()->startOfMonth()->addDays(5);
        } else {
            $start = Carbon::parse($lastFiscal->end_date)->addDay();
        }

        $end = (clone $start)->addMonth()->subDay();

        return [
            'name' => $start->translatedFormat('F Y'),
            'start_date' => $start,
            'end_date' => $end,
        ];
    }
}
