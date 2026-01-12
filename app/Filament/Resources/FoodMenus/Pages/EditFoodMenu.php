<?php

namespace App\Filament\Resources\FoodMenus\Pages;

use App\Filament\Resources\FoodMenus\FoodMenuResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFoodMenu extends EditRecord
{
    protected static string $resource = FoodMenuResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
