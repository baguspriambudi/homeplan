<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Master satuan bahan (gr, kg, ml, ...) per household
        Schema::create('uoms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('household_id')->nullable()->index();
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();

            $table->unique(['household_id', 'name']);
        });

        // Master menu masakan per household
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('household_id')->nullable()->index();
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();
        });

        // Bahan-bahan sebuah menu (bagian dari master menu)
        Schema::create('menu_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('qty', 10, 2);
            $table->foreignId('uom_id')->constrained('uoms')->restrictOnDelete();
            $table->timestamps();
        });

        // Menu yang dijadwalkan pada tanggal + waktu makan (pagi/siang/sore) di kalender household
        Schema::create('meal_plan_items', function (Blueprint $table) {
            $table->id();
            $table->date('date')->index();
            $table->string('meal_time'); // pagi | siang | sore (konstanta MealPlanItem::MEAL_TIMES)
            $table->foreignId('menu_id')->constrained()->restrictOnDelete();
            $table->string('notes')->nullable();
            $table->unsignedBigInteger('household_id')->nullable()->index();
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_plan_items');
        Schema::dropIfExists('menu_ingredients');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('uoms');
    }
};
