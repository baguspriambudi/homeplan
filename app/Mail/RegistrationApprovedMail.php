<?php

namespace App\Mail;

use App\Models\PaymentOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PaymentOrder $order,
        public string $plainPassword,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Akun '.config('app.name').' Anda Sudah Aktif',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.registration-approved',
        );
    }
}
