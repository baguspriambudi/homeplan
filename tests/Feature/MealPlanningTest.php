<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\MealPlanItem;
use App\Models\Menu;
use App\Models\Uom;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MealPlanningTest extends TestCase
{
    use RefreshDatabase;

    private Household $household;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->household = Household::create(['name' => 'Rumah Uji']);

        $this->admin = User::factory()->create([
            'household_id' => $this->household->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $this->admin->assignRole('admin');
    }

    private function uom(string $name = 'gr', ?int $householdId = null): Uom
    {
        $uom = new Uom(['name' => $name, 'created_by' => $this->admin->id]);
        $uom->household_id = $householdId ?? $this->household->id;
        $uom->save();

        return $uom;
    }

    private function menu(string $name = 'Ayam Goreng'): Menu
    {
        $menu = new Menu(['name' => $name, 'created_by' => $this->admin->id]);
        $menu->household_id = $this->household->id;
        $menu->save();

        $menu->ingredients()->create([
            'name' => 'Ayam',
            'qty' => 1,
            'uom_id' => $this->uom('kg-'.uniqid())->id,
        ]);

        return $menu;
    }

    private function scheduleItem(Menu $menu, ?string $date = null, string $mealTime = 'siang'): MealPlanItem
    {
        $item = new MealPlanItem([
            'date' => $date ?? now()->toDateString(),
            'meal_time' => $mealTime,
            'menu_id' => $menu->id,
            'created_by' => $this->admin->id,
        ]);
        $item->household_id = $this->household->id;
        $item->save();

        return $item;
    }

    public function test_admin_can_create_uom(): void
    {
        $this->actingAs($this->admin)->post('/uoms', ['name' => 'kg'])->assertRedirect();

        $this->assertDatabaseHas('uoms', [
            'name' => 'kg',
            'household_id' => $this->household->id,
        ]);
    }

    public function test_menu_is_created_with_ingredients_and_comma_qty(): void
    {
        $gr = $this->uom('gr');

        $this->actingAs($this->admin)->post('/menus', [
            'name' => 'Ayam Goreng Lengkuas',
            'description' => 'Menu andalan',
            'ingredients' => [
                ['name' => 'Ayam', 'qty' => '0,5', 'uom_id' => $gr->id],
                ['name' => 'Lengkuas', 'qty' => '100', 'uom_id' => $gr->id],
            ],
        ])->assertRedirect();

        $menu = Menu::withoutGlobalScope('household')->where('name', 'Ayam Goreng Lengkuas')->first();

        $this->assertNotNull($menu);
        $this->assertSame($this->household->id, $menu->household_id);
        $this->assertCount(2, $menu->ingredients);
        // Qty berkoma "0,5" harus tersimpan sebagai 0.5
        $this->assertEquals(0.5, (float) $menu->ingredients->firstWhere('name', 'Ayam')->qty);
    }

    public function test_menu_requires_at_least_one_ingredient(): void
    {
        $this->actingAs($this->admin)->post('/menus', [
            'name' => 'Menu Kosong',
            'ingredients' => [],
        ])->assertSessionHasErrors('ingredients');
    }

    public function test_menu_rejects_uom_from_other_household(): void
    {
        $other = Household::create(['name' => 'Rumah Lain']);
        $foreignUom = $this->uom('gr', $other->id);

        $this->actingAs($this->admin)->post('/menus', [
            'name' => 'Menu Nakal',
            'ingredients' => [
                ['name' => 'Ayam', 'qty' => '1', 'uom_id' => $foreignUom->id],
            ],
        ])->assertSessionHasErrors('ingredients.0.uom_id');
    }

    public function test_menu_can_be_scheduled_on_multiple_dates(): void
    {
        $menu = $this->menu();
        $dates = [now()->toDateString(), now()->addDay()->toDateString(), now()->addDays(3)->toDateString()];

        $this->actingAs($this->admin)->post('/meal-plans', [
            'dates' => $dates,
            'meal_time' => 'siang',
            'menu_id' => $menu->id,
            'notes' => 'porsi double',
        ])->assertRedirect();

        $this->assertSame(3, MealPlanItem::withoutGlobalScope('household')->count());
        $this->assertDatabaseHas('meal_plan_items', [
            'date' => $dates[0],
            'meal_time' => 'siang',
            'menu_id' => $menu->id,
            'notes' => 'porsi double',
            'household_id' => $this->household->id,
        ]);
    }

    public function test_schedule_rejects_invalid_meal_time(): void
    {
        $menu = $this->menu();

        $this->actingAs($this->admin)->post('/meal-plans', [
            'dates' => [now()->toDateString()],
            'meal_time' => 'malam',
            'menu_id' => $menu->id,
        ])->assertSessionHasErrors('meal_time');
    }

    public function test_duplicate_schedule_on_same_date_and_time_is_rejected(): void
    {
        $menu = $this->menu();
        $payload = [
            'dates' => [now()->toDateString()],
            'meal_time' => 'pagi',
            'menu_id' => $menu->id,
        ];

        $this->actingAs($this->admin)->post('/meal-plans', $payload)->assertRedirect();
        $this->actingAs($this->admin)->post('/meal-plans', $payload)->assertSessionHasErrors('dates');

        $this->assertSame(1, MealPlanItem::withoutGlobalScope('household')->count());

        // Waktu lain di tanggal yang sama tetap boleh
        $this->actingAs($this->admin)->post('/meal-plans', array_merge($payload, ['meal_time' => 'sore']))
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->assertSame(2, MealPlanItem::withoutGlobalScope('household')->count());
    }

    public function test_menu_of_other_household_cannot_be_scheduled(): void
    {
        $other = Household::create(['name' => 'Rumah Lain']);
        $foreignMenu = new Menu(['name' => 'Menu Asing', 'created_by' => $this->admin->id]);
        $foreignMenu->household_id = $other->id;
        $foreignMenu->save();

        $this->actingAs($this->admin)->post('/meal-plans', [
            'dates' => [now()->toDateString()],
            'meal_time' => 'sore',
            'menu_id' => $foreignMenu->id,
        ])->assertNotFound();
    }

    public function test_uom_in_use_cannot_be_deleted(): void
    {
        $menu = $this->menu();
        $uom = $menu->ingredients->first()->uom_id;

        $this->actingAs($this->admin)->delete("/uoms/{$uom}");

        $this->assertDatabaseHas('uoms', ['id' => $uom]);
    }

    public function test_scheduled_menu_cannot_be_deleted(): void
    {
        $menu = $this->menu();
        $this->scheduleItem($menu);

        $this->actingAs($this->admin)->delete("/menus/{$menu->id}");

        $this->assertDatabaseHas('menus', ['id' => $menu->id]);
    }

    public function test_scheduled_item_of_other_household_cannot_be_deleted(): void
    {
        $item = $this->scheduleItem($this->menu());

        $other = Household::create(['name' => 'Rumah Lain']);
        $outsider = User::factory()->create([
            'household_id' => $other->id,
            'subscription_ends_at' => now()->addMonth(),
        ]);
        $outsider->assignRole('admin');

        $this->actingAs($outsider)->delete("/meal-plans/{$item->id}")->assertNotFound();
        $this->assertDatabaseHas('meal_plan_items', ['id' => $item->id]);
    }

    public function test_admin_can_remove_scheduled_item(): void
    {
        $item = $this->scheduleItem($this->menu());

        $this->actingAs($this->admin)->delete("/meal-plans/{$item->id}")->assertRedirect();

        $this->assertDatabaseMissing('meal_plan_items', ['id' => $item->id]);
    }

    public function test_new_registration_gets_default_uoms(): void
    {
        $household = Household::create(['name' => 'Rumah Provision']);
        $owner = User::factory()->create(['household_id' => $household->id]);

        app(\App\Services\HouseholdProvisioner::class)->provision($household, $owner);

        $this->assertSame(
            count(\App\Services\HouseholdProvisioner::DEFAULT_UOMS),
            Uom::withoutGlobalScope('household')->where('household_id', $household->id)->count(),
        );
        $this->assertDatabaseHas('uoms', ['household_id' => $household->id, 'name' => 'gr']);
    }
}
