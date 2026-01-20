<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// Tambahkan ini untuk notifikasi
use Filament\Notifications\Notification;

class Expense extends Model
{
    use HasFactory;

    public $tempOldData = null;

    protected $fillable = [
        'category_id',
        'amount',
        'adjust_to_cash',
        'description',
        'expense_date',
        'created_by',
    ];

    protected $casts = [
        'expense_date' => 'date',
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
}
