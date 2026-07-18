<?php

namespace App\Http\Controllers;

use App\Models\PaymentOrder;
use App\Services\QrisService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman pembayaran order (registrasi maupun perpanjangan).
 * Diakses lewat kode order acak — tidak butuh login.
 */
class OrderPaymentController extends Controller
{
    public function show(Request $request, PaymentOrder $order, QrisService $qris): Response
    {
        $order->load('plan:id,name,duration_days,price');

        $qrSvg = null;
        $staticPayload = (string) config('subscription.qris_static_payload');

        if ($order->status === PaymentOrder::STATUS_PENDING && ! $order->isExpired() && $staticPayload !== '') {
            try {
                $payload = $qris->buildDynamicPayload($staticPayload, $order->total_amount);
                $qrSvg = $qris->toSvg($payload);
            } catch (\Throwable $e) {
                Log::warning('Gagal membangun payload QRIS dinamis: '.$e->getMessage());
            }
        }

        return Inertia::render('payment/show', [
            'order' => [
                'code' => $order->code,
                'type' => $order->type,
                'name' => $order->name ?? $order->user?->name,
                'email' => $order->email ?? $order->user?->email,
                'household_name' => $order->household_name,
                'amount' => $order->amount,
                'unique_code' => $order->unique_code,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'reject_reason' => $order->reject_reason,
                'has_proof' => $order->proof_path !== null,
                'is_expired' => $order->isExpired(),
                'expires_at' => $order->expires_at?->toIso8601String(),
                'plan' => $order->plan,
            ],
            'qrSvg' => $qrSvg,
            'notice' => $request->session()->get('notice'),
        ]);
    }

    /**
     * Bukti tetap diterima walau order sudah kedaluwarsa: QR statis→dinamis dibuat
     * lokal sehingga tetap bisa dibayar di sisi bank kapan pun. Menolak upload akan
     * menjebak user yang terlanjur bayar telat — biar admin yang memutuskan.
     */
    public function uploadProof(Request $request, PaymentOrder $order): RedirectResponse
    {
        abort_unless(in_array($order->status, [
            PaymentOrder::STATUS_PENDING,
            PaymentOrder::STATUS_WAITING,
        ], true), 403, 'Order ini sudah diproses.');

        $request->validate([
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:4096'],
        ]);

        $path = $request->file('proof')->store('payment-proofs', 'local');

        $order->update([
            'proof_path' => $path,
            'status' => PaymentOrder::STATUS_WAITING,
        ]);

        return back()->with('success', 'Bukti pembayaran terkirim. Mohon tunggu konfirmasi admin.');
    }
}
