<?php

namespace App\Filament\Resources\FiscalYears;

use App\Filament\Resources\FiscalYears\Pages\CreateFiscalYear;
use App\Filament\Resources\FiscalYears\Pages\EditFiscalYear;
use App\Filament\Resources\FiscalYears\Pages\ListFiscalYears;
use App\Filament\Resources\FiscalYears\Schemas\FiscalYearForm;
use App\Filament\Resources\FiscalYears\Tables\FiscalYearsTable;
use App\Models\FiscalYear;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FiscalYearResource extends Resource
{
    protected static ?string $model = FiscalYear::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::CalendarDateRange;

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | UnitEnum | null $navigationGroup = 'Settings';

    public static function form(Schema $schema): Schema
    {
        return FiscalYearForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FiscalYearsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFiscalYears::route('/'),
            'create' => CreateFiscalYear::route('/create'),
            'edit' => EditFiscalYear::route('/{record}/edit'),
        ];
    }
}
