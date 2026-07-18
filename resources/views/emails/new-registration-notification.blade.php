<x-mail::message>
# Pendaftar Baru

**{{ $order->name }}** baru saja mendaftar dan menerima tautan pembayaran.

<x-mail::panel>
**Kode Order:** {{ $order->code }}<br>
**Nama:** {{ $order->name }}<br>
**Email:** {{ $order->email }}<br>
**Household:** {{ $order->household_name }}<br>
**Paket:** {{ $order->plan->name }} ({{ $order->plan->duration_days }} hari)<br>
**Total bayar:** Rp {{ number_format($order->total_amount, 0, ',', '.') }}
@if ($order->expires_at)
<br>**Batas waktu:** {{ $order->expires_at->translatedFormat('d F Y, H:i') }}
@endif
</x-mail::panel>

Order akan muncul di daftar konfirmasi pembayaran setelah pendaftar mengunggah bukti bayar. Balas email ini untuk menghubungi pendaftar secara langsung.

<x-mail::button :url="route('payment-orders.index')">
Buka Konfirmasi Pembayaran
</x-mail::button>

{{ config('app.name') }}
</x-mail::message>
