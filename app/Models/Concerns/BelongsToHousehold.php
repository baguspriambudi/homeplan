<?php

namespace App\Models\Concerns;

use App\Models\Household;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Isolasi data per rumah tangga (multi-tenancy).
 *
 * - User biasa: query otomatis terfilter ke household miliknya.
 * - Super admin: melihat semua data, atau satu household jika memilih
 *   filter dari switcher (session 'household_filter').
 * - Saat membuat record, household_id otomatis terisi.
 */
trait BelongsToHousehold
{
    public static function bootBelongsToHousehold(): void
    {
        static::addGlobalScope('household', function (Builder $builder) {
            $user = auth()->user();
            if (! $user) {
                return; // console/seeder/unauthenticated: tanpa filter
            }

            $column = $builder->getModel()->qualifyColumn('household_id');

            if ($user->isSuperAdmin()) {
                if ($filter = session('household_filter')) {
                    $builder->where($column, $filter);
                }

                return;
            }

            $builder->where($column, $user->household_id);
        });

        static::creating(function ($model) {
            if ($model->household_id !== null) {
                return;
            }

            $user = auth()->user();
            if (! $user) {
                return;
            }

            $model->household_id = $user->isSuperAdmin()
                ? session('household_filter')
                : $user->household_id;
        });
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
