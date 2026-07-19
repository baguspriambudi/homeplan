<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Penautan akun Telegram: buat kode sekali pakai (dikirim ke bot lewat
 * /link KODE) dan putuskan tautan.
 */
class TelegramController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->user()->forceFill([
            'telegram_link_code' => strtoupper(Str::random(8)),
        ])->save();

        return back();
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->forceFill([
            'telegram_chat_id' => null,
            'telegram_link_code' => null,
        ])->save();

        return back();
    }
}
