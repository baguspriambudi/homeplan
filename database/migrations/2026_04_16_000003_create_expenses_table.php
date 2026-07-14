<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->index();
            $table->decimal('amount', 15, 2);
            $table->boolean('adjust_to_cash')->default(false);
            $table->string('description')->nullable();
            $table->date('expense_date');
            $table->unsignedBigInteger('created_by')->index();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->restrictOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
