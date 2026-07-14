<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = ['users', 'fiscal_years', 'categories', 'expenses', 'incomes'];

    public function up(): void
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->unsignedBigInteger('household_id')->nullable()->index();
            });
        }

        // Backfill: semua data lama masuk ke rumah tangga pertama.
        // Super admin (household_id null) tetap tanpa household agar bisa lihat semua.
        $householdId = DB::table('households')->insertGetId([
            'name'       => 'Rumah Bagus',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')
            ->whereNull('household_id')
            ->where('email', '!=', 'superadmin@myexpense.test')
            ->update(['household_id' => $householdId]);

        foreach (['fiscal_years', 'categories', 'expenses', 'incomes'] as $tableName) {
            DB::table($tableName)->whereNull('household_id')->update(['household_id' => $householdId]);
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('household_id');
            });
        }

        Schema::dropIfExists('households');
    }
};
