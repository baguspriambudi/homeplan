<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Income extends Model
{
    use \App\Models\Concerns\BelongsToHousehold, HasFactory;

    public $tempOldData = null;

    protected $fillable = [
        'category_id',
        'amount',
        'adjust_to_cash',
        'description',
        'income_date',
        'created_by',
    ];

    protected $casts = [
        'income_date'    => 'date',
        'amount'         => 'decimal:2',
        'adjust_to_cash' => 'boolean',
    ];

    protected function description(): Attribute
    {
        return Attribute::make(
            set: fn(?string $value) => $value ? strtoupper($value) : null,
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected static function booted(): void
    {
        static::updating(function (Income $income) {
            $income->tempOldData = $income->getOriginal();
        });

        static::saved(function (Income $income) {
            DB::transaction(function () use ($income) {
                if ($income->wasRecentlyCreated) {
                    $income->adjustFiscalBalance(
                        $income->amount,
                        $income->income_date,
                        $income->adjust_to_cash,
                        'add'
                    );
                } elseif ($income->wasChanged(['amount', 'income_date', 'adjust_to_cash'])) {
                    if ($income->tempOldData) {
                        $income->adjustFiscalBalance(
                            $income->tempOldData['amount'],
                            $income->tempOldData['income_date'],
                            $income->tempOldData['adjust_to_cash'],
                            'sub'
                        );
                        $income->adjustFiscalBalance(
                            $income->amount,
                            $income->income_date,
                            $income->adjust_to_cash,
                            'add'
                        );
                    }
                }
            });
        });

        static::deleted(function (Income $income) {
            $income->adjustFiscalBalance(
                $income->amount,
                $income->income_date,
                $income->adjust_to_cash,
                'sub'
            );
        });
    }

    protected function adjustFiscalBalance($amount, $date, bool $adjustToCash, string $action): void
    {
        if (!$adjustToCash) {
            return;
        }

        // Cari fiscal year milik household income ini (bukan household user yang login),
        // agar tetap benar saat super admin yang mengoperasikan.
        $fiscal = FiscalYear::withoutGlobalScope('household')
            ->where('household_id', $this->household_id)
            ->where('status', 'open')
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->lockForUpdate()
            ->first();

        if (!$fiscal) {
            Log::warning('No open fiscal year found for income balance adjustment.', [
                'date' => is_string($date) ? $date : $date->format('Y-m-d'),
                'income_id' => $this->id ?? 'N/A',
            ]);
            return;
        }

        if ($action === 'add') {
            $fiscal->increment('opening_balance', $amount);
        } else {
            $fiscal->decrement('opening_balance', $amount);
        }
    }
}
