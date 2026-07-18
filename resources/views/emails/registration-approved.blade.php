<x-mail::message>
# Selamat Datang di {{ config('app.name') }}!

Halo **{{ $order->name }}**, pembayaran Anda telah kami konfirmasi dan akun Anda sudah aktif.

Berikut detail akun Anda:

<x-mail::panel>
**Email:** {{ $order->email }}<br>
**Password:** `{{ $plainPassword }}`<br>
**Paket:** {{ $order->plan->name }}<br>
**Aktif hingga:** {{ $order->user->subscription_ends_at->translatedFormat('d F Y') }}
</x-mail::panel>

Demi keamanan, segera ganti password Anda setelah login pertama melalui menu **Settings → Password**.

<x-mail::button :url="route('login')">
Login Sekarang
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
