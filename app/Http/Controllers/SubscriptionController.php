<?php

namespace App\Http\Controllers;

use App\Mail\PaymentOrderCreatedMail;
use App\Models\PaymentOrder;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Halaman "masa aktif habis" berisi pilihan paket perpanjangan.
     */
    public function expired(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->hasActiveSubscription()) {
            return redirect()->route('dashboard');
        }

        // Order perpanjangan yang masih berjalan (belum dibayar / menunggu konfirmasi)
        $pendingOrder = PaymentOrder::where('type', PaymentOrder::TYPE_RENEWAL)
            ->where('user_id', $user->id)
            ->whereIn('status', [PaymentOrder::STATUS_PENDING, PaymentOrder::STATUS_WAITING])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->latest()
            ->first();

        return Inertia::render('subscription/expired', [
            'plans' => Plan::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('price')
                ->get(['id', 'name', 'duration_days', 'price', 'description']),
            'subscriptionEndsAt' => $user->subscription_ends_at?->toIso8601String(),
            'pendingOrderCode' => $pendingOrder?->code,
        ]);
    }

    public function renew(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
        ]);

        $user = $request->user();
        $plan = Plan::where('is_active', true)->findOrFail($validated['plan_id']);

        $existing = PaymentOrder::with('plan:id,name')
            ->where('type', PaymentOrder::TYPE_RENEWAL)
            ->where('user_id', $user->id)
            ->whereIn('status', [PaymentOrder::STATUS_PENDING, PaymentOrder::STATUS_WAITING])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->latest()
            ->first();

        if ($existing) {
            return redirect()->route('orders.pay', $existing)
                ->with('notice', $existing->plan_id !== $plan->id
                    ? "Anda masih punya tagihan aktif untuk paket {$existing->plan->name}, jadi pilihan paket {$plan->name} belum diterapkan. Selesaikan atau tunggu tagihan ini kedaluwarsa dulu."
                    : 'Anda sudah punya tagihan aktif — kami arahkan ke tagihan yang sama agar tidak terjadi pembayaran ganda.');
        }

        $order = PaymentOrder::createFor($plan, [
            'type' => PaymentOrder::TYPE_RENEWAL,
            'user_id' => $user->id,
        ]);

        // Gagal kirim email tidak boleh membatalkan order yang sudah jadi
        try {
            Mail::to($user->email)->send(new PaymentOrderCreatedMail($order->load('plan')));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim tautan pembayaran order '.$order->code.': '.$e->getMessage());
        }

        return redirect()->route('orders.pay', $order);
    }
}
