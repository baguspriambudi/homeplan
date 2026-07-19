<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FiscalYear;
use App\Models\Household;
use App\Models\Income;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Otak bot Telegram: menerjemahkan pesan chat menjadi pencatatan expense/income.
 * Satu instance = satu bot milik satu household ($household) — user yang boleh
 * memakai bot ini hanya anggota household tersebut.
 *
 * PENTING: berjalan tanpa auth() (console/polling), sehingga global scope
 * BelongsToHousehold tidak memfilter apa pun — semua query di sini WAJIB
 * di-scope manual ke household user yang tertaut.
 */
class TelegramBotHandler
{
    /** Umur state percakapan (detik) sebelum dianggap kedaluwarsa */
    private const STATE_TTL = 600;

    public function __construct(
        private TelegramService $telegram,
        private Household $household,
    ) {
    }

    public function handleUpdate(array $update): void
    {
        if (isset($update['callback_query'])) {
            $this->handleCallback($update['callback_query']);

            return;
        }

        $message = $update['message'] ?? [];
        $chatId = $message['chat']['id'] ?? null;
        $text = trim($message['text'] ?? '');

        if ($chatId === null || $text === '') {
            return;
        }

        if (str_starts_with($text, '/start')) {
            $this->telegram->sendMessage($chatId, $this->helpText());

            return;
        }

        if (str_starts_with($text, '/link')) {
            $this->link($chatId, $text);

            return;
        }

        $user = $this->userFor($chatId);

        if (! $user) {
            $this->telegram->sendMessage(
                $chatId,
                "Akun belum tertaut. Buka <b>Settings → Profile</b> di aplikasi, buat kode tautan, lalu kirim:\n<code>/link KODE</code>",
            );

            return;
        }

        if (str_starts_with($text, '/unlink')) {
            $user->forceFill(['telegram_chat_id' => null])->save();
            $this->telegram->sendMessage($chatId, 'Tautan diputus. Sampai jumpa! 👋');

            return;
        }

        if (str_starts_with($text, '/batal')) {
            Cache::forget($this->stateKey($chatId));
            $this->telegram->sendMessage($chatId, 'Oke, dibatalkan.');

            return;
        }

        if (str_starts_with($text, '/saldo')) {
            $this->replyBalance($chatId, $user);

            return;
        }

        if (! $user->hasActiveSubscription()) {
            $this->telegram->sendMessage($chatId, 'Langganan household kamu sudah tidak aktif — perpanjang dulu lewat aplikasi ya.');

            return;
        }

        $entry = $this->parseEntry($text);

        if ($entry === null) {
            $this->telegram->sendMessage($chatId, "Formatnya belum saya kenali. 🙏\n\n".$this->helpText());

            return;
        }

        $entry['category_id'] = null;
        Cache::put($this->stateKey($chatId), $entry, self::STATE_TTL);

        if ($entry['type'] === null) {
            $this->telegram->sendMessage(
                $chatId,
                sprintf('%s%s — catat sebagai apa?', $this->rupiah($entry['amount']), $entry['description'] ? ' <i>('.e($entry['description']).')</i>' : ''),
                [[
                    ['text' => '🔴 Pengeluaran', 'callback_data' => 'type:expense'],
                    ['text' => '🟢 Pemasukan', 'callback_data' => 'type:income'],
                ]],
            );

            return;
        }

        $this->askCategory($chatId, $user, $entry);
    }

