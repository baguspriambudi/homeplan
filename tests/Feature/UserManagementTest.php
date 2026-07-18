<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private Household $household;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->household = Household::create(['name' => 'Rumah Uji']);

        // Admin household = pendaftar pemegang langganan
        $this->admin = User::factory()->create([
            'household_id' => $this->household->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $this->admin->assignRole('admin');
    }

    private function member(): User
    {
        $member = User::factory()->create([
            'household_id' => $this->household->id,
            'subscription_ends_at' => null,
        ]);
        $member->assignRole('user');

        return $member;
    }

    public function test_admin_created_member_is_always_role_user(): void
    {
        $this->actingAs($this->admin)->post('/users', [
            'name' => 'Istri',
            'email' => 'istri@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin', // dicoba diselundupkan — harus tetap jadi 'user'
        ]);

        $istri = User::where('email', 'istri@example.com')->first();

        $this->assertNotNull($istri);
        $this->assertTrue($istri->hasRole('user'));
        $this->assertSame($this->household->id, $istri->household_id);
    }

    public function test_member_without_own_subscription_follows_household_subscription(): void
    {
        $this->actingAs($this->member())
            ->get('/dashboard')
            ->assertOk();
    }

    public function test_member_is_blocked_when_household_subscription_expires(): void
    {
        $this->admin->update(['subscription_ends_at' => now()->subDay()]);

        $this->actingAs($this->member())
            ->get('/dashboard')
            ->assertRedirect(route('subscription.expired'));
    }

    public function test_member_can_view_users_but_cannot_create_or_delete(): void
    {
        $member = $this->member();

        $this->actingAs($member)->get('/users')->assertOk();

        $this->actingAs($member)->post('/users', [
            'name' => 'Penyusup',
            'email' => 'penyusup@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertForbidden();

        $this->actingAs($member)
            ->delete("/users/{$this->admin->id}")
            ->assertForbidden();

        $this->assertNotNull($this->admin->fresh());
    }

    public function test_member_can_edit_self_but_not_others(): void
    {
        $member = $this->member();

        $this->actingAs($member)->put("/users/{$member->id}", [
            'name' => 'Nama Baru',
            'email' => $member->email,
            'password' => '',
            'password_confirmation' => '',
        ])->assertRedirect();

        $this->assertSame('Nama Baru', $member->fresh()->name);

        $this->actingAs($member)->put("/users/{$this->admin->id}", [
            'name' => 'Dibajak',
            'email' => $this->admin->email,
        ])->assertForbidden();
    }

    public function test_admin_cannot_delete_own_account(): void
    {
        $this->actingAs($this->admin)->delete("/users/{$this->admin->id}");

        $this->assertNotNull($this->admin->fresh());
    }

    public function test_admin_cannot_manage_users_outside_own_household(): void
    {
        $otherHousehold = Household::create(['name' => 'Rumah Lain']);
        $outsider = User::factory()->create([
            'household_id' => $otherHousehold->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $outsider->assignRole('admin');

        $this->actingAs($this->admin)
            ->delete("/users/{$outsider->id}")
            ->assertForbidden();

        $this->actingAs($this->admin)
            ->put("/users/{$outsider->id}", [
                'name' => 'Dibajak',
                'email' => $outsider->email,
            ])->assertForbidden();
    }
}
