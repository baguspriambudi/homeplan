<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodMenu extends Model
{
    protected $table = 'food_menus';

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];

    /**
     * Satu menu punya banyak resep
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(FoodRecipe::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
