<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FiscalYearController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderPaymentController;
use App\Http\Controllers\PaymentOrderController;
use App\Http\Controllers\TelegramConfigController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Route::has('register'),
        'plans' => \App\Models\Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get(['id', 'name', 'duration_days', 'price', 'description']),
    ]);
})->name('home');

// Registrasi berbayar (menggantikan register bawaan Fortify)
Route::middleware('guest')->group(function () {
    Route::get('register', [RegistrationController::class, 'create'])->name('register');
    Route::post('register', [RegistrationController::class, 'store'])->name('register.store');
});

// Halaman pembayaran order — diakses via kode acak, tanpa login
Route::get('pay/{order}', [OrderPaymentController::class, 'show'])->name('orders.pay');
Route::post('pay/{order}/proof', [OrderPaymentController::class, 'uploadProof'])
    ->middleware('throttle:10,1')
    ->name('orders.proof');

// Perpanjangan langganan — login diperlukan, tapi tidak dicek masa aktif
Route::middleware('auth')->group(function () {
    Route::get('subscription/expired', [SubscriptionController::class, 'expired'])->name('subscription.expired');
    Route::post('subscription/renew', [SubscriptionController::class, 'renew'])->name('subscription.renew');
});

Route::middleware(['auth', 'verified', 'subscription.active'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    Route::get('analytics', [AnalyticsController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('analytics');

    // Super admin: pilih household yang sedang dilihat (null = semua)
    Route::post('household-filter', function (Request $request) {
        abort_unless($request->user()->isSuperAdmin(), 403);

        $validated = $request->validate([
            'household_id' => ['nullable', 'integer', 'exists:households,id'],
        ]);

        if ($validated['household_id'] ?? null) {
            session(['household_filter' => (int) $validated['household_id']]);
        } else {
            session()->forget('household_filter');
        }

        return back();
    })->name('household-filter');

    // Finance — permission dicek per-action di controller
    Route::resource('expenses', ExpenseController::class)->except(['create', 'edit', 'show']);
    Route::resource('incomes', IncomeController::class)->except(['create', 'edit', 'show']);
    Route::resource('fiscal-years', FiscalYearController::class)->except(['create', 'edit', 'show']);
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);

    // Meal planning — permission dicek per-action di controller
    Route::resource('uoms', UomController::class)->except(['create', 'edit', 'show']);
    Route::resource('menus', MenuController::class)->except(['create', 'edit', 'show']);
    Route::get('meal-plans', [MealPlanController::class, 'index'])->name('meal-plans.index');
    Route::post('meal-plans', [MealPlanController::class, 'store'])->name('meal-plans.store');
    Route::delete('meal-plans/{meal_plan_item}', [MealPlanController::class, 'destroy'])->name('meal-plans.destroy');

    // Konfigurasi bot Telegram per household (admin household)
    Route::middleware('permission:manage telegram')->group(function () {
        Route::get('/telegram-config', [TelegramConfigController::class, 'index'])->name('telegram-config.index');
        Route::post('/telegram-config', [TelegramConfigController::class, 'store'])->name('telegram-config.store');
        Route::delete('/telegram-config', [TelegramConfigController::class, 'destroy'])->name('telegram-config.destroy');
    });

    // Admin: User Management
    Route::middleware('permission:view users')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    });
    Route::middleware('permission:manage users')->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Admin: Role Management
    Route::middleware('permission:manage roles')->group(function () {
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::patch('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.update-permissions');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
        Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    });

    // Super admin: Master Harga (Plans)
    Route::middleware('permission:manage plans')->group(function () {
        Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');
        Route::post('/plans', [PlanController::class, 'store'])->name('plans.store');
        Route::patch('/plans/{plan}', [PlanController::class, 'update'])->name('plans.update');
        Route::delete('/plans/{plan}', [PlanController::class, 'destroy'])->name('plans.destroy');
    });

    // Super admin: Konfirmasi Pembayaran
    Route::middleware('permission:manage payments')->group(function () {
        Route::get('/payment-orders', [PaymentOrderController::class, 'index'])->name('payment-orders.index');
        Route::get('/payment-orders/{order:id}/proof', [PaymentOrderController::class, 'proof'])->name('payment-orders.proof');
        Route::post('/payment-orders/{order:id}/approve', [PaymentOrderController::class, 'approve'])->name('payment-orders.approve');
        Route::post('/payment-orders/{order:id}/reject', [PaymentOrderController::class, 'reject'])->name('payment-orders.reject');
    });
});

require __DIR__.'/settings.php';
