import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BotMessageSquare, CheckCircle2, Send, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '#' },
    { title: 'Telegram Bot', href: '/telegram-config' },
];

interface Props {
    configured: boolean;
    botUsername: string | null;
    linkedMembers: number;
}

export default function TelegramConfigIndex({ configured, botUsername, linkedMembers }: Props) {
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);

    const form = useForm({ token: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/telegram-config', {
            onSuccess: () => form.reset(),
        });
    }

    function disconnect() {
        router.delete('/telegram-config', {
            onSuccess: () => setConfirmDisconnect(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Telegram Bot" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader subtitle="Bot Telegram milik household ini — anggota bisa mencatat expense & income langsung dari chat." />

                {configured && (
                    <Card>
                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                                    <BotMessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </span>
                                <div>
                                    <p className="flex items-center gap-2 font-medium">
                                        {botUsername ? (
                                            <a
                                                href={`https://t.me/${botUsername}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline"
                                            >
                                                @{botUsername}
                                            </a>
                                        ) : (
                                            'Bot terkonfigurasi'
                                        )}
                                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                                            <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
                                        </Badge>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {linkedMembers} anggota sudah menautkan akun Telegram-nya.
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setConfirmDisconnect(true)}>
                                <Trash2 className="mr-1 h-4 w-4" /> Putuskan bot
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="flex flex-col gap-4 p-4">
                        <div>
                            <p className="font-medium">{configured ? 'Ganti bot' : 'Sambungkan bot'}</p>
                            <ol className="mt-1 list-inside list-decimal text-sm text-muted-foreground">
                                <li>
                                    Chat <span className="font-medium text-foreground">@BotFather</span> di Telegram,
                                    kirim <code className="rounded bg-muted px-1">/newbot</code>, ikuti langkahnya.
                                </li>
                                <li>Salin token yang diberikan (format <code className="rounded bg-muted px-1">123456:ABC-DEF...</code>).</li>
                                <li>Tempel di bawah ini — username bot terisi otomatis setelah token terverifikasi.</li>
                            </ol>
                        </div>

                        <form onSubmit={submit} className="flex flex-col gap-3">
                            <div>
                                <Label>Bot Token</Label>
                                <Input
                                    value={form.data.token}
                                    onChange={(e) => form.setData('token', e.target.value)}
                                    placeholder="123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    autoComplete="off"
                                />
                                <InputError message={form.errors.token} />
                            </div>
                            <div>
                                <Button type="submit" disabled={form.processing || form.data.token.trim() === ''}>
                                    <Send className="mr-1 h-4 w-4" /> Verifikasi & Simpan
                                </Button>
                            </div>
                        </form>

                        <p className="text-xs text-muted-foreground">
                            Setelah tersambung: tiap anggota membuat kode tautan di <span className="font-medium">Settings → Profile</span>{' '}
                            lalu mengirim <code className="rounded bg-muted px-1">/link KODE</code> ke bot. Pastikan proses{' '}
                            <code className="rounded bg-muted px-1">php artisan telegram:poll</code> berjalan di server.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Konfirmasi putuskan bot */}
            <Dialog open={confirmDisconnect} onOpenChange={setConfirmDisconnect}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Putuskan Bot Telegram</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Token bot dihapus dan pencatatan lewat Telegram berhenti untuk semua anggota. Tautan akun anggota
                        tidak dihapus — kalau bot disambungkan lagi, mereka langsung bisa pakai tanpa /link ulang.
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setConfirmDisconnect(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={disconnect}>
                            Putuskan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
