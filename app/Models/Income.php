<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// Tambahkan ini untuk notifikasi
use Filament\Notifications\Notification;

class Income extends Model
{
    use HasFactory;

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
        'income_date' => 'date',
        'amount' => 'decimal:2',
        'adjust_to_cash'  => 'boolean',
    ];

    protected function description(): Attribute
    {
        return Attribute::make(
            set: fn(string $value) => strtoupper($value),
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /* =====================
     |  STRICT BOOTED LOGIC
     ===================== */
    protected static function booted()
    {
        static::updating(function (Income $income) {
            $income->tempOldData = $income->getOriginal();
        });

        static::saved(function (Income $income) {
            DB::transaction(function () use ($income) {
                $balanceWasAdjusted = false;

                // Jika record baru
                if ($income->wasRecentlyCreated) {
                    $income->updateFiscalBalance(
                        $income->amount,
                        $income->income_date,
                        $income->adjust_to_cash,
                        'add'
                    );
                    $balanceWasAdjusted = $income->adjust_to_cash;
                } elseif ($income->wasChanged(['amount', 'income_date', 'adjust_to_cash'])) {
                    if ($income->tempOldData) {
                        $income->updateFiscalBalance(
                            $income->tempOldData['amount'],
                            $income->tempOldData['income_date'],
                            $income->tempOldData['adjust_to_cash'],
                            'sub'
                        );

                        $income->updateFiscalBalance(
                            $income->amount,
                            $income->income_date,
                            $income->adjust_to_cash,
                            'add'
                        );
                        $balanceWasAdjusted = $income->tempOldData['adjust_to_cash'] || $income->adjust_to_cash;
                    }
                }

                if ($balanceWasAdjusted) {
                    $amountFormatted = 'Rp ' . number_format($income->amount, 0, ',', '.');

                    if ($income->wasRecentlyCreated) {
                        Notification::make()
                            ->title('Saldo Awal Disesuaikan')
                            ->body("Income of {$amountFormatted} has been added to the opening balance.")
                            ->success()
                            ->send();
                    } elseif ($income->wasChanged()) {
                        Notification::make()
                            ->title('Saldo Awal Diperbarui')
                            ->body("A reduction in income of {$amountFormatted} has updated the opening balance.")
                            ->info()
                            ->send();
                    }
                }
            });
        });

        static::deleted(function (Income $income) {
            $income->updateFiscalBalance($income->amount, $income->income_date, $income->adjust_to_cash, 'sub');
            if ($income->adjust_to_cash) {
                $amountFormatted = 'Rp ' . number_format($income->amount, 0, ',', '.');
                Notification::make()
                    ->title('Saldo Awal Dikurangi')
                    ->body("The deletion of income {$amountFormatted} has reduced the opening balance.")
                    ->warning()
                    ->send();
            }
        });
    }

    /* =====================
     |  ATOMIC CALCULATION
     ===================== */
    protected function updateFiscalBalance($amount, $date, $adjustToCash, $action)
    {
        $fiscal = FiscalYear::where('status', 'open')
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->lockForUpdate()
            ->first();

        if (!$fiscal) {
            Log::warning('Attempted to adjust fiscal balance, but no open fiscal year was found.', [
                'date' => $date->format('Y-m-d'),
                'income_id' => $this->id ?? 'N/A',
            ]);
            return;
        }

        Log::info('Fiscal balance adjustment triggered.', [
            'fiscal_year_id' => $fiscal->id,
            'action' => $action,
            'amount' => $amount,
            'adjust_to_cash' => $adjustToCash,
            'current_balance' => $fiscal->opening_balance,
        ]);

        if ($adjustToCash) {
            if ($action === 'add') {
                $fiscal->increment('opening_balance', $amount);
            } else {
                $fiscal->decrement('opening_balance', $amount);
            }
        }
    }
}
