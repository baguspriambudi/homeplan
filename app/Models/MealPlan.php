<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlan extends Model
{
    protected $table = 'meal_plans';

    protected $fillable = [
        'food_recipe_id',
        'meal_date',
        'meal_time',
        'created_by',
    ];

    protected $casts = [
        'meal_date' => 'date',
    ];

    /**
     * Jadwal makan mengacu ke satu resep
     */
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(FoodRecipe::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
