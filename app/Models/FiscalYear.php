<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHousehold;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FiscalYear extends Model
{
    use BelongsToHousehold, HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'opening_balance',
        'total_expenses',
        'remaining_amount',
        'status',
    ];

    protected $casts = [
        'start_date'      => 'date',
        'end_date'        => 'date',
        'opening_balance' => 'decimal:0',
        'total_expenses'  => 'decimal:0',
        'remaining_amount'=> 'decimal:0',
    ];

    protected static function booted(): void
    {
        static::updating(function (FiscalYear $fiscal) {
            if (!$fiscal->isDirty('status')) {
                return;
            }

            if ($fiscal->status === 'closed') {
                // Hitung expense milik household fiscal year ini, bukan household user login
                $total = Expense::withoutGlobalScope('household')
                    ->where('household_id', $fiscal->household_id)
                    ->whereBetween('expense_date', [
                        $fiscal->start_date,
                        $fiscal->end_date,
                    ])->sum('amount');

                $fiscal->total_expenses   = $total;
                $fiscal->remaining_amount = $fiscal->opening_balance - $total;
            }

            if ($fiscal->status === 'open') {
                $fiscal->total_expenses   = 0;
                $fiscal->remaining_amount = 0;
            }
        });
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    public function containsDate(Carbon $date): bool
    {
        return $date->between(
            $this->start_date->startOfDay(),
            $this->end_date->endOfDay()
        );
    }
}
