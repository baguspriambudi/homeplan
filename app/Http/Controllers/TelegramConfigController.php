<?php

namespace App\Http\Controllers;

use App\Console\Commands\TelegramPollCommand;
use App\Models\Household;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\Process\PhpExecutableFinder;

/**
 * Konfigurasi bot Telegram per household — tiap household memakai bot
 * buatannya sendiri (@BotFather), tokennya disimpan terenkripsi.
 */
class TelegramConfigController extends Controller
{
    public function index(): Response
    {
        $household = $this->household();

        return Inertia::render('telegram/index', [
            'configured' => $household->telegram_bot_token !== null,
            'botUsername' => $household->telegram_bot_username,
            'linkedMembers' => User::where('household_id', $household->id)
                ->whereNotNull('telegram_chat_id')
                ->count(),
            'pollerRunning' => Cache::has(TelegramPollCommand::HEARTBEAT_KEY),
        ]);
    }

    /**
     * Jalankan `telegram:poll` sebagai proses background — satu poller
     * melayani SEMUA household, jadi cukup satu yang hidup.
     */
    public function startPoller(): RedirectResponse
    {
        $this->household();

        if (Cache::has(TelegramPollCommand::HEARTBEAT_KEY)) {
            return back()->with('success', 'Poller sudah berjalan.');
        }

        if (! Household::whereNotNull('telegram_bot_token')->exists()) {
            throw ValidationException::withMessages([
                'token' => 'Belum ada bot yang dikonfigurasi — simpan token dulu.',
            ]);
        }

        $php = (new PhpExecutableFinder)->find(false) ?: 'php';
        $artisan = base_path('artisan');

        if (PHP_OS_FAMILY === 'Windows') {
            // `start "" /B` melepas proses dari request; cmd /c dalam kutip agar
            // redirect output milik proses anak, bukan pipe popen yang segera ditutup
            $inner = sprintf('"%s" "%s" telegram:poll >NUL 2>&1', $php, $artisan);
            pclose(popen('start "" /B cmd /c "' . $inner . '"', 'r'));
        } else {
            exec(sprintf(
                'nohup %s %s telegram:poll > /dev/null 2>&1 &',
                escapeshellarg($php),
                escapeshellarg($artisan),
            ));
        }

        return back()->with('success', 'Poller dijalankan.');
    }

    /** Kirim sinyal stop — poller berhenti rapi di putaran berikutnya. */
    public function stopPoller(): RedirectResponse
    {
        $this->household();

        Cache::put(TelegramPollCommand::STOP_KEY, true, 60);

        return back()->with('success', 'Sinyal stop dikirim — poller berhenti dalam beberapa detik.');
    }

    public function store(Request $request): RedirectResponse
    {
        $household = $this->household();

        $validated = $request->validate([
            'token' => ['required', 'string', 'max:100'],
        ]);

        // Verifikasi token langsung ke Telegram; sekaligus ambil username bot
        $me = (new TelegramService($validated['token']))->api('getMe');

        if (! ($me['ok'] ?? false)) {
            throw ValidationException::withMessages([
                'token' => 'Token tidak valid — salin ulang dari @BotFather.',
            ]);
        }

        $household->forceFill([
            'telegram_bot_token' => $validated['token'],
            'telegram_bot_username' => $me['result']['username'] ?? null,
        ])->save();

        return back()->with('success', 'Bot Telegram tersambung.');
    }

    public function destroy(): RedirectResponse
    {
        $this->household()->forceFill([
            'telegram_bot_token' => null,
            'telegram_bot_username' => null,
        ])->save();

        return back()->with('success', 'Konfigurasi bot Telegram dihapus.');
    }

    private function household(): Household
    {
        // Super admin tidak punya household — konfigurasi bot memang per household
        $household = Household::find(auth()->user()->household_id);

        abort_if(! $household, 403, 'Konfigurasi Telegram hanya untuk akun household.');

        return $household;
    }
}
