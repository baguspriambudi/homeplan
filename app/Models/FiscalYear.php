<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class FiscalYear extends Model
{
    use HasFactory;

    protected $table = 'fiscal_years';

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'opening_balance',
        'total_expenses',
        'remaining_amount',
        'status',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'start_date'        => 'date',
        'end_date'          => 'date',
        'opening_balance'   => 'decimal:0',
        'total_expenses'    => 'decimal:0',
        'remaining_amount' => 'decimal:0',
    ];

    /**
     * Relationships
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * MODEL EVENTS
     * - Hitung total_expenses & remaining_amount
     *   HANYA saat status berubah ke "closed"
     */
    protected static function booted()
    {
        static::updating(function (FiscalYear $fiscal) {
            if (!$fiscal->isDirty('status')) {
                return;
            }

            if ($fiscal->status === 'closed') {
                // Kita hitung manual berdasarkan range tanggal fiscal year ini
                // Mengambil model Expense secara langsung
                $total = Expense::whereBetween('expense_date', [
                    $fiscal->start_date,
                    $fiscal->end_date
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

    /**
     * Scopes
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    /**
     * Helpers
     */
    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    /**
     * Optional helper
     * Cek apakah tanggal tertentu ada di fiscal ini
     */
    public function containsDate(Carbon $date): bool
    {
        return $date->between(
            $this->start_date->startOfDay(),
            $this->end_date->endOfDay()
        );
    }

    /**
     * Safety helper
     * Mencegah perubahan data setelah closed (opsional dipakai)
     */
    public function canBeModified(): bool
    {
        return $this->status !== 'closed';
    }
}
