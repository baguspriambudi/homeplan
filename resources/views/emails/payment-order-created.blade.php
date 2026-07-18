<x-mail::message>
# Selesaikan Pembayaran Anda

Halo **{{ $order->name ?? $order->user?->name }}**, tagihan Anda sudah kami buat.
Simpan email ini — tautan di bawah adalah cara membuka kembali halaman pembayaran Anda.

<x-mail::panel>
**Kode Order:** {{ $order->code }}<br>
**Paket:** {{ $order->plan->name }} ({{ $order->plan->duration_days }} hari)<br>
**Total bayar:** Rp {{ number_format($order->total_amount, 0, ',', '.') }}
@if ($order->expires_at)
<br>**Batas waktu:** {{ $order->expires_at->translatedFormat('d F Y, H:i') }}
@endif
</x-mail::panel>

Bayar tepat sampai angka terakhir — termasuk kode unik **{{ $order->unique_code }}** — agar pembayaran Anda mudah kami cocokkan. Setelah itu upload bukti pembayaran di halaman berikut.

<x-mail::button :url="route('orders.pay', $order)">
Buka Halaman Pembayaran
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
