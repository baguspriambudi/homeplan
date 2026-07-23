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
    /** Heartbeat yang diperbarui tiap putaran — dipakai UI untuk tahu poller hidup */
    public const HEARTBEAT_KEY = 'telegram:poll-heartbeat';

    /** Sinyal stop dari UI (tombol Stop di menu Telegram Bot) */
    public const STOP_KEY = 'telegram:poll-stop';

    /** Umur heartbeat; lewat dari ini poller dianggap mati */
    public const HEARTBEAT_TTL = 30;

    protected $signature = 'telegram:poll {--once : Proses satu putaran lalu berhenti (untuk uji coba)}';

    protected $description = 'Dengarkan bot Telegram semua household dan catat expense/income dari chat';

    public function handle(): int
    {
        if (! $this->option('once') && Cache::has(self::HEARTBEAT_KEY)) {
            $this->error('Poller lain terdeteksi masih berjalan — dua poller dengan token sama akan saling konflik.');

            return self::FAILURE;
        }

        if ($this->households()->isEmpty()) {
            $this->error('Belum ada household yang mengkonfigurasi bot Telegram — atur lewat menu Telegram Bot di aplikasi.');

            return self::FAILURE;
        }

        // Sinyal stop lama (mis. tombol Stop ditekan saat poller sudah mati)
        // tidak boleh langsung mematikan poller baru
        Cache::forget(self::STOP_KEY);

        $this->info(sprintf(
            'Mendengarkan bot dari %d household... (Ctrl+C untuk berhenti)',
            $this->households()->count(),
        ));

        do {
            Cache::put(self::HEARTBEAT_KEY, now()->timestamp, self::HEARTBEAT_TTL);

            if (Cache::pull(self::STOP_KEY)) {
                $this->info('Sinyal stop diterima — poller berhenti.');
                break;
            }

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

        Cache::forget(self::HEARTBEAT_KEY);

        return self::SUCCESS;
    }

    /** @return \Illuminate\Database\Eloquent\Collection<int, Household> */
    private function households()
    {
        return Household::whereNotNull('telegram_bot_token')->get();
    }
}
