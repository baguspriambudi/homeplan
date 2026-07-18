<x-mail::message>
# Perpanjangan Berhasil

Halo **{{ $order->user->name }}**, pembayaran perpanjangan Anda telah kami konfirmasi.

<x-mail::panel>
**Paket:** {{ $order->plan->name }}<br>
**Aktif hingga:** {{ $order->user->subscription_ends_at->translatedFormat('d F Y') }}
</x-mail::panel>

<x-mail::button :url="route('login')">
Buka Aplikasi
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
