<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Household extends Model
{
    protected $fillable = ['name'];

    protected $casts = [
        // Token bot Telegram adalah rahasia — simpan terenkripsi
        'telegram_bot_token' => 'encrypted',
    ];

    protected $hidden = [
        'telegram_bot_token',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
