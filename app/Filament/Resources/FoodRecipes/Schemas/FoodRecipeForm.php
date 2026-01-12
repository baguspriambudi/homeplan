<?php

namespace App\Filament\Resources\FoodRecipes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class FoodRecipeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('food_menu_id')
                    ->required()
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                Textarea::make('ingredients')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('instructions')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('estimated_cost')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                TextInput::make('calories')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('created_by')
                    ->required()
                    ->numeric(),
            ]);
    }
}
