<?php

namespace App\Filament\Resources\FoodRecipes\Pages;

use App\Filament\Resources\FoodRecipes\FoodRecipeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFoodRecipe extends CreateRecord
{
    protected static string $resource = FoodRecipeResource::class;
}
