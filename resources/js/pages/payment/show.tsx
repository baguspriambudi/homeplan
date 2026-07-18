import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock, Info, RefreshCw, Upload, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface Props {
    order: {
        code: string;
        type: 'registration' | 'renewal';
        name: string | null;
        email: string | null;
        household_name: string | null;
        amount: number;
        unique_code: number;
        total_amount: number;
        status: 'pending' | 'waiting_confirmation' | 'approved' | 'rejected';
        reject_reason: string | null;
        has_proof: boolean;
        is_expired: boolean;
        expires_at: string | null;
        plan: { id: number; name: string; duration_days: number; price: number };
    };
    qrSvg: string | null;
    notice: string | null;
}

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

const deadlineFormat = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function remainingMs(expiresAt: string | null): number | null {
    return expiresAt === null ? null : new Date(expiresAt).getTime() - Date.now();
}

function formatRemaining(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];

    return parts.map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * Hitung mundur sampai order kedaluwarsa. Saat habis, halaman dimuat ulang agar
 * server yang memutuskan status (expired ditentukan di backend, bukan di sini).
 */
function useCountdown(expiresAt: string | null, enabled: boolean): number | null {
    const [remaining, setRemaining] = useState(() => remainingMs(expiresAt));

    useEffect(() => {
        if (!enabled || expiresAt === null) {
            return;
        }

        setRemaining(remainingMs(expiresAt));

        const id = window.setInterval(() => {
            const ms = remainingMs(expiresAt) ?? 0;
            setRemaining(ms);

            if (ms <= 0) {
                window.clearInterval(id);
                router.reload();
            }
        }, 1000);

        return () => window.clearInterval(id);
    }, [expiresAt, enabled]);

    return remaining;
}

