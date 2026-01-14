<?php

namespace App\Filament\Resources\Expenses;

use UnitEnum;
use BackedEnum;
use App\Models\Expense;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\Expenses\Pages\EditExpense;
use App\Filament\Resources\Expenses\Pages\ListExpenses;
use App\Filament\Resources\Expenses\Pages\CreateExpense;
use App\Filament\Resources\Expenses\Schemas\ExpenseForm;
use App\Filament\Resources\Expenses\Tables\ExpensesTable;

class ExpenseResource extends Resource
{
    protected static ?string $model = Expense::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ShoppingCart;

    protected static ?string $navigationLabel = 'Spending';

    protected static ?string $recordTitleAttribute = 'description';

    protected static string | UnitEnum | null $navigationGroup = 'Expenses';

    public static function form(Schema $schema): Schema
    {
        return ExpenseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ExpensesTable::configure($table);
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
                $query->where('type', '!=', 'income');
            });
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExpenses::route('/'),
            // 'create' => CreateExpense::route('/create'),
            // 'edit' => EditExpense::route('/{record}/edit'),
        ];
    }
}
