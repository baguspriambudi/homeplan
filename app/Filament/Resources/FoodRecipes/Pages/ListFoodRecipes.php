<?php

namespace App\Filament\Resources\FoodRecipes\Pages;

use App\Filament\Resources\FoodRecipes\FoodRecipeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFoodRecipes extends ListRecords
{
    protected static string $resource = FoodRecipeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
