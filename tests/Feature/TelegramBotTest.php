<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FiscalYear;
use App\Models\Household;
use App\Models\Income;
use App\Models\User;
use App\Services\TelegramBotHandler;
use App\Services\TelegramService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramBotTest extends TestCase
{
    use RefreshDatabase;

    private const CHAT_ID = 999;

    private const BOT_TOKEN = 'test-token';

    private Household $household;

    private User $admin;

    private Category $foodCategory;

    private Category $salaryCategory;

    private FiscalYear $fiscal;

    protected function setUp(): void
    {
        parent::setUp();

        // getMe → valid (kecuali token "bad-token"), lainnya → ok kosong
        Http::fake(function (ClientRequest $request) {
            if (str_contains($request->url(), '/getMe')) {
                return str_contains($request->url(), 'bad-token')
                    ? Http::response(['ok' => false])
                    : Http::response(['ok' => true, 'result' => ['username' => 'RumahUjiBot']]);
            }

            return Http::response(['ok' => true, 'result' => []]);
        });

        $this->seed(RolePermissionSeeder::class);

        $this->household = Household::create(['name' => 'Rumah Uji']);
        $this->household->forceFill([
            'telegram_bot_token' => self::BOT_TOKEN,
            'telegram_bot_username' => 'RumahUjiBot',
        ])->save();

        $this->admin = User::factory()->create([
            'household_id' => $this->household->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $this->admin->assignRole('admin');

        $this->foodCategory = $this->category('Makanan', 'spending');
        $this->salaryCategory = $this->category('Gaji', 'income');

        $fiscal = new FiscalYear([
            'name' => now()->format('F Y'),
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
            'opening_balance' => 1_000_000,
            'total_expenses' => 0,
            'remaining_amount' => 0,
            'status' => 'open',
        ]);
        $fiscal->household_id = $this->household->id;
        $fiscal->save();
        $this->fiscal = $fiscal;
    }

    private function category(string $name, string $type): Category
    {
        $category = new Category(['name' => $name, 'type' => $type, 'created_by' => $this->admin->id]);
        $category->household_id = $this->household->id;
        $category->save();

        return $category;
    }

    private function handler(): TelegramBotHandler
    {
        return new TelegramBotHandler(new TelegramService(self::BOT_TOKEN), $this->household->refresh());
    }

    private function linkChat(): void
    {
        $this->admin->forceFill(['telegram_chat_id' => (string) self::CHAT_ID])->save();
    }

    private function sendMessage(string $text, int $chatId = self::CHAT_ID): void
    {
        $this->handler()->handleUpdate([
            'update_id' => 1,
            'message' => ['chat' => ['id' => $chatId], 'text' => $text],
        ]);
    }

    private function sendCallback(string $data, int $chatId = self::CHAT_ID): void
    {
        $this->handler()->handleUpdate([
            'update_id' => 2,
            'callback_query' => [
                'id' => 'cb-1',
                'data' => $data,
                'message' => ['chat' => ['id' => $chatId]],
            ],
        ]);
    }

    // ── Konfigurasi bot per household ───────────────────────────────

    public function test_admin_can_configure_household_bot(): void
    {
        $this->household->forceFill(['telegram_bot_token' => null, 'telegram_bot_username' => null])->save();

        $this->actingAs($this->admin)
            ->post('/telegram-config', ['token' => '123456:valid-token'])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->household->refresh();
        $this->assertSame('123456:valid-token', $this->household->telegram_bot_token);
        // Username bot diambil otomatis dari getMe
        $this->assertSame('RumahUjiBot', $this->household->telegram_bot_username);
    }

    public function test_invalid_bot_token_is_rejected(): void
    {
        $this->actingAs($this->admin)
            ->post('/telegram-config', ['token' => 'bad-token'])
            ->assertSessionHasErrors('token');
    }

    public function test_member_cannot_manage_telegram_config(): void
    {
        $member = User::factory()->create([
            'household_id' => $this->household->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $member->assignRole('user');

        $this->actingAs($member)->get('/telegram-config')->assertForbidden();
        $this->actingAs($member)->post('/telegram-config', ['token' => 'x'])->assertForbidden();
    }

    public function test_admin_can_disconnect_bot(): void
    {
        $this->actingAs($this->admin)->delete('/telegram-config')->assertRedirect();

        $this->household->refresh();
        $this->assertNull($this->household->telegram_bot_token);
        $this->assertNull($this->household->telegram_bot_username);
    }

    // ── Penautan akun ───────────────────────────────────────────────

    public function test_settings_page_generates_link_code(): void
    {
        $this->actingAs($this->admin)
            ->post('/settings/telegram/link-code')
            ->assertRedirect();

        $this->assertNotNull($this->admin->refresh()->telegram_link_code);
        $this->assertSame(8, strlen($this->admin->telegram_link_code));
    }

    public function test_link_command_attaches_chat_and_burns_code(): void
    {
        $this->admin->forceFill(['telegram_link_code' => 'ABCD1234'])->save();

        $this->sendMessage('/link ABCD1234', 555);

        $this->admin->refresh();
        $this->assertSame('555', $this->admin->telegram_chat_id);
        $this->assertNull($this->admin->telegram_link_code);
    }

    public function test_link_code_of_other_household_is_rejected(): void
    {
        $other = Household::create(['name' => 'Rumah Lain']);
        $outsider = User::factory()->create([
            'household_id' => $other->id,
            'telegram_link_code' => null,
        ]);
        $outsider->forceFill(['telegram_link_code' => 'ZZZZ9999'])->save();

        // Kode milik anggota household lain dikirim ke bot household ini
        $this->sendMessage('/link ZZZZ9999', 555);

        $this->assertNull($outsider->refresh()->telegram_chat_id);
    }

    // ── Pencatatan ──────────────────────────────────────────────────

    public function test_expense_is_recorded_from_chat(): void
    {
        $this->linkChat();

        $this->sendMessage('keluar 50rb makan siang');
        $this->sendCallback("cat:{$this->foodCategory->id}");

        $expense = Expense::withoutGlobalScope('household')->first();

        $this->assertNotNull($expense);
        $this->assertSame($this->household->id, $expense->household_id);
        $this->assertSame($this->foodCategory->id, $expense->category_id);
        $this->assertSame($this->admin->id, $expense->created_by);
        $this->assertEquals(50000, (float) $expense->amount);
        $this->assertSame('MAKAN SIANG', $expense->description);
        $this->assertSame(now()->toDateString(), $expense->expense_date->toDateString());
    }

    public function test_entry_without_type_keyword_asks_then_records(): void
    {
        $this->linkChat();

        $this->sendMessage('25000 parkir');
        $this->sendCallback('type:expense');
        $this->sendCallback("cat:{$this->foodCategory->id}");

        $expense = Expense::withoutGlobalScope('household')->first();

        $this->assertNotNull($expense);
        $this->assertEquals(25000, (float) $expense->amount);
        $this->assertSame('PARKIR', $expense->description);
    }

    public function test_expense_exceeding_balance_is_rejected(): void
    {
        $this->linkChat();

        $this->sendMessage('keluar 2jt jajan besar');
        $this->sendCallback("cat:{$this->foodCategory->id}");

        $this->assertSame(0, Expense::withoutGlobalScope('household')->count());
    }

    public function test_income_with_cash_adjustment_increases_fiscal_balance(): void
    {
        $this->linkChat();

        $this->sendMessage('masuk 2jt gaji bulanan');
        $this->sendCallback("cat:{$this->salaryCategory->id}");
        $this->sendCallback('cash:1');

        $income = Income::withoutGlobalScope('household')->first();

        $this->assertNotNull($income);
        $this->assertEquals(2_000_000, (float) $income->amount);
        $this->assertTrue($income->adjust_to_cash);
        $this->assertEquals(3_000_000, (float) $this->fiscal->refresh()->opening_balance);
    }

    public function test_decimal_shorthand_amount_is_parsed(): void
    {
        $this->linkChat();

        $this->sendMessage('masuk 1,5jt bonus proyek');
        $this->sendCallback("cat:{$this->salaryCategory->id}");
        $this->sendCallback('cash:0');

        $income = Income::withoutGlobalScope('household')->first();

        $this->assertNotNull($income);
        $this->assertEquals(1_500_000, (float) $income->amount);
        $this->assertFalse($income->adjust_to_cash);
        // Tanpa adjust_to_cash saldo kas tidak berubah
        $this->assertEquals(1_000_000, (float) $this->fiscal->refresh()->opening_balance);
    }

    public function test_unlinked_chat_cannot_record(): void
    {
        $this->sendMessage('keluar 50rb makan siang', 777);

        $this->assertSame(0, Expense::withoutGlobalScope('household')->count());
    }

    public function test_chat_linked_to_other_household_cannot_use_this_bot(): void
    {
        // Chat 999 tertaut ke user household LAIN — bot household ini harus menolak
        $other = Household::create(['name' => 'Rumah Lain']);
        $outsider = User::factory()->create([
            'household_id' => $other->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $outsider->assignRole('admin');
        $outsider->forceFill(['telegram_chat_id' => (string) self::CHAT_ID])->save();

        $this->sendMessage('keluar 50rb makan siang');

        $this->assertSame(0, Expense::withoutGlobalScope('household')->count());
    }

    public function test_category_of_other_household_is_rejected(): void
    {
        $this->linkChat();

        $other = Household::create(['name' => 'Rumah Lain']);
        $foreignCategory = new Category(['name' => 'Asing', 'type' => 'spending', 'created_by' => $this->admin->id]);
        $foreignCategory->household_id = $other->id;
        $foreignCategory->save();

        $this->sendMessage('keluar 50rb makan siang');
        $this->sendCallback("cat:{$foreignCategory->id}");

        $this->assertSame(0, Expense::withoutGlobalScope('household')->count());
    }
}
