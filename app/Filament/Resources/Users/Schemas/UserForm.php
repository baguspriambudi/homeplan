<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->revealable() // Fitur keren v4 untuk lihat/sembunyi password
                    ->label('Password')
                    ->maxLength(255)
                    ->dehydrated(fn($state) => filled($state)) // HANYA kirim data jika diisi
                    ->required(fn($livewire) => $livewire instanceof CreateRecord) // WAJIB saat buat user baru
                    ->same('password_confirmation') // Opsional: jika pakai konfirmasi
                    ->helperText(fn($livewire) => $livewire instanceof CreateRecord
                        ? null
                        : 'Leave blank to keep current password'),

                TextInput::make('password_confirmation')
                    ->password()
                    ->revealable()
                    ->label('Confirm Password')
                    ->required(fn($livewire) => $livewire instanceof CreateRecord)
                    ->visible(fn($livewire) => ! ($livewire instanceof \Filament\Resources\Pages\ViewRecord))
                    ->dehydrated(false), // Jangan simpan kolom ini ke database
                Select::make('roles')
                    ->relationship('roles', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
            ]);
    }
}
