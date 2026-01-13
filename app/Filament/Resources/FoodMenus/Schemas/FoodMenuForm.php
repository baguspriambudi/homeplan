<?php

namespace App\Filament\Resources\FoodMenus\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Hidden;

class FoodMenuForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    Section::make('Food Menu')
                        ->description('Create a new food menu item.')
                        ->schema([
                            TextInput::make('name')
                                ->label('Nama Menu')
                                ->required()
                                ->columnSpanFull(),

                            Textarea::make('description')
                                ->label('Deskripsi')
                                ->rows(3)
                                ->columnSpanFull(),

                            Hidden::make('created_by')
                                ->default(fn() => auth()->id())
                                ->dehydrated(),
                        ])
                        ->columns(2),
                ])
                    ->columnSpanFull()
                    ->extraAttributes([
                        // UBAH NILAI DI BAWAH INI:
                        // max-w-5xl = 1024px (Lebar standar yang nyaman)
                        // max-w-6xl = 1152px
                        // max-w-7xl = 1280px
                        'class' => 'mx-auto w-full max-w-5xl',
                        'style' => 'max-width: 1000px;', // Anda juga bisa set manual dalam pixel di sini
                    ]),
            ]);
    }
}
