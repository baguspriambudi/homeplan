<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Chat Telegram yang tertaut ke user (null = belum tertaut)
            $table->string('telegram_chat_id')->nullable()->unique()->after('subscription_ends_at');
            // Kode sekali pakai untuk perintah /link dari bot
            $table->string('telegram_link_code', 16)->nullable()->unique()->after('telegram_chat_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['telegram_chat_id', 'telegram_link_code']);
        });
    }
};
