<?php

namespace App\Filament\Resources\FoodMenus\Pages;

use App\Filament\Resources\FoodMenus\FoodMenuResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFoodMenus extends ListRecords
{
    protected static string $resource = FoodMenuResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
