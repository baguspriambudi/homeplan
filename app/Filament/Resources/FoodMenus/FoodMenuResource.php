<?php

namespace App\Filament\Resources\FoodMenus;

use App\Filament\Resources\FoodMenus\Pages\CreateFoodMenu;
use App\Filament\Resources\FoodMenus\Pages\EditFoodMenu;
use App\Filament\Resources\FoodMenus\Pages\ListFoodMenus;
use App\Filament\Resources\FoodMenus\Schemas\FoodMenuForm;
use App\Filament\Resources\FoodMenus\Tables\FoodMenusTable;
use App\Models\FoodMenu;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FoodMenuResource extends Resource
{
    protected static ?string $model = FoodMenu::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | UnitEnum | null $navigationGroup = 'Meals';

    public static function form(Schema $schema): Schema
    {
        return FoodMenuForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FoodMenusTable::configure($table);
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
            'index' => ListFoodMenus::route('/'),
            'create' => CreateFoodMenu::route('/create'),
            'edit' => EditFoodMenu::route('/{record}/edit'),
        ];
    }
}
