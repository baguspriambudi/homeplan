<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'household_id',
        'subscription_ends_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'subscription_ends_at' => 'datetime',
        ];
    }

    public function hasActiveSubscription(): bool
    {
        // Super admin tidak pernah kena cek masa aktif
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->subscription_ends_at !== null && $this->subscription_ends_at->isFuture()) {
            return true;
        }

        // Masa aktif berlaku per household: anggota tanpa tanggal sendiri
        // ikut masa aktif pemegang langganan (admin household yang membayar)
        return $this->household_id !== null
            && static::where('household_id', $this->household_id)
                ->where('subscription_ends_at', '>', now())
                ->exists();
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }
}
