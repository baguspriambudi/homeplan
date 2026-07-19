<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('households', function (Blueprint $table) {
            // Token bot Telegram milik household (dari @BotFather).
            // text karena disimpan terenkripsi (cast 'encrypted' di model).
            $table->text('telegram_bot_token')->nullable()->after('name');
            $table->string('telegram_bot_username')->nullable()->after('telegram_bot_token');
        });
    }

    public function down(): void
    {
        Schema::table('households', function (Blueprint $table) {
            $table->dropColumn(['telegram_bot_token', 'telegram_bot_username']);
        });
    }
};
