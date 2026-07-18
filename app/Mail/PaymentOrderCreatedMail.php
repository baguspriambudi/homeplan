<?php

namespace App\Mail;

use App\Models\PaymentOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentOrderCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PaymentOrder $order,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selesaikan Pembayaran '.config('app.name').' Anda',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payment-order-created',
        );
    }
}
