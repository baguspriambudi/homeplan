<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHousehold;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Menu yang dijadwalkan pada satu tanggal + waktu makan di kalender household.
 */
class MealPlanItem extends Model
{
    use BelongsToHousehold;

    /** Waktu makan — konstanta, bukan master data */
    public const MEAL_TIMES = ['pagi', 'siang', 'sore'];

    protected $fillable = [
        'date',
        'meal_time',
        'menu_id',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
