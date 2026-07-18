<?php

return [

    /*
    |--------------------------------------------------------------------------
    | QRIS Statis
    |--------------------------------------------------------------------------
    |
    | Payload QRIS statis milik merchant (hasil scan QR statis dari bank /
    | penyedia QRIS, berupa string diawali "000201..."). Payload ini akan
    | dikonversi menjadi QRIS dinamis dengan nominal tertanam saat pendaftar
    | melakukan pembayaran.
    |
    */

    'qris_static_payload' => env('QRIS_STATIC_PAYLOAD', ''),

    /*
    |--------------------------------------------------------------------------
    | Masa Berlaku Order
    |--------------------------------------------------------------------------
    |
    | Berapa jam order pembayaran berlaku sebelum dianggap kedaluwarsa.
    |
    */

    'order_ttl_hours' => (int) env('SUBSCRIPTION_ORDER_TTL_HOURS', 24),

];