    private function handleCallback(array $callback): void
    {
        $chatId = $callback['message']['chat']['id'] ?? null;
        $data = $callback['data'] ?? '';

        if (isset($callback['id'])) {
            $this->telegram->answerCallback((string) $callback['id']);
        }

        if ($chatId === null) {
            return;
        }

        $user = $this->userFor($chatId);
        if (! $user) {
            return;
        }

        $state = Cache::get($this->stateKey($chatId));
        if (! is_array($state)) {
            $this->telegram->sendMessage($chatId, 'Sesi sudah kedaluwarsa — kirim ulang pencatatannya ya.');

            return;
        }

        [$action, $value] = array_pad(explode(':', $data, 2), 2, '');

        if ($action === 'type' && in_array($value, ['expense', 'income'], true)) {
            $state['type'] = $value;
            Cache::put($this->stateKey($chatId), $state, self::STATE_TTL);
            $this->askCategory($chatId, $user, $state);

            return;
        }

        if ($action === 'cat') {
            $category = Category::withoutGlobalScope('household')
                ->where('household_id', $user->household_id)
                ->find((int) $value);

            if (! $category) {
                $this->telegram->sendMessage($chatId, 'Kategori tidak ditemukan — kirim ulang pencatatannya ya.');
                Cache::forget($this->stateKey($chatId));

                return;
            }

            $state['category_id'] = $category->id;
            Cache::put($this->stateKey($chatId), $state, self::STATE_TTL);

            if ($state['type'] === 'income') {
                // Income punya opsi menambah saldo kas fiscal year berjalan
                $this->telegram->sendMessage($chatId, 'Tambahkan ke saldo kas (opening balance) fiscal year berjalan?', [[
                    ['text' => '💰 Ya, tambahkan', 'callback_data' => 'cash:1'],
                    ['text' => 'Tidak', 'callback_data' => 'cash:0'],
                ]]);

                return;
            }

            $this->storeExpense($chatId, $user, $state);

            return;
        }

        if ($action === 'cash' && $state['type'] === 'income' && $state['category_id'] !== null) {
            $this->storeIncome($chatId, $user, $state, $value === '1');
        }
    }

    // ── Alur pencatatan ─────────────────────────────────────────────

    private function askCategory(int|string $chatId, User $user, array $state): void
    {
        $categories = $this->categories($user, $state['type']);

        if ($categories->isEmpty()) {
            $this->telegram->sendMessage($chatId, 'Belum ada kategori yang cocok di household kamu — buat dulu lewat aplikasi.');
            Cache::forget($this->stateKey($chatId));

            return;
        }

        $keyboard = $categories
            ->map(fn (Category $c) => ['text' => $c->name, 'callback_data' => "cat:{$c->id}"])
            ->chunk(2)
            ->map(fn (Collection $row) => $row->values()->all())
            ->values()
            ->all();

        $label = $state['type'] === 'income' ? '🟢 Pemasukan' : '🔴 Pengeluaran';

        $this->telegram->sendMessage(
            $chatId,
            sprintf(
                "%s %s%s\nPilih kategorinya:",
                $label,
                $this->rupiah($state['amount']),
                $state['description'] ? ' — <i>'.e($state['description']).'</i>' : '',
            ),
            $keyboard,
        );
    }

