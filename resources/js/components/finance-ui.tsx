import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';

/** Header halaman yang seragam: judul besar + subjudul + tombol aksi di kanan */
export function PageHeader({
    title,
    subtitle,
    action,
}: {
    title?: string;
    subtitle?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {title && <h1 className="text-lg font-semibold tracking-tight">{title}</h1>}
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    return (
        <div className={`relative max-w-sm ${className}`}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-card pl-9"
            />
        </div>
    );
}

/** Warna badge per tipe kategori, konsisten dengan dashboard */
const TYPE_STYLES: Record<string, string> = {
    income: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    spending: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    bills: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
    instalment: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    saving: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

export function TypeBadge({ type }: { type: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${
                TYPE_STYLES[type] ?? 'bg-muted text-muted-foreground'
            }`}
        >
            {type}
        </span>
    );
}

/** Avatar inisial + nama, untuk kolom "Created By" dan sejenisnya */
export function UserChip({ name }: { name?: string | null }) {
    if (!name) return <span className="text-sm text-muted-foreground">-</span>;
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    return (
        <span className="inline-flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                {initials}
            </span>
            <span className="text-sm text-muted-foreground">{name}</span>
        </span>
    );
}

/** "2026-07-12" -> "12 Jul 2026" */
export function formatDate(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Input tanggal yang MENAMPILKAN format hari-bulan-tahun (mis. "12 Jul 2026")
 * tapi menyimpan nilai "YYYY-MM-DD" untuk backend (tidak berubah).
 *
 * Caranya: native <input type="date"> transparan ditumpuk di atas lapisan
 * tampilan. Kalender tetap native (tanpa library), tapi teksnya kita format
 * sendiri sehingga selalu hari-bulan-tahun apa pun locale browser-nya.
 */
export function DateField({
    value,
    onChange,
    id,
    min,
    max,
    placeholder = 'Pilih tanggal',
}: {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    min?: string;
    max?: string;
    placeholder?: string;
}) {
    return (
        <div className="relative">
            {/* Native date input transparan: sumber kalender + nilai YYYY-MM-DD */}
            <input
                id={id}
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => {
                    // Buka kalender saat area diklik (bukan hanya ikon kecil bawaan)
                    const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                    try {
                        el.showPicker?.();
                    } catch {
                        /* showPicker tidak tersedia — biarkan perilaku default */
                    }
                }}
                aria-label={placeholder}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            {/* Lapisan tampilan: teks hari-bulan-tahun */}
            <div className="border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] pointer-events-none md:text-sm peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]">
                <span className={value ? '' : 'text-muted-foreground'}>
                    {value ? formatDate(value) : placeholder}
                </span>
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
        </div>
    );
}

/**
 * Tanggal lokal "YYYY-MM-DD" — JANGAN pakai toISOString().slice(0,10)
 * karena dikonversi ke UTC dan mundur 1 hari untuk WIB.
 */
export function toLocalIso(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** Qty bahan: "0.50" -> "0,5" (format id-ID, tanpa nol berlebih) */
export function formatQty(qty: string | number): string {
    return Number(qty).toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

/** Warna badge bahan — dipilih dari hash nama agar bahan yang sama selalu berwarna sama */
const INGREDIENT_PALETTE = [
    'bg-rose-500/15 text-rose-700 dark:text-rose-400',
    'bg-orange-500/15 text-orange-700 dark:text-orange-400',
    'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    'bg-lime-500/15 text-lime-700 dark:text-lime-400',
    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    'bg-teal-500/15 text-teal-700 dark:text-teal-400',
    'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
    'bg-violet-500/15 text-violet-700 dark:text-violet-400',
    'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400',
];

export function ingredientColor(name: string): string {
    let hash = 0;
    const key = name.trim().toLowerCase();
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return INGREDIENT_PALETTE[hash % INGREDIENT_PALETTE.length];
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

/** Pagination client-side untuk tabel. Default 50 baris per halaman. */
export function usePagination<T>(items: T[], defaultPerPage = 50) {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(defaultPerPage);

    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const currentPage = Math.min(page, totalPages); // clamp saat filter mengecilkan hasil

    const paged = useMemo(
        () => items.slice((currentPage - 1) * perPage, currentPage * perPage),
        [items, currentPage, perPage],
    );

    return {
        paged,
        page: currentPage,
        setPage,
        perPage,
        setPerPage: (n: number) => {
            setPerPage(n);
            setPage(1);
        },
        totalPages,
        total: items.length,
    };
}

export function TablePagination({
    page,
    setPage,
    perPage,
    setPerPage,
    totalPages,
    total,
}: {
    page: number;
    setPage: (page: number) => void;
    perPage: number;
    setPerPage: (n: number) => void;
    totalPages: number;
    total: number;
}) {
    if (total === 0) return null;

    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{from}</span>–
                <span className="font-medium text-foreground">{to}</span> of{' '}
                <span className="font-medium text-foreground">{total}</span>
            </p>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Rows</span>
                    <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
                        <SelectTrigger className="h-8 w-[70px] text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PER_PAGE_OPTIONS.map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-2 text-xs tabular-nums text-muted-foreground">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function EmptyRow({
    colSpan,
    icon,
    message,
}: {
    colSpan: number;
    icon: ReactNode;
    message: string;
}) {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted [&>svg]:h-6 [&>svg]:w-6">
                        {icon}
                    </span>
                    <p className="text-sm">{message}</p>
                </div>
            </TableCell>
        </TableRow>
    );
}
