<?php

namespace App\Console\Commands;

use App\Models\Household;
use App\Services\TelegramBotHandler;
use App\Services\TelegramService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Polling bot Telegram SEMUA household yang sudah mengkonfigurasi bot
 * (menu Telegram Bot). Satu proses melayani banyak bot secara round-robin,
 * jadi timeout per bot dibuat pendek. Jalankan berdampingan dengan
 * `php artisan serve`:
 *
 *   php artisan telegram:poll
 */
class TelegramPollCommand extends Command
{
    protected $signature = 'telegram:poll {--once : Proses satu putaran lalu berhenti (untuk uji coba)}';

    protected $description = 'Dengarkan bot Telegram semua household dan catat expense/income dari chat';

    public function handle(): int
    {
        if ($this->households()->isEmpty()) {
            $this->error('Belum ada household yang mengkonfigurasi bot Telegram — atur lewat menu Telegram Bot di aplikasi.');

            return self::FAILURE;
        }

        $this->info(sprintf(
            'Mendengarkan bot dari %d household... (Ctrl+C untuk berhenti)',
            $this->households()->count(),
        ));

        do {
            $gotUpdate = false;

            // Query ulang tiap putaran agar konfigurasi baru/dihapus langsung terpakai
            foreach ($this->households() as $household) {
                $service = new TelegramService($household->telegram_bot_token);
                $handler = new TelegramBotHandler($service, $household);

                $offsetKey = "telegram:poll-offset:{$household->id}";
                $offset = (int) Cache::get($offsetKey, 0);

                try {
                    $updates = $service->getUpdates($offset, timeout: 1);
                } catch (\Throwable $e) {
                    Log::error('Telegram getUpdates gagal', [
                        'household_id' => $household->id,
                        'error' => $e->getMessage(),
                    ]);

                    continue;
                }

                foreach ($updates as $update) {
                    $gotUpdate = true;
                    $offset = $update['update_id'] + 1;
                    Cache::put($offsetKey, $offset);

                    try {
                        $handler->handleUpdate($update);
                    } catch (\Throwable $e) {
                        // Satu pesan bermasalah tidak boleh mematikan bot
                        Log::error('Telegram update gagal diproses', [
                            'household_id' => $household->id,
                            'update_id' => $update['update_id'] ?? null,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            }

            if (! $gotUpdate && ! $this->option('once')) {
                sleep(2);
            }
        } while (! $this->option('once'));

        return self::SUCCESS;
    }

    /** @return \Illuminate\Database\Eloquent\Collection<int, Household> */
    private function households()
    {
        return Household::whereNotNull('telegram_bot_token')->get();
    }
}