    private function storeExpense(int|string $chatId, User $user, array $state): void
    {
        if (! $user->can('create expenses')) {
            $this->telegram->sendMessage($chatId, 'Kamu tidak punya izin mencatat pengeluaran.');
            Cache::forget($this->stateKey($chatId));

            return;
        }

        $date = now()->toDateString();
        $fiscal = $this->fiscalFor($user, $date);

        if (! $fiscal) {
            $this->telegram->sendMessage($chatId, 'Tidak ada fiscal year yang mencakup hari ini — buat dulu lewat aplikasi.');

            return;
        }

        if ($fiscal->isClosed()) {
            $this->telegram->sendMessage($chatId, 'Fiscal year untuk hari ini sudah ditutup.');

            return;
        }

        $spent = Expense::withoutGlobalScope('household')
            ->where('household_id', $user->household_id)
            ->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date])
            ->sum('amount');

        $remaining = (float) $fiscal->opening_balance - (float) $spent;

        if ($state['amount'] > $remaining) {
            $this->telegram->sendMessage($chatId, '⚠️ Saldo tidak cukup. Sisa saldo: <b>'.$this->rupiah($remaining).'</b>');

            return;
        }

        $expense = new Expense([
            'category_id' => $state['category_id'],
            'amount' => $state['amount'],
            'description' => $state['description'],
            'expense_date' => $date,
            'created_by' => $user->id,
        ]);
        $expense->household_id = $user->household_id;
        $expense->save();

        Cache::forget($this->stateKey($chatId));

        $category = Category::withoutGlobalScope('household')->find($state['category_id']);

        $this->telegram->sendMessage($chatId, sprintf(
            "✅ <b>Pengeluaran tercatat</b>\n💸 %s — %s\n📝 %s\n📅 %s\n💰 Sisa saldo: <b>%s</b>",
            $this->rupiah($state['amount']),
            e($category?->name ?? '-'),
            e($expense->description ?? '-'),
            now()->locale('id')->isoFormat('D MMM Y'),
            $this->rupiah($remaining - (float) $state['amount']),
        ));
    }

    private function storeIncome(int|string $chatId, User $user, array $state, bool $adjustToCash): void
    {
        if (! $user->can('create incomes')) {
            $this->telegram->sendMessage($chatId, 'Kamu tidak punya izin mencatat pemasukan.');
            Cache::forget($this->stateKey($chatId));

            return;
        }

        $income = new Income([
            'category_id' => $state['category_id'],
            'amount' => $state['amount'],
            'description' => $state['description'],
            'income_date' => now()->toDateString(),
            'adjust_to_cash' => $adjustToCash,
            'created_by' => $user->id,
        ]);
        $income->household_id = $user->household_id;
        $income->save(); // event model otomatis menambah saldo kas jika adjust_to_cash

        Cache::forget($this->stateKey($chatId));

        $category = Category::withoutGlobalScope('household')->find($state['category_id']);

        $this->telegram->sendMessage($chatId, sprintf(
            "✅ <b>Pemasukan tercatat</b>\n🟢 %s — %s\n📝 %s\n📅 %s%s",
            $this->rupiah($state['amount']),
            e($category?->name ?? '-'),
            e($income->description ?? '-'),
            now()->locale('id')->isoFormat('D MMM Y'),
            $adjustToCash ? "\n💰 Saldo kas fiscal year ikut bertambah." : '',
        ));
    }

    private function replyBalance(int|string $chatId, User $user): void
    {
        $fiscal = $this->fiscalFor($user, now()->toDateString());

        if (! $fiscal) {
            $this->telegram->sendMessage($chatId, 'Tidak ada fiscal year yang mencakup hari ini.');

            return;
        }

        $spent = Expense::withoutGlobalScope('household')
            ->where('household_id', $user->household_id)
            ->whereBetween('expense_date', [$fiscal->start_date, $fiscal->end_date])
            ->sum('amount');

        $this->telegram->sendMessage($chatId, sprintf(
            "📊 <b>%s</b>\n💰 Saldo awal: %s\n💸 Terpakai: %s\n✨ Sisa: <b>%s</b>",
            e($fiscal->name ?? 'Fiscal year berjalan'),
            $this->rupiah((float) $fiscal->opening_balance),
            $this->rupiah((float) $spent),
            $this->rupiah((float) $fiscal->opening_balance - (float) $spent),
        ));
    }

    // ── Penautan akun ───────────────────────────────────────────────

    private function link(int|string $chatId, string $text): void
    {
        $code = strtoupper(trim(substr($text, strlen('/link'))));

        if ($code === '') {
            $this->telegram->sendMessage($chatId, "Format: <code>/link KODE</code> — kodenya dibuat di halaman <b>Settings → Profile</b> aplikasi.");

            return;
        }

        $user = User::where('telegram_link_code', $code)->first();

        if (! $user) {
            $this->telegram->sendMessage($chatId, 'Kode tidak valid atau sudah dipakai. Buat kode baru di halaman Settings → Profile.');

            return;
        }

        // Bot ini milik satu household — anggota household lain harus memakai bot household-nya sendiri
        if ($user->household_id !== $this->household->id) {
            $this->telegram->sendMessage($chatId, 'Kode ini bukan milik anggota household bot ini. Pakai bot Telegram household kamu sendiri ya.');

            return;
        }

        // Satu chat hanya boleh tertaut ke satu user
        User::where('telegram_chat_id', (string) $chatId)->update(['telegram_chat_id' => null]);

        $user->forceFill([
            'telegram_chat_id' => (string) $chatId,
            'telegram_link_code' => null,
        ])->save();

        $this->telegram->sendMessage($chatId, sprintf(
            "✅ Terhubung sebagai <b>%s</b>.\n\n%s",
            e($user->name),
            $this->helpText(),
        ));
    }

    // ── Parsing ─────────────────────────────────────────────────────

    /**
     * "keluar 50rb makan siang" → type expense, amount 50000, deskripsi "makan siang".
     * Tanpa kata kunci keluar/masuk, type null (nanti ditanya lewat tombol).
     *
     * @return array{type: ?string, amount: float, description: ?string}|null
     */
    private function parseEntry(string $text): ?array
    {
        $tokens = preg_split('/\s+/', trim($text)) ?: [];

        if ($tokens === [] || str_starts_with($tokens[0], '/')) {
            return null;
        }

        $type = null;
        $first = strtolower($tokens[0]);

        if (in_array($first, ['keluar', 'out'], true)) {
            $type = 'expense';
            array_shift($tokens);
        } elseif (in_array($first, ['masuk', 'in'], true)) {
            $type = 'income';
            array_shift($tokens);
        }

        if ($tokens === []) {
            return null;
        }

        $amount = $this->parseAmount($tokens[0]);

        if ($amount === null || $amount < 1) {
            return null;
        }

        array_shift($tokens);

        return [
            'type' => $type,
            'amount' => $amount,
            'description' => $tokens === [] ? null : implode(' ', $tokens),
        ];
    }

    /** "50000" | "50.000" | "50rb" | "50k" | "2jt" | "1,5jt" → rupiah */
    private function parseAmount(string $raw): ?float
    {
        $raw = strtolower(trim($raw));

        if (! preg_match('/^(?:rp\.?)?(\d[\d.,]*)(rb|ribu|k|jt|juta)?$/', $raw, $m)) {
            return null;
        }

        $number = $m[1];
        $suffix = $m[2] ?? '';

        if (preg_match('/^\d{1,3}(?:[.,]\d{3})+$/', $number)) {
            // "50.000" / "1,500,000" = pemisah ribuan
            $value = (float) str_replace(['.', ','], '', $number);
        } else {
            // "1,5" / "1.5" = desimal
            $value = (float) str_replace(',', '.', $number);
        }

        return $value * match ($suffix) {
            'rb', 'ribu', 'k' => 1_000,
            'jt', 'juta' => 1_000_000,
            default => 1,
        };
    }

    // ── Util ────────────────────────────────────────────────────────

    private function userFor(int|string $chatId): ?User
    {
        // Dibatasi household pemilik bot — chat yang tertaut ke household lain dianggap tak dikenal
        return User::where('telegram_chat_id', (string) $chatId)
            ->where('household_id', $this->household->id)
            ->first();
    }

    private function categories(User $user, string $type): Collection
    {
        $query = Category::withoutGlobalScope('household')
            ->where('household_id', $user->household_id);

        if ($type === 'expense') {
            // Sama dengan halaman Expenses: semua tipe kecuali income & saving
            $query->whereNotIn('type', ['income', 'saving']);
        } else {
            // Halaman Incomes menawarkan semua kategori; tipe income ditaruh di depan
            $query->orderByRaw("type = 'income' desc");
        }

        return $query->orderBy('name')->get(['id', 'name', 'type']);
    }

    private function fiscalFor(User $user, string $date): ?FiscalYear
    {
        return FiscalYear::withoutGlobalScope('household')
            ->where('household_id', $user->household_id)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->first();
    }

    private function stateKey(int|string $chatId): string
    {
        return "telegram:state:{$this->household->id}:{$chatId}";
    }

    private function rupiah(float $value): string
    {
        return 'Rp '.number_format($value, 0, ',', '.');
    }

    private function helpText(): string
    {
        return "🤖 <b>MyExpense Bot</b>\n"
            ."Catat keuangan langsung dari chat:\n"
            ."• <code>keluar 50rb makan siang</code>\n"
            ."• <code>masuk 2jt gaji bulanan</code>\n"
            ."• <code>25000 parkir</code> (nanti ditanya jenisnya)\n\n"
            ."Format angka: 50000, 50.000, 50rb, 50k, 2jt, 1,5jt\n"
            ."Tanggal pencatatan selalu hari ini.\n\n"
            ."Perintah lain:\n"
            ."/saldo — sisa saldo fiscal year berjalan\n"
            ."/batal — batalkan pencatatan yang menggantung\n"
            ."/unlink — putuskan tautan akun";
    }
}
