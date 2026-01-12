<?php

namespace App\Filament\Resources\FoodRecipes;

use App\Filament\Resources\FoodRecipes\Pages\CreateFoodRecipe;
use App\Filament\Resources\FoodRecipes\Pages\EditFoodRecipe;
use App\Filament\Resources\FoodRecipes\Pages\ListFoodRecipes;
use App\Filament\Resources\FoodRecipes\Schemas\FoodRecipeForm;
use App\Filament\Resources\FoodRecipes\Tables\FoodRecipesTable;
use App\Models\FoodRecipe;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FoodRecipeResource extends Resource
{
    protected static ?string $model = FoodRecipe::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | UnitEnum | null $navigationGroup = 'Meals';

    public static function form(Schema $schema): Schema
    {
        return FoodRecipeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FoodRecipesTable::configure($table);
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
            'index' => ListFoodRecipes::route('/'),
            'create' => CreateFoodRecipe::route('/create'),
            'edit' => EditFoodRecipe::route('/{record}/edit'),
        ];
    }
}
