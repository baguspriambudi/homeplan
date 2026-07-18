<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\NewRegistrationNotificationMail;
use App\Mail\PaymentOrderCreatedMail;
use App\Models\PaymentOrder;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'plans' => Plan::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('price')
                ->get(['id', 'name', 'duration_days', 'price', 'description']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'household_name' => ['required', 'string', 'max:255'],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
        ]);

        $plan = Plan::where('is_active', true)->findOrFail($validated['plan_id']);
        $email = strtolower($validated['email']);

        // Jika masih ada order aktif untuk email ini, arahkan ke order tersebut
        $existing = PaymentOrder::with('plan:id,name')
            ->where('type', PaymentOrder::TYPE_REGISTRATION)
            ->where('email', $email)
            ->whereIn('status', [PaymentOrder::STATUS_PENDING, PaymentOrder::STATUS_WAITING])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->latest()
            ->first();

        if ($existing) {
            return redirect()->route('orders.pay', $existing)
                ->with('notice', $this->existingOrderNotice($existing, $plan));
        }

        $order = PaymentOrder::createFor($plan, [
            'type' => PaymentOrder::TYPE_REGISTRATION,
            'name' => $validated['name'],
            'email' => $email,
            'household_name' => $validated['household_name'],
        ]);

        $this->sendOrderMail($order);
        $this->notifyOwner($order);

        return redirect()->route('orders.pay', $order);
    }

    /**
     * Order aktif dipakai ulang agar tidak terbit tagihan ganda — jelaskan ke user,
     * terutama saat paket yang dia pilih barusan berbeda dari paket order lamanya.
     */
    private function existingOrderNotice(PaymentOrder $existing, Plan $chosen): string
    {
        if ($existing->plan_id !== $chosen->id) {
            return "Anda masih punya tagihan aktif untuk paket {$existing->plan->name}, jadi pilihan paket {$chosen->name} belum diterapkan. Selesaikan atau tunggu tagihan ini kedaluwarsa dulu.";
        }

        return 'Anda sudah punya tagihan aktif — kami arahkan ke tagihan yang sama agar tidak terjadi pembayaran ganda.';
    }

    /**
     * Kirim tautan pembayaran. Gagal kirim tidak boleh membatalkan order yang sudah jadi.
     */
    private function sendOrderMail(PaymentOrder $order): void
    {
        try {
            Mail::to($order->email)->send(new PaymentOrderCreatedMail($order->load('plan')));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim tautan pembayaran order '.$order->code.': '.$e->getMessage());
        }
    }

    /**
     * Beri tahu owner ada pendaftar baru. Penerima memakai alamat pengirim
     * aplikasi (MAIL_FROM_ADDRESS) sehingga tidak butuh konfigurasi tambahan.
     */
    private function notifyOwner(PaymentOrder $order): void
    {
        $owner = (string) config('mail.from.address');

        if ($owner === '') {
            return;
        }

        try {
            Mail::to($owner)->send(new NewRegistrationNotificationMail($order->load('plan')));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim notifikasi pendaftar baru order '.$order->code.': '.$e->getMessage());
        }
    }
}
