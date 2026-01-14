<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

class CategoryForm
{
    /**
     * Menggunakan penamaan label Bahasa Inggris yang standar
     */
    public static function configure($schema)
    {
        return $schema
            ->columns(1)
            ->components([
                Select::make('type')
                    ->label('Transaction Type')
                    ->options([
                        'spending' => 'Spending',
                        'bills' => 'Bills',
                        'instalment' => 'Instalment',
                        'income' => 'Income',
                    ])
                    ->default('spending')
                    ->required()
                    ->native(false),

                Textarea::make('name')
                    ->label('Category Name')
                    ->placeholder('e.g. Office Supplies')
                    ->required(),

                Hidden::make('created_by')
                    ->default(auth()->id())
                    ->required(),
            ]);
    }
}
