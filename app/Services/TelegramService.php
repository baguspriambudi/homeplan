<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Klien tipis ke Bot API Telegram (api.telegram.org).
 * Token per household — dibuat lewat menu Telegram Bot di aplikasi
 * (bukan env global), sehingga tiap household memakai botnya sendiri.
 */
class TelegramService
{
    public function __construct(private string $token)
    {
    }

    /** @return array<string, mixed> respons JSON mentah dari Telegram */
    public function api(string $method, array $params = [], int $timeout = 15): array
    {
        $response = Http::timeout($timeout)
            ->post("https://api.telegram.org/bot{$this->token}/{$method}", $params);

        return $response->json() ?? [];
    }

    /**
     * Ambil update baru. $timeout > 0 = long-polling (menunggu di sisi Telegram).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getUpdates(int $offset, int $timeout = 25): array
    {
        $result = $this->api('getUpdates', [
            'offset' => $offset,
            'timeout' => $timeout,
            'allowed_updates' => ['message', 'callback_query'],
        ], $timeout + 10);

        return $result['result'] ?? [];
    }

    /** @param array<int, array<int, array{text: string, callback_data: string}>>|null $inlineKeyboard */
    public function sendMessage(int|string $chatId, string $text, ?array $inlineKeyboard = null): void
    {
        $params = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ];

        if ($inlineKeyboard !== null) {
            $params['reply_markup'] = json_encode(['inline_keyboard' => $inlineKeyboard]);
        }

        $this->api('sendMessage', $params);
    }

    /** Menghentikan spinner loading pada tombol inline yang ditekan */
    public function answerCallback(string $callbackQueryId, ?string $text = null): void
    {
        $params = ['callback_query_id' => $callbackQueryId];
        if ($text !== null) {
            $params['text'] = $text;
        }

        $this->api('answerCallbackQuery', $params);
    }
}
