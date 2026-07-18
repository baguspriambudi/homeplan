<?php

namespace Tests\Feature;

use App\Mail\NewRegistrationNotificationMail;
use App\Mail\PaymentOrderCreatedMail;
use App\Mail\RegistrationApprovedMail;
use App\Mail\SubscriptionRenewedMail;
use App\Models\Category;
use App\Models\FiscalYear;
use App\Models\Household;
use App\Models\PaymentOrder;
use App\Models\Plan;
use App\Models\User;
use App\Services\QrisService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SubscriptionFlowTest extends TestCase
{
    use RefreshDatabase;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->plan = Plan::create([
            'name' => 'Bulanan',
            'duration_days' => 30,
            'price' => 25000,
            'is_active' => true,
        ]);
    }

    private function superAdmin(): User
    {
        $admin = User::factory()->create();
        $admin->assignRole('super-admin');

        return $admin;
    }

    public function test_register_creates_payment_order_instead_of_user(): void
    {
        $response = $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'plan_id' => $this->plan->id,
        ]);

        $order = PaymentOrder::first();

        $this->assertNotNull($order);
        $this->assertSame('registration', $order->type);
        $this->assertSame('pending', $order->status);
        $this->assertSame(25000, $order->amount);
        $this->assertSame(25000 + $order->unique_code, $order->total_amount);
        $this->assertDatabaseMissing('users', ['email' => 'budi@example.com']);

        $response->assertRedirect(route('orders.pay', $order));
    }

    public function test_register_rejects_existing_user_email(): void
    {
        User::factory()->create(['email' => 'budi@example.com']);

        $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'plan_id' => $this->plan->id,
        ])->assertSessionHasErrors('email');
    }

    public function test_proof_upload_moves_order_to_waiting(): void
    {
        Storage::fake('local');

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
        ]);

        $this->post("/pay/{$order->code}/proof", [
            'proof' => UploadedFile::fake()->image('bukti.jpg'),
        ])->assertRedirect();

        $order->refresh();
        $this->assertSame('waiting_confirmation', $order->status);
        $this->assertNotNull($order->proof_path);
        Storage::disk('local')->assertExists($order->proof_path);
    }

    public function test_register_emails_payment_link(): void
    {
        Mail::fake();

        $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'plan_id' => $this->plan->id,
        ]);

        Mail::assertSent(PaymentOrderCreatedMail::class, fn ($mail) => $mail->hasTo('budi@example.com'));
    }

    public function test_register_notifies_owner_via_sender_address(): void
    {
        Mail::fake();
        config(['mail.from.address' => 'owner@example.com']);

        $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'plan_id' => $this->plan->id,
        ]);

        Mail::assertSent(NewRegistrationNotificationMail::class, function ($mail) {
            return $mail->hasTo('owner@example.com')
                && $mail->hasReplyTo('budi@example.com');
        });
    }

    public function test_register_with_active_order_reuses_it_and_explains_ignored_plan(): void
    {
        $other = Plan::create([
            'name' => 'Tahunan',
            'duration_days' => 365,
            'price' => 250000,
            'is_active' => true,
        ]);

        $existing = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
        ]);

        // Pilih paket berbeda — harus diarahkan ke order lama, bukan bikin tagihan kedua
        $response = $this->post('/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'plan_id' => $other->id,
        ]);

        $response->assertRedirect(route('orders.pay', $existing));
        $response->assertSessionHas('notice', fn ($notice) => str_contains($notice, 'Bulanan')
            && str_contains($notice, 'Tahunan'));
        $this->assertSame(1, PaymentOrder::count());
    }

    public function test_expired_order_still_accepts_proof_upload(): void
    {
        Storage::fake('local');

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
        ]);

        $order->update(['expires_at' => now()->subHour()]);
        $this->assertTrue($order->fresh()->isExpired());

        // QR tetap bisa dibayar di sisi bank, jadi pembayar telat tidak boleh dijegal
        $this->post("/pay/{$order->code}/proof", [
            'proof' => UploadedFile::fake()->image('bukti.jpg'),
        ])->assertRedirect();

        $order->refresh();
        $this->assertSame('waiting_confirmation', $order->status);
        $this->assertFalse($order->isExpired(), 'Order berstatus waiting tidak boleh dianggap kedaluwarsa.');
    }

    public function test_approve_registration_creates_user_and_sends_password_email(): void
    {
        Mail::fake();

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'status' => PaymentOrder::STATUS_WAITING,
        ]);

        $this->actingAs($this->superAdmin())
            ->post("/payment-orders/{$order->id}/approve")
            ->assertRedirect();

        $order->refresh();
        $user = User::where('email', 'budi@example.com')->first();

        $this->assertSame('approved', $order->status);
        $this->assertNotNull($user);
        $this->assertSame($user->id, $order->user_id);
        $this->assertTrue($user->hasRole('admin'));
        $this->assertNotNull($user->household_id);
        $this->assertSame('Rumah Budi', $user->household->name);
        $this->assertTrue($user->subscription_ends_at->isFuture());
        $this->assertEqualsWithDelta(
            now()->addDays(30)->timestamp,
            $user->subscription_ends_at->timestamp,
            5,
        );

        Mail::assertSent(RegistrationApprovedMail::class, fn ($mail) => $mail->hasTo('budi@example.com'));
    }

    public function test_approve_registration_provisions_categories_and_fiscal_year(): void
    {
        Mail::fake();

        // Household tertua berperan sebagai template master data
        $template = Household::create(['name' => 'Rumah Template']);
        $creator = User::factory()->create(['household_id' => $template->id]);

        foreach ([['FOOD', 'spending'], ['SALARY', 'income'], ['WIFI', 'bills']] as [$name, $type]) {
            $category = new Category(['name' => $name, 'type' => $type, 'created_by' => $creator->id]);
            $category->household_id = $template->id;
            $category->save();
        }

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'status' => PaymentOrder::STATUS_WAITING,
        ]);

        $this->actingAs($this->superAdmin())
            ->post("/payment-orders/{$order->id}/approve")
            ->assertRedirect();

        $user = User::where('email', 'budi@example.com')->first();

        $copied = Category::withoutGlobalScope('household')
            ->where('household_id', $user->household_id)
            ->get();

        $this->assertSame(
            ['FOOD' => 'spending', 'SALARY' => 'income', 'WIFI' => 'bills'],
            $copied->sortBy('name')->pluck('type', 'name')->all(),
        );
        $this->assertTrue($copied->every(fn ($c) => $c->created_by === $user->id));

        $fiscalYear = FiscalYear::withoutGlobalScope('household')
            ->where('household_id', $user->household_id)
            ->first();

        $this->assertNotNull($fiscalYear);
        $this->assertSame('open', $fiscalYear->status);
        $this->assertSame(now()->format('F Y'), $fiscalYear->name);
        $this->assertTrue($fiscalYear->start_date->isSameDay(now()->startOfMonth()));
        $this->assertTrue($fiscalYear->end_date->isSameDay(now()->endOfMonth()));
        $this->assertSame(0, (int) $fiscalYear->opening_balance);
    }

    public function test_approve_renewal_extends_subscription_and_sends_email(): void
    {
        Mail::fake();

        $user = User::factory()->create(['subscription_ends_at' => now()->subDay()]);

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_RENEWAL,
            'user_id' => $user->id,
            'status' => PaymentOrder::STATUS_WAITING,
        ]);

        $this->actingAs($this->superAdmin())
            ->post("/payment-orders/{$order->id}/approve")
            ->assertRedirect();

        $user->refresh();
        $this->assertTrue($user->subscription_ends_at->isFuture());
        $this->assertEqualsWithDelta(
            now()->addDays(30)->timestamp,
            $user->subscription_ends_at->timestamp,
            5,
        );

        Mail::assertSent(SubscriptionRenewedMail::class, fn ($mail) => $mail->hasTo($user->email));
    }

    public function test_expired_user_is_redirected_to_renewal_page(): void
    {
        $user = User::factory()->create(['subscription_ends_at' => now()->subDay()]);
        $user->assignRole('admin');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertRedirect(route('subscription.expired'));
    }

    public function test_active_user_is_not_redirected(): void
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $this->actingAs($user)->get('/dashboard')->assertOk();
    }

    public function test_super_admin_bypasses_subscription_check(): void
    {
        $admin = $this->superAdmin();
        $admin->update(['subscription_ends_at' => now()->subYear()]);

        $this->actingAs($admin)->get('/dashboard')->assertOk();
    }

    public function test_non_super_admin_cannot_manage_payment_orders(): void
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $order = PaymentOrder::createFor($this->plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'household_name' => 'Rumah Budi',
            'status' => PaymentOrder::STATUS_WAITING,
        ]);

        $this->actingAs($user)->post("/payment-orders/{$order->id}/approve")->assertForbidden();
        $this->actingAs($user)->get('/payment-orders')->assertForbidden();
        $this->actingAs($user)->get('/plans')->assertForbidden();
    }

    public function test_renew_creates_renewal_order(): void
    {
        $user = User::factory()->create(['subscription_ends_at' => now()->subDay()]);
        $user->assignRole('admin');

        $response = $this->actingAs($user)->post('/subscription/renew', [
            'plan_id' => $this->plan->id,
        ]);

        $order = PaymentOrder::where('type', PaymentOrder::TYPE_RENEWAL)->first();

        $this->assertNotNull($order);
        $this->assertSame($user->id, $order->user_id);
        $response->assertRedirect(route('orders.pay', $order));
    }

    public function test_qris_dynamic_payload_is_valid(): void
    {
        $svc = new QrisService;

        // Payload statis dummy dengan CRC valid
        $tlv = fn (string $t, string $v) => $t.str_pad((string) strlen($v), 2, '0', STR_PAD_LEFT).$v;
        $body = $tlv('00', '01').$tlv('01', '11').$tlv('26', '0014COM.EXAMPLE.WWW')
            .$tlv('52', '5812').$tlv('53', '360').$tlv('58', 'ID')
            .$tlv('59', 'Toko Test').$tlv('60', 'Jakarta').'6304';

        $crc = new \ReflectionMethod($svc, 'crc16');
        $static = $body.$crc->invoke($svc, $body);

        $dynamic = $svc->buildDynamicPayload($static, 25127);

        $this->assertStringContainsString('010212', $dynamic);       // dinamis
        $this->assertStringContainsString('540525127', $dynamic);    // nominal
        $this->assertSame(
            $crc->invoke($svc, substr($dynamic, 0, -4)),
            substr($dynamic, -4),
        );
        $this->assertStringStartsWith('<svg', $svc->toSvg($dynamic));
    }
}