export default function PaymentShow({ order, qrSvg, notice }: Props) {
    const form = useForm<{ proof: File | null }>({ proof: null });
    const showCountdown = order.status === 'pending' && !order.is_expired;
    const remaining = useCountdown(order.expires_at, showCountdown);

    function submitProof(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/pay/${order.code}/proof`, {
            forceFormData: true,
            onSuccess: () => form.reset(),
        });
    }

    const isRegistration = order.type === 'registration';

    const proofForm = (
        <form onSubmit={submitProof} className="flex w-full flex-col gap-2">
            <Label htmlFor="proof">Upload bukti pembayaran</Label>
            <input
                id="proof"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm"
                onChange={(e) => form.setData('proof', e.target.files?.[0] ?? null)}
            />
            <InputError message={form.errors.proof} />
            <Button type="submit" disabled={form.processing || !form.data.proof}>
                {form.processing ? <Spinner /> : <Upload className="mr-1 h-4 w-4" />}
                Kirim Bukti Pembayaran
            </Button>
        </form>
    );

    return (
        <AuthLayout
            title={isRegistration ? 'Pembayaran Pendaftaran' : 'Pembayaran Perpanjangan'}
            description={`Paket ${order.plan.name} — ${order.plan.duration_days} hari`}
        >
            <Head title="Pembayaran" />

            <div className="flex flex-col gap-4">
                {notice && (
                    <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                        <CardContent className="flex gap-2 p-3 text-sm">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <span>{notice}</span>
                        </CardContent>
                    </Card>
                )}

                {/* Ringkasan order */}
                <Card>
                    <CardContent className="space-y-1 p-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kode Order</span>
                            <span className="font-mono text-xs">{order.code}</span>
                        </div>
                        {order.name && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama</span>
                                <span>{order.name}</span>
                            </div>
                        )}
                        {order.email && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span>{order.email}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Harga paket</span>
                            <span>{idr.format(order.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kode unik</span>
                            <span>{idr.format(order.unique_code)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-base font-semibold">
                            <span>Total bayar</span>
                            <span>{idr.format(order.total_amount)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Status: expired — QR disembunyikan, tapi yang terlanjur bayar tetap bisa lapor */}
                {order.is_expired && (
                    <Card className="border-rose-300">
                        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                            <XCircle className="h-10 w-10 text-rose-500" />
                            <p className="font-medium">Order kedaluwarsa</p>
                            <p className="text-sm text-muted-foreground">
                                Batas waktu pembayaran telah lewat. Silakan buat order baru.
                            </p>
                            <Button asChild variant="outline" className="mt-2">
                                <Link href={isRegistration ? '/register' : '/subscription/expired'}>
                                    Buat Order Baru
                                </Link>
                            </Button>

                            <div className="mt-4 w-full border-t pt-4 text-left">
                                <p className="mb-2 text-sm text-muted-foreground">
                                    Terlanjur membayar tagihan ini? Upload buktinya di bawah — admin
                                    akan meninjau dan tetap bisa mengaktifkan akun Anda.
                                </p>
                                {proofForm}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Status: pending — tampilkan QR + upload */}
                {order.status === 'pending' && !order.is_expired && (
                    <>
                        <Card>
                            <CardContent className="flex flex-col items-center gap-3 p-4">
                                {remaining !== null && (
                                    <div className="flex w-full flex-col items-center gap-1 border-b pb-3">
                                        <div
                                            className={`flex items-center gap-1.5 font-mono text-lg font-semibold tabular-nums ${
                                                remaining <= 60 * 60 * 1000
                                                    ? 'text-rose-500'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            <Clock className="h-4 w-4" />
                                            {formatRemaining(remaining)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Selesaikan sebelum{' '}
                                            {deadlineFormat.format(new Date(order.expires_at!))}
                                        </p>
                                    </div>
                                )}
                                {qrSvg ? (
                                    <>
                                        <div
                                            className="w-full max-w-[280px] rounded-lg bg-white p-3 [&>svg]:h-auto [&>svg]:w-full"
                                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                                        />
                                        <p className="text-center text-xs text-muted-foreground">
                                            Scan QRIS di atas dengan aplikasi bank / e-wallet apa pun.
                                            Nominal <strong>{idr.format(order.total_amount)}</strong> sudah
                                            otomatis terisi — jangan diubah agar mudah diverifikasi.
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground">
                                        QR belum tersedia. Silakan transfer manual sebesar{' '}
                                        <strong>{idr.format(order.total_amount)}</strong> (tepat hingga
                                        kode uniknya), lalu upload bukti pembayaran di bawah.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {proofForm}
                    </>
                )}

                {/* Status: menunggu konfirmasi */}
                {order.status === 'waiting_confirmation' && (
                    <Card className="border-amber-300">
                        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                            <Clock className="h-10 w-10 text-amber-500" />
                            <p className="font-medium">Menunggu konfirmasi admin</p>
                            <p className="text-sm text-muted-foreground">
                                Bukti pembayaran sudah kami terima.{' '}
                                {isRegistration
                                    ? 'Setelah dikonfirmasi, password akun akan dikirim ke email Anda.'
                                    : 'Setelah dikonfirmasi, masa aktif Anda otomatis diperpanjang.'}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => router.reload()}
                            >
                                <RefreshCw className="mr-1 h-4 w-4" /> Muat Ulang Status
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Status: approved */}
                {order.status === 'approved' && (
                    <Card className="border-emerald-300">
                        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            <p className="font-medium">Pembayaran dikonfirmasi!</p>
                            <p className="text-sm text-muted-foreground">
                                {isRegistration
                                    ? 'Akun Anda sudah aktif. Silakan cek email untuk password login Anda.'
                                    : 'Masa aktif Anda sudah diperpanjang. Silakan lanjut menggunakan aplikasi.'}
                            </p>
                            <Button asChild className="mt-2">
                                <Link href={isRegistration ? '/login' : '/dashboard'}>
                                    {isRegistration ? 'Login Sekarang' : 'Buka Dashboard'}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Status: rejected */}
                {order.status === 'rejected' && (
                    <Card className="border-rose-300">
                        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                            <XCircle className="h-10 w-10 text-rose-500" />
                            <p className="font-medium">Pembayaran ditolak</p>
                            {order.reject_reason && (
                                <p className="text-sm text-muted-foreground">
                                    Alasan: {order.reject_reason}
                                </p>
                            )}
                            <Button asChild variant="outline" className="mt-2">
                                <Link href={isRegistration ? '/register' : '/subscription/expired'}>
                                    Coba Lagi
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthLayout>
    );
}
