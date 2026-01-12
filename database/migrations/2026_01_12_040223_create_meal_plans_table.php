<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meal_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('food_recipe_id')->index();
            $table->date('meal_date');
            $table->enum('meal_time', ['morning', 'evening']);
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();
            $table->unique(['meal_date', 'meal_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_plans');
    }
};
