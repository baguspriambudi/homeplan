<?php

namespace App\Filament\Resources\FoodMenus\Pages;

use App\Filament\Resources\FoodMenus\FoodMenuResource;
use Filament\Resources\Pages\CreateRecord;
// Pastikan namespace ini yang di-import, bukan MaxWidth
use Filament\Support\Enums\Width;

class CreateFoodMenu extends CreateRecord
{
    protected static string $resource = FoodMenuResource::class;

    public function getHeading(): string
    {
        return '';
    }
}
