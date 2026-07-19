<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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
        ]);
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
