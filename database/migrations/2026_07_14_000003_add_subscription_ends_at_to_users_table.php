<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('subscription_ends_at')->nullable()->after('household_id');
        });

        // Data lama: semua user yang sudah ada diberi masa aktif gratis 1 tahun
        DB::table('users')
            ->whereNull('subscription_ends_at')
            ->update(['subscription_ends_at' => now()->addYear()]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('subscription_ends_at');
        });
    }
};
