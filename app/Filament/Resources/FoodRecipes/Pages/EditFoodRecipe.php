<?php

namespace App\Filament\Resources\FoodRecipes\Pages;

use App\Filament\Resources\FoodRecipes\FoodRecipeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFoodRecipe extends EditRecord
{
    protected static string $resource = FoodRecipeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
