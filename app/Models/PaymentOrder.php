<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PaymentOrder extends Model
{
    public const TYPE_REGISTRATION = 'registration';

    public const TYPE_RENEWAL = 'renewal';

    public const STATUS_PENDING = 'pending';

    public const STATUS_WAITING = 'waiting_confirmation';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'code',
        'type',
        'plan_id',
        'user_id',
        'name',
        'email',
        'household_name',
        'amount',
        'unique_code',
        'total_amount',
        'status',
        'proof_path',
        'reject_reason',
        'approved_by',
        'approved_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'unique_code' => 'integer',
            'total_amount' => 'integer',
            'approved_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function isExpired(): bool
    {
        return $this->status === self::STATUS_PENDING
            && $this->expires_at !== null
            && $this->expires_at->isPast();
    }

    /**
     * Buat order baru untuk sebuah plan dengan kode unik pembayaran
     * (nominal ditambah 1-999 rupiah agar mudah dicocokkan di mutasi rekening).
     */
    public static function createFor(Plan $plan, array $attributes): self
    {
        $uniqueCode = random_int(1, 999);

        return self::create([
            'code' => strtoupper(Str::random(20)),
            'plan_id' => $plan->id,
            'amount' => $plan->price,
            'unique_code' => $uniqueCode,
            'total_amount' => $plan->price + $uniqueCode,
            'status' => self::STATUS_PENDING,
            'expires_at' => now()->addHours((int) config('subscription.order_ttl_hours')),
            ...$attributes,
        ]);
    }
}
