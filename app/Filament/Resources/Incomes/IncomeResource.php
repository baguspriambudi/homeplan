<?php

namespace App\Filament\Resources\Incomes;

use BackedEnum;
use UnitEnum;
use App\Models\Income;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\Incomes\Pages\EditIncome;
use App\Filament\Resources\Incomes\Pages\ListIncomes;
use App\Filament\Resources\Incomes\Pages\CreateIncome;
use App\Filament\Resources\Incomes\Schemas\IncomeForm;
use App\Filament\Resources\Incomes\Tables\IncomesTable;

class IncomeResource extends Resource
{
    protected static ?string $model = Income::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ArrowTrendingUp;

    protected static ?string $navigationLabel = 'Income';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | UnitEnum | null $navigationGroup = 'Finance';

    protected static ?string $breadcrumb = 'Income';

    public static function form(Schema $schema): Schema
    {
        return IncomeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return IncomesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->whereHas('category', function (Builder $query) {
                $query->whereIn('type', ['income', 'saving']);
            });
    }

    public static function getPages(): array
    {
        return [
            'index' => ListIncomes::route('/'),
            // 'create' => CreateIncome::route('/create'),
            // 'edit' => EditIncome::route('/{record}/edit'),
        ];
    }
}
