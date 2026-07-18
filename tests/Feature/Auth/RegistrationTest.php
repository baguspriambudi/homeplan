<?php

namespace Tests\Feature\Auth;

use App\Models\PaymentOrder;
use App\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_registering_creates_payment_order_without_authenticating()
    {
        $plan = Plan::create([
            'name' => 'Bulanan',
            'duration_days' => 30,
            'price' => 25000,
            'is_active' => true,
        ]);

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'household_name' => 'Rumah Test',
            'plan_id' => $plan->id,
        ]);

        // User baru dibuat setelah pembayaran dikonfirmasi admin — bukan saat submit
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);

        $order = PaymentOrder::where('email', 'test@example.com')->first();
        $this->assertNotNull($order);
        $response->assertRedirect(route('orders.pay', $order));
    }
}
