<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['registration', 'renewal']);
            $table->foreignId('plan_id')->constrained()->restrictOnDelete();

            // Renewal: user pemilik order. Registration: diisi setelah approve.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Data pendaftar (hanya untuk type registration)
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('household_name')->nullable();

            $table->unsignedBigInteger('amount');          // harga plan
            $table->unsignedSmallInteger('unique_code');   // kode unik 3 digit
            $table->unsignedBigInteger('total_amount');    // amount + unique_code

            $table->enum('status', ['pending', 'waiting_confirmation', 'approved', 'rejected'])
                ->default('pending')
                ->index();
            $table->string('proof_path')->nullable();
            $table->string('reject_reason')->nullable();

            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
    }
};
