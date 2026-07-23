import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BookOpen, BotMessageSquare, CheckCircle2, Play, RadioTower, Send, Square, Trash2 } from 'lucide-react';
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
    pollerRunning: boolean;
}

/** Potongan kode inline di teks panduan */
function C({ children }: { children: React.ReactNode }) {
    return <code className="rounded bg-muted px-1 text-foreground">{children}</code>;
}

function GuideSection({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
    return (
        <section>
            <p className="flex items-center gap-2 font-medium">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {step}
                </span>
                {title}
            </p>
            <div className="mt-1.5 pl-7 text-sm text-muted-foreground">{children}</div>
        </section>
    );
}

export default function TelegramConfigIndex({ configured, botUsername, linkedMembers, pollerRunning }: Props) {
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);
    const [pollerBusy, setPollerBusy] = useState(false);
    const [guideOpen, setGuideOpen] = useState(false);

    const form = useForm({ token: '' });

    // Panduan bisa dibuka langsung lewat URL: /telegram-config?guide=1
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('guide') === '1') {
            setGuideOpen(true);
        }
    }, []);

    // Status poller bisa berubah di luar halaman (mis. dijalankan dari terminal)
    // — segarkan tiap 5 detik selama halaman terbuka
    useEffect(() => {
        if (!configured) return;
        const id = setInterval(() => router.reload({ only: ['pollerRunning'] }), 5000);
        return () => clearInterval(id);
    }, [configured]);

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

    function togglePoller() {
        setPollerBusy(true);
        router.post(`/telegram-config/poller/${pollerRunning ? 'stop' : 'start'}`, {}, {
            preserveScroll: true,
            onFinish: () => setPollerBusy(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Telegram Bot" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Bot Telegram milik household ini — anggota bisa mencatat expense & income langsung dari chat."
                    action={
                        <Button variant="outline" size="sm" onClick={() => setGuideOpen(true)}>
                            <BookOpen className="mr-1 h-4 w-4" /> Panduan
                        </Button>
                    }
                />

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

                {configured && (
                    <Card>
                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        pollerRunning ? 'bg-emerald-500/15' : 'bg-muted'
                                    }`}
                                >
                                    <RadioTower
                                        className={`h-5 w-5 ${
                                            pollerRunning
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                </span>
                                <div>
                                    <p className="flex items-center gap-2 font-medium">
                                        Poller
                                        {pollerRunning ? (
                                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                                                Berjalan
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Berhenti</Badge>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Proses yang menarik pesan dari Telegram — harus berjalan agar bot merespons.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant={pollerRunning ? 'outline' : 'default'}
                                size="sm"
                                disabled={pollerBusy}
                                onClick={togglePoller}
                            >
                                {pollerRunning ? (
                                    <>
                                        <Square className="mr-1 h-4 w-4" /> Stop
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-1 h-4 w-4" /> Start
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="flex flex-col gap-4 p-4">
                        <div>
                            <p className="font-medium">{configured ? 'Ganti bot' : 'Sambungkan bot'}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tempel token dari @BotFather — username bot terisi otomatis setelah token terverifikasi.
                                Belum punya token?{' '}
                                <button
                                    type="button"
                                    onClick={() => setGuideOpen(true)}
                                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    Lihat panduan
                                </button>
                                .
                            </p>
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
                    </CardContent>
                </Card>
            </div>

            {/* Panduan lengkap — dari buat token sampai format pencatatan */}
            <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> Panduan Bot Telegram
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-5">
                        <GuideSection step={1} title="Buat bot & ambil token">
                            <ol className="list-inside list-decimal space-y-1">
                                <li>
                                    Buka Telegram, chat <span className="font-medium text-foreground">@BotFather</span>.
                                </li>
                                <li>
                                    Kirim <C>/newbot</C>, beri nama bot, lalu tentukan username-nya (harus diakhiri{' '}
                                    <C>bot</C>, mis. <C>cimaii_house_bot</C>).
                                </li>
                                <li>
                                    Salin token yang diberikan (format <C>123456:ABC-DEF...</C>).
                                </li>
                            </ol>
                        </GuideSection>

                        <GuideSection step={2} title="Sambungkan ke aplikasi">
                            <p>
                                Tempel token di form halaman ini lalu klik{' '}
                                <span className="font-medium text-foreground">Verifikasi & Simpan</span>. Setelah
                                tersambung, pastikan <span className="font-medium text-foreground">Poller</span>{' '}
                                berjalan (tombol Start) — poller-lah yang membuat bot merespons chat.
                            </p>
                        </GuideSection>

                        <GuideSection step={3} title="Tautkan akun anggota">
                            <ol className="list-inside list-decimal space-y-1">
                                <li>
                                    Tiap anggota membuka <span className="font-medium text-foreground">Settings → Profile</span>{' '}
                                    di aplikasi dan membuat kode tautan.
                                </li>
                                <li>
                                    Kirim <C>/link KODE</C> ke bot — bot membalas konfirmasi dan akun langsung tertaut.
                                </li>
                            </ol>
                        </GuideSection>

                        <GuideSection step={4} title="Catat expense & income dari chat">
                            <p>
                                Polanya <C>keluar/masuk nominal deskripsi</C> — bot lalu memandu pilih kategori lewat
                                tombol.
                            </p>
                            <div className="mt-2 flex flex-col gap-2">
                                <div className="rounded-lg border p-2.5">
                                    <C>keluar 50rb makan siang</C>
                                    <p className="mt-1 text-xs">Pengeluaran Rp 50.000 dengan deskripsi "makan siang".</p>
                                </div>
                                <div className="rounded-lg border p-2.5">
                                    <C>masuk 2jt gaji bulanan</C>
                                    <p className="mt-1 text-xs">
                                        Pemasukan Rp 2.000.000 — bisa sekalian menambah saldo kas fiscal year.
                                    </p>
                                </div>
                                <div className="rounded-lg border p-2.5">
                                    <C>25000 parkir</C>
                                    <p className="mt-1 text-xs">Tanpa kata keluar/masuk — bot menanyakan jenisnya lewat tombol.</p>
                                </div>
                            </div>
                            <p className="mt-2">
                                Format nominal: <C>50000</C>, <C>50.000</C>, <C>50rb</C>, <C>50k</C>, <C>2jt</C>,{' '}
                                <C>1,5jt</C> — tanggal pencatatan selalu hari ini.
                            </p>
                        </GuideSection>

                        <GuideSection step={5} title="Perintah lain">
                            <ul className="space-y-1">
                                <li>
                                    <C>/saldo</C> — sisa saldo fiscal year berjalan
                                </li>
                                <li>
                                    <C>/batal</C> — batalkan pencatatan yang menggantung
                                </li>
                                <li>
                                    <C>/unlink</C> — putuskan tautan akun
                                </li>
                                <li>
                                    <C>/start</C> — tampilkan bantuan format
                                </li>
                            </ul>
                        </GuideSection>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setGuideOpen(false)}>Mengerti</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
