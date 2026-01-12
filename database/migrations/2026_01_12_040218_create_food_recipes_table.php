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
        Schema::create('food_recipes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('food_menu_id')->index();

            $table->string('name');
            $table->longText('ingredients');
            $table->longText('instructions');
            $table->double('estimated_cost')->default(0);
            $table->double('calories')->default(0);
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_recipes');
    }
};
