import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CalendarRange,
    CookingPot,
    LineChart,
    PiggyBank,
    Send,
    ShieldCheck,
    Users,
    Wallet,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import type { SharedData } from '@/types';

const features = [
    {
        icon: CalendarRange,
        title: 'Periode Anggaran (Fiscal Year)',
        description:
            'Kelola keuangan per periode — tetapkan saldo awal, tutup periode lama, dan mulai periode baru dengan rapi.',
    },
    {
        icon: Wallet,
        title: 'Catat Pengeluaran & Pemasukan',
        description:
            'Input transaksi harian dalam hitungan detik, lengkap dengan kategori, tanggal, dan format Rupiah otomatis.',
    },
    {
        icon: BarChart3,
        title: 'Laporan Arus Kas',
        description:
            'Cash flow statement otomatis: debit, kredit, dan saldo berjalan tersusun jelas untuk setiap periode.',
    },
    {
        icon: PiggyBank,
        title: 'Pantau Tabungan',
        description:
            'Dana darurat dan tabungan anak terpantau terpisah, sehingga tujuan menabung tidak tercampur pengeluaran.',
    },
    {
        icon: Send,
        title: 'Catat via Bot Telegram',
        description:
            'Sambungkan bot Telegram milik keluargamu, lalu cukup ketik "keluar 50rb makan siang" dari chat — transaksi langsung tercatat lengkap dengan kategori dan sisa saldo.',
    },
    {
        icon: CookingPot,
        title: 'Rencana Menu Masakan',
        description:
            'Susun master menu beserta bahan dan takarannya, lalu jadwalkan di kalender untuk pagi, siang, dan sore — masak dan belanja jadi lebih terencana.',
    },
    {
        icon: ShieldCheck,
        title: 'Aman & Terkontrol',
        description:
            'Autentikasi dua faktor, verifikasi email, dan reset password memastikan data keuangan tetap aman.',
    },
    {
        icon: Users,
        title: 'Multi Rumah Tangga',
        description:
            'Setiap keluarga punya ruang datanya sendiri yang terisolasi penuh. Ajak pasangan jadi anggota, atur hak aksesnya — data rumah tanggamu tidak akan tercampur dengan yang lain.',
    },
];

const steps = [
    {
        number: '1',
        title: 'Daftar & pilih paket',
        description:
            'Isi nama, email, dan nama rumah tanggamu, lalu pilih paket langganan yang pas.',
    },
    {
        number: '2',
        title: 'Bayar via QRIS',
        description:
            'Scan kode QR dari aplikasi pembayaran apa pun, lalu upload bukti transfermu. Setelah dikonfirmasi, akun dikirim ke emailmu.',
    },
    {
        number: '3',
        title: 'Langsung mulai mencatat',
        description:
            'Kategori bawaan, periode bulan berjalan, dan satuan bahan sudah disiapkan otomatis. Undang pasangan jadi anggota, sambungkan bot Telegram, dan mulai catat.',
    },
];

interface PlanItem {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    description: string | null;
}

