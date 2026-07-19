<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bahan sebuah menu. Tidak punya household_id sendiri —
 * isolasi mengikuti menu induknya.
 */
class MenuIngredient extends Model
{
    protected $fillable = [
        'menu_id',
        'name',
        'qty',
        'uom_id',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function uom(): BelongsTo
    {
        return $this->belongsTo(Uom::class);
    }
}
