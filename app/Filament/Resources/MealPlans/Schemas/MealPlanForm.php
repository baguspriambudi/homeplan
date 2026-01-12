<?php

namespace App\Filament\Resources\MealPlans\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MealPlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('food_recipe_id')
                    ->required()
                    ->numeric(),
                DatePicker::make('meal_date')
                    ->required(),
                Select::make('meal_time')
                    ->options(['morning' => 'Morning', 'evening' => 'Evening'])
                    ->required(),
                TextInput::make('created_by')
                    ->required()
                    ->numeric(),
            ]);
    }
}