export default function Welcome({ canRegister = true, plans = [] }: { canRegister?: boolean; plans?: PlanItem[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="MyExpense — Kelola Keuangan Keluarga dengan Mudah" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
                    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-8 w-8" />
                            <span className="text-lg font-bold tracking-tight">
                                My<span className="text-emerald-600 dark:text-emerald-400">Expense</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            {auth.user ? (
                                <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                    <Link href={dashboard()}>
                                        Buka Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                            <Link href={register()}>Daftar</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)]"
                        aria-hidden
                    />
                    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
                        <div>
                            <Badge className="mb-4 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                                Langganan hemat untuk keluarga Indonesia
                            </Badge>
                            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                                Uang ke mana saja?{' '}
                                <span className="text-emerald-600 dark:text-emerald-400">MyExpense</span> tahu jawabannya.
                            </h1>
                            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                                Catat pengeluaran — bahkan langsung dari chat Telegram — kelola anggaran per periode,
                                pantau tabungan, sampai rencanakan menu masakan keluarga. Setiap rumah tangga punya ruang
                                datanya sendiri, aman dan terpisah.
                            </p>
                            {auth.user ? (
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                        <Link href={dashboard()}>
                                            Lanjut ke Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                        Masuk sebagai <span className="font-medium text-foreground">{auth.user.name}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    {canRegister && (
                                        <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                            <Link href={register()}>
                                                Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild size="lg" variant="outline">
                                        <Link href={login()}>Sudah punya akun? Masuk</Link>
                                    </Button>
                                </div>
                            )}
                            <p className="mt-4 text-sm text-muted-foreground">
                                Bayar mudah via QRIS · Catat dari bot Telegram · Data milikmu sepenuhnya
                            </p>
                        </div>

                        {/* Hero mockup */}
                        <div className="relative">
                            <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-emerald-500/5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Ringkasan Juli 2026</p>
                                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400">
                                        Open
                                    </Badge>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border bg-gradient-to-br from-sky-500/10 to-transparent p-4">
                                        <p className="text-xs text-muted-foreground">Saldo Awal</p>
                                        <p className="mt-1 text-lg font-bold">{formatRupiah(12500000)}</p>
                                    </div>
                                    <div className="rounded-xl border bg-gradient-to-br from-rose-500/10 to-transparent p-4">
                                        <p className="text-xs text-muted-foreground">Pengeluaran</p>
                                        <p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">
                                            {formatRupiah(4750000)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
                                        <p className="text-xs text-muted-foreground">Sisa Anggaran</p>
                                        <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(7750000)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border bg-gradient-to-br from-indigo-500/10 to-transparent p-4">
                                        <p className="text-xs text-muted-foreground">Total Tabungan</p>
                                        <p className="mt-1 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                            {formatRupiah(9200000)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-xl border p-4">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Anggaran terpakai</span>
                                        <span>38%</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full w-[38%] rounded-full bg-emerald-500" />
                                    </div>
                                </div>
                                {/* Mock chat bot Telegram */}
                                <div className="mt-4 rounded-xl border p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/15">
                                            <Send className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                                        </span>
                                        <p className="text-xs font-semibold">Bot Telegram</p>
                                        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> online
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-col gap-1.5 text-xs">
                                        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-3 py-1.5 text-white">
                                            keluar 50rb makan siang
                                        </p>
                                        <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-1.5 text-muted-foreground">
                                            ✅ Tercatat! Sisa saldo{' '}
                                            <span className="font-semibold text-foreground">{formatRupiah(7700000)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
                                aria-hidden
                            />
                            <div
                                className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
                                aria-hidden
                            />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="border-t bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Semua yang kamu butuhkan untuk mengatur uang
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Dirancang untuk keuangan rumah tangga: sederhana dipakai setiap hari, lengkap saat butuh
                                laporan.
                            </p>
                        </div>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-emerald-500/5"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                                        <feature.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </span>
                                    <h3 className="mt-4 font-semibold">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section>
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Mulai dalam 3 langkah</h2>
                            <p className="mt-3 text-muted-foreground">Tidak perlu jago akuntansi — cukup konsisten mencatat.</p>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {steps.map((step) => (
                                <div key={step.number} className="relative rounded-2xl border bg-card p-6 text-center">
                                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                        {step.number}
                                    </span>
                                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                {plans.length > 0 && (
                    <section className="border-t bg-muted/30">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight">Paket langganan sederhana</h2>
                                <p className="mt-3 text-muted-foreground">
                                    Satu harga untuk seluruh rumah tangga — semua fitur terbuka, tambah anggota keluarga
                                    tanpa biaya ekstra.
                                </p>
                            </div>
                            <div className="mt-12 flex flex-wrap justify-center gap-6">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="flex w-full max-w-sm flex-col rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 sm:w-80"
                                    >
                                        <h3 className="font-semibold">{plan.name}</h3>
                                        <p className="mt-3 text-3xl font-extrabold">{formatRupiah(plan.price)}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            masa aktif {plan.duration_days} hari
                                        </p>
                                        {plan.description && (
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {plan.description}
                                            </p>
                                        )}
                                        {canRegister && !auth.user && (
                                            <div className="mt-auto pt-6">
                                                <Button
                                                    asChild
                                                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                                                >
                                                    <Link href={register()}>Pilih {plan.name}</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-center text-sm text-muted-foreground">
                                Pembayaran via QRIS dari aplikasi bank atau e-wallet apa pun. Akun aktif setelah
                                pembayaran dikonfirmasi.
                            </p>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="border-t">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-14 text-center text-white sm:px-16">
                            <div
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.15),transparent_60%)]"
                                aria-hidden
                            />
                            <LineChart className="mx-auto h-10 w-10 opacity-90" />
                            <h2 className="mt-4 text-3xl font-bold tracking-tight">
                                Keuangan rapi dimulai dari pencatatan hari ini
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-emerald-50">
                                Bergabung sekarang dan rasakan tenangnya tahu persis ke mana uangmu pergi setiap bulan.
                            </p>
                            <div className="mt-8">
                                {auth.user ? (
                                    <Button asChild size="lg" variant="secondary">
                                        <Link href={dashboard()}>
                                            Lanjut ke Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : canRegister ? (
                                    <Button asChild size="lg" variant="secondary">
                                        <Link href={register()}>
                                            Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild size="lg" variant="secondary">
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-5 w-5" />
                            <span className="font-semibold text-foreground">MyExpense</span>
                        </div>
                        <p>© {new Date().getFullYear()} MyExpense. Kelola uangmu, raih tujuanmu.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
