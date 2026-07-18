<?php

namespace App\Http\Controllers;

use App\Mail\RegistrationApprovedMail;
use App\Mail\SubscriptionRenewedMail;
use App\Models\Household;
use App\Models\PaymentOrder;
use App\Models\User;
use App\Services\HouseholdProvisioner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PaymentOrderController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->can('manage payments'), 403);

        $orders = PaymentOrder::with(['plan:id,name,duration_days', 'user:id,name,email', 'approver:id,name'])
            ->latest()
            ->get();

        return Inertia::render('payment-orders/index', [
            'orders' => $orders,
        ]);
    }

    public function proof(PaymentOrder $order): BinaryFileResponse
    {
        abort_if(! auth()->user()->can('manage payments'), 403);
        abort_if($order->proof_path === null, 404);
        abort_unless(Storage::disk('local')->exists($order->proof_path), 404);

        return response()->file(Storage::disk('local')->path($order->proof_path));
    }

    public function approve(PaymentOrder $order): RedirectResponse
    {
        abort_if(! auth()->user()->can('manage payments'), 403);

        if ($order->status !== PaymentOrder::STATUS_WAITING) {
            return back()->with('error', 'Only orders waiting for confirmation can be approved.');
        }

        $plainPassword = null;

        try {
            DB::transaction(function () use ($order, &$plainPassword) {
                if ($order->type === PaymentOrder::TYPE_REGISTRATION) {
                    if (User::where('email', $order->email)->exists()) {
                        throw new \RuntimeException('Email sudah terdaftar sebagai user.');
                    }

                    $plainPassword = Str::password(12, symbols: false);

                    $household = Household::create(['name' => $order->household_name]);

                    $user = User::create([
                        'name' => $order->name,
                        'email' => $order->email,
                        'password' => $plainPassword,
                        'household_id' => $household->id,
                        'subscription_ends_at' => now()->addDays($order->plan->duration_days),
                    ]);
                    $user->email_verified_at = now();
                    $user->save();

                    $user->assignRole('admin');

                    // Master data awal: copy kategori + fiscal year bulan berjalan
                    app(HouseholdProvisioner::class)->provision($household, $user);

                    $order->user_id = $user->id;
                } else {
                    $user = $order->user;

                    if (! $user) {
                        throw new \RuntimeException('User pemilik order tidak ditemukan.');
                    }

                    // Perpanjang dari sisa masa aktif jika masih ada, kalau tidak dari sekarang
                    $base = $user->subscription_ends_at?->isFuture()
                        ? $user->subscription_ends_at
                        : now();

                    $user->subscription_ends_at = $base->copy()->addDays($order->plan->duration_days);
                    $user->save();
                }

                $order->status = PaymentOrder::STATUS_APPROVED;
                $order->approved_by = auth()->id();
                $order->approved_at = now();
                $order->save();
            });
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        // Kirim email setelah transaksi sukses — gagal kirim tidak membatalkan approval
        try {
            $order->refresh()->load(['plan', 'user']);

            if ($order->type === PaymentOrder::TYPE_REGISTRATION) {
                Mail::to($order->email)->send(new RegistrationApprovedMail($order, $plainPassword));
            } else {
                Mail::to($order->user->email)->send(new SubscriptionRenewedMail($order));
            }
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim email konfirmasi order '.$order->code.': '.$e->getMessage());

            return back()->with('success', 'Order approved, but the notification email failed to send. Check the mail configuration.');
        }

        return back()->with('success', 'Order approved. Credentials have been emailed to the user.');
    }

    public function reject(Request $request, PaymentOrder $order): RedirectResponse
    {
        abort_if(! auth()->user()->can('manage payments'), 403);

        if (! in_array($order->status, [PaymentOrder::STATUS_PENDING, PaymentOrder::STATUS_WAITING], true)) {
            return back()->with('error', 'Only unprocessed orders can be rejected.');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $order->update([
            'status' => PaymentOrder::STATUS_REJECTED,
            'reject_reason' => $validated['reason'],
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Order rejected.');
    }
}
