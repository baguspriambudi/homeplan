import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CalendarRange,
    LineChart,
    PiggyBank,
    ShieldCheck,
    Users,
    Wallet,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';
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
        title: 'Daftar & buat rumah tanggamu',
        description:
            'Sekali daftar, rumah tanggamu langsung punya ruang sendiri. Undang pasangan atau keluarga sebagai anggota.',
    },
    {
        number: '2',
        title: 'Buat periode & catat transaksi',
        description:
            'Tentukan saldo awal per periode, lalu catat pengeluaran dan pemasukan harian dengan kategorimu sendiri.',
    },
    {
        number: '3',
        title: 'Pantau & evaluasi',
        description: 'Lihat sisa anggaran, arus kas, dan tabungan secara real-time di dashboard.',
    },
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="MyExpense — Kelola Keuangan Keluarga dengan Mudah" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
                    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                                <Wallet className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                            </span>
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
                                            <Link href={register()}>Daftar Gratis</Link>
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
                                Gratis untuk keluarga Indonesia
                            </Badge>
                            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                                Uang ke mana saja?{' '}
                                <span className="text-emerald-600 dark:text-emerald-400">MyExpense</span> tahu jawabannya.
                            </h1>
                            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                                Catat pengeluaran, kelola anggaran per periode, dan pantau tabungan dalam satu dashboard
                                — setiap rumah tangga punya ruang datanya sendiri, aman dan terpisah.
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
                                                Mulai Sekarang — Gratis <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild size="lg" variant="outline">
                                        <Link href={login()}>Sudah punya akun? Masuk</Link>
                                    </Button>
                                </div>
                            )}
                            <p className="mt-4 text-sm text-muted-foreground">
                                Tanpa kartu kredit · Data milikmu sepenuhnya · Dark mode tersedia
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
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                                            Daftar Gratis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
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
                            <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-foreground">MyExpense</span>
                        </div>
                        <p>© {new Date().getFullYear()} MyExpense. Kelola uangmu, raih tujuanmu.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
