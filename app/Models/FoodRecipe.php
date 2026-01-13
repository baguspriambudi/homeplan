<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodRecipe extends Model
{
    protected $table = 'food_recipes';

    protected $fillable = [
        'food_menu_id',
        'name',
        'ingredients',
        'instructions',
        'estimated_cost',
        'calories',
        'created_by',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
    ];

    /**
     * Resep milik satu menu
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(FoodMenu::class, 'food_menu_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
