<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FiscalYearController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    Route::get('analytics', [AnalyticsController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('analytics');

    // Super admin: pilih household yang sedang dilihat (null = semua)
    Route::post('household-filter', function (\Illuminate\Http\Request $request) {
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

    // Admin: User Management
    Route::middleware('permission:manage users')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
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
});

require __DIR__ . '/settings.php';
