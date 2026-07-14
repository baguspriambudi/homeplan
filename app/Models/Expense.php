<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHousehold;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use BelongsToHousehold, HasFactory;

    protected $fillable = [
        'category_id',
        'amount',
        'adjust_to_cash',
        'description',
        'expense_date',
        'created_by',
    ];

    protected $casts = [
        'expense_date'   => 'date',
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
}
