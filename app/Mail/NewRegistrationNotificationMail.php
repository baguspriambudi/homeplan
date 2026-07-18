<?php

namespace App\Mail;

use App\Models\PaymentOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notifikasi ke owner bahwa ada calon pendaftar baru yang menerima tautan pembayaran.
 */
class NewRegistrationNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PaymentOrder $order,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pendaftar Baru: '.$this->order->name.' ('.$this->order->code.')',
            replyTo: [new Address($this->order->email, $this->order->name)],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new-registration-notification',
        );
    }
}
