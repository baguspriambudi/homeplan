<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser; // 1. Tambahkan ini
use Filament\Panel; // 2. Tambahkan ini
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser // 3. Tambahkan implements
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // 4. Tambahkan Method ini untuk memberi izin akses
    public function canAccessPanel(Panel $panel): bool
    {
        // Untuk sementara agar bisa masuk, set ke true.
        // Jika ingin lebih aman: return $this->hasRole('admin'); 
        return true; 
    }
}