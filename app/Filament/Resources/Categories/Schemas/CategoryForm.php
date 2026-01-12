<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

class CategoryForm
{
    /**
     * Menggunakan penamaan label Bahasa Inggris yang standar
     */
    public static function configure($schema)
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Category Name') // Label diganti ke Bahasa Inggris
                    ->placeholder('e.g. Office Supplies')
                    ->required(),

                Select::make('type')
                    ->label('Transaction Type') // Label diganti ke Bahasa Inggris
                    ->options([
                        'spending' => 'Spending',
                        'bills' => 'Bills',
                        'instalment' => 'Instalment',
                        'income' => 'Income',
                    ])
                    ->default('spending')
                    ->required()
                    ->native(false), // Opsional: Tampilan Select yang lebih modern

                Hidden::make('created_by')
                    ->default(auth()->id())
                    ->required(),
            ]);
    }
}
