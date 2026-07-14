import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ArrowDownCircle,
    ArrowRight,
    ArrowUpCircle,
    Baby,
    CalendarClock,
    CalendarRange,
    Crosshair,
    Gauge,
    PiggyBank,
    ShieldCheck,
    TrendingDown,
    Wallet,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface FiscalYear {
    id: number;
    name: string;
    status: 'open' | 'closed';
    opening_balance: number;
}

interface Stats {
    opening_balance: number;
    total_spent: number;
    remaining: number;
}

interface Savings {
    emergency: number;
    kids: number;
    total: number;
}

interface CashflowRow {
    id: string;
    name: string;
    type: string;
    debit: number | null;
    kredit: number | null;
    balance: number;
}

interface Period {
    start: string;
    end: string;
    status: 'open' | 'closed';
}

interface Props {
    fiscalYears: FiscalYear[];
    selectedFiscalId: number | null;
    stats: Stats;
    savings: Savings;
    cashflow: CashflowRow[];
    period: Period | null;
}

const typeBadge: Record<string, string> = {
    income: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    spending: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    bills: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
    instalment: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    saving: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

const FILTER_TYPES = ['income', 'spending', 'bills', 'instalment', 'saving'] as const;

function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export default function Dashboard({ fiscalYears, selectedFiscalId, stats, savings, cashflow, period }: Props) {
    const [typeFilter, setTypeFilter] = useState<string>('all');

    function handleFiscalChange(value: string) {
        router.get('/dashboard', { fiscal_year_id: value }, { preserveScroll: true });
    }

    const spentPct =
        stats.opening_balance > 0 ? Math.min(100, Math.round((stats.total_spent / stats.opening_balance) * 100)) : 0;
    const overBudget = stats.remaining < 0;

    // Insight periode: margin, rata-rata harian, proyeksi, sisa hari
    const insights = useMemo(() => {
        const margin = stats.opening_balance > 0 ? (stats.remaining / stats.opening_balance) * 100 : 0;

        if (!period) {
            return { margin, avgDaily: 0, projected: 0, daysLeft: 0, totalDays: 0, elapsed: 0 };
        }

        const start = new Date(period.start);
        const end = new Date(period.end);
        const today = new Date();
        const totalDays = daysBetween(start, end) + 1;
        const rawElapsed = daysBetween(start, today > end ? end : today) + 1;
        const elapsed = Math.min(Math.max(rawElapsed, 1), totalDays);
        const daysLeft = period.status === 'closed' ? 0 : Math.max(0, totalDays - elapsed);
        const avgDaily = stats.total_spent / elapsed;
        const projected = period.status === 'closed' ? stats.total_spent : avgDaily * totalDays;

        return { margin, avgDaily, projected, daysLeft, totalDays, elapsed };
    }, [stats, period]);

    const projectedOver = insights.projected > stats.opening_balance && stats.opening_balance > 0;

    // Baris cashflow terfilter (opening & total selalu tampil saat "all")
    const visibleCashflow = useMemo(() => {
        if (typeFilter === 'all') return cashflow;
        return cashflow.filter((row) => row.type === typeFilter);
    }, [cashflow, typeFilter]);

    const filterCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const row of cashflow) counts[row.type] = (counts[row.type] ?? 0) + 1;
        return counts;
    }, [cashflow]);

    const filteredSubtotal = useMemo(() => {
        if (typeFilter === 'all') return null;
        return visibleCashflow.reduce((sum, row) => sum + (row.debit ?? 0) - (row.kredit ?? 0), 0);
    }, [visibleCashflow, typeFilter]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Page heading + fiscal filter */}
                <PageHeader
                    subtitle="Financial summary for the selected period."
                    action={
                        <div className="flex items-center gap-2">
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                            <Select value={selectedFiscalId?.toString() ?? ''} onValueChange={handleFiscalChange}>
                                <SelectTrigger className="w-56 bg-card">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fiscalYears.map((fy) => (
                                        <SelectItem key={fy.id} value={fy.id.toString()}>
                                            <span className="flex items-center gap-2">
                                                {fy.name}
                                                {fy.status === 'open' && (
                                                    <Badge className="bg-emerald-500/15 text-xs text-emerald-600 dark:text-emerald-400">
                                                        Open
                                                    </Badge>
                                                )}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative overflow-hidden border-sky-200/60 bg-gradient-to-br from-sky-50 to-transparent dark:border-sky-500/20 dark:from-sky-500/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Balance</CardTitle>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15">
                                <Wallet className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold tracking-tight">{formatRupiah(stats.opening_balance)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Available budget this period</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-rose-200/60 bg-gradient-to-br from-rose-50 to-transparent dark:border-rose-500/20 dark:from-rose-500/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/15">
                                <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                {formatRupiah(stats.total_spent)}
                            </p>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-500/10">
                                <div
                                    className={`h-full rounded-full ${overBudget ? 'bg-rose-600' : 'bg-rose-400'}`}
                                    style={{ width: `${spentPct}%` }}
                                />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{spentPct}% of budget used</p>
                        </CardContent>
                    </Card>

                    <Card
                        className={`relative overflow-hidden ${
                            overBudget
                                ? 'border-rose-200/60 bg-gradient-to-br from-rose-50 to-transparent dark:border-rose-500/20 dark:from-rose-500/10'
                                : 'border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-transparent dark:border-emerald-500/20 dark:from-emerald-500/10'
                        }`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Budget</CardTitle>
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    overBudget ? 'bg-rose-500/15' : 'bg-emerald-500/15'
                                }`}
                            >
                                <Wallet
                                    className={`h-4 w-4 ${
                                        overBudget
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p
                                className={`text-xl font-bold tracking-tight ${
                                    overBudget
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                }`}
                            >
                                {formatRupiah(stats.remaining)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {overBudget ? 'Budget overlimit!' : `${Math.round(insights.margin)}% budget margin left`}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Period Insights */}
                <Card className="overflow-hidden py-0">
                    <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-2.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Period Insights
                        </p>
                        <Link
                            href="/analytics"
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
                        >
                            View full analytics <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 divide-y sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                        <div className="flex items-start gap-3 px-5 py-4">
                            <Gauge
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    insights.margin < 0
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : insights.margin < 20
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : 'text-emerald-600 dark:text-emerald-400'
                                }`}
                            />
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Budget Margin
                                </p>
                                <p
                                    className={`mt-0.5 text-lg font-bold tabular-nums leading-tight ${
                                        insights.margin < 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : insights.margin < 20
                                              ? 'text-amber-600 dark:text-amber-400'
                                              : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    {insights.margin.toFixed(1)}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {insights.margin < 0 ? 'over budget' : 'of budget remaining'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-5 py-4">
                            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Avg Daily Spend
                                </p>
                                <p className="mt-0.5 text-lg font-bold tabular-nums leading-tight">
                                    {formatRupiah(insights.avgDaily)}
                                </p>
                                <p className="text-xs text-muted-foreground">over {insights.elapsed} days so far</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-5 py-4">
                            <Crosshair
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    projectedOver
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-indigo-600 dark:text-indigo-400'
                                }`}
                            />
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Projected Spend
                                </p>
                                <p
                                    className={`mt-0.5 text-lg font-bold tabular-nums leading-tight ${
                                        projectedOver ? 'text-rose-600 dark:text-rose-400' : ''
                                    }`}
                                >
                                    {formatRupiah(insights.projected)}
                                </p>
                                <p
                                    className={`text-xs ${
                                        projectedOver
                                            ? 'font-medium text-rose-600 dark:text-rose-400'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {projectedOver ? 'will exceed budget!' : 'at current pace'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-5 py-4">
                            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Days Left
                                </p>
                                <p className="mt-0.5 text-lg font-bold tabular-nums leading-tight">{insights.daysLeft}</p>
                                <p className="text-xs text-muted-foreground">of {insights.totalDays} days in period</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Savings Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 py-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Emergency Savings</p>
                                <p className="text-base font-bold tracking-tight">{formatRupiah(savings.emergency)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 py-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                                <Baby className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Kids Savings</p>
                                <p className="text-base font-bold tracking-tight">{formatRupiah(savings.kids)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 py-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
                                <PiggyBank className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Savings</p>
                                <p className="text-base font-bold tracking-tight">{formatRupiah(savings.total)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cash Flow Statement */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base">Cash Flow Statement</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                onClick={() => setTypeFilter('all')}
                                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                    typeFilter === 'all'
                                        ? 'bg-foreground text-background'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                }`}
                            >
                                All
                            </button>
                            {FILTER_TYPES.filter((t) => (filterCounts[t] ?? 0) > 0).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTypeFilter(typeFilter === t ? 'all' : t)}
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                                        typeFilter === t
                                            ? 'bg-foreground text-background'
                                            : `${typeBadge[t]} hover:opacity-80`
                                    }`}
                                >
                                    {t} ({filterCounts[t]})
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                            <ArrowUpCircle className="h-3.5 w-3.5" /> Debit (+)
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                            <ArrowDownCircle className="h-3.5 w-3.5" /> Credit (-)
                                        </span>
                                    </TableHead>
                                    {typeFilter === 'all' && <TableHead className="text-right">Balance</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleCashflow.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={typeFilter === 'all' ? 4 : 3}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No rows for this filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {visibleCashflow.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className={
                                            row.type === 'total' || row.type === 'opening'
                                                ? 'bg-muted/60 font-semibold hover:bg-muted/60'
                                                : ''
                                        }
                                    >
                                        <TableCell>
                                            <span className="flex items-center gap-2">
                                                {!['opening', 'total'].includes(row.type) && (
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                                            typeBadge[row.type] ?? 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {row.type}
                                                    </span>
                                                )}
                                                <span className={['opening', 'total'].includes(row.type) ? 'font-bold' : ''}>
                                                    {row.name}
                                                </span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                                            {row.debit != null && row.debit > 0 ? formatRupiah(row.debit) : ''}
                                        </TableCell>
                                        <TableCell className="text-right text-rose-600 dark:text-rose-400">
                                            {row.kredit != null && row.kredit > 0 ? formatRupiah(row.kredit) : ''}
                                        </TableCell>
                                        {typeFilter === 'all' && (
                                            <TableCell
                                                className={`text-right font-medium ${
                                                    row.balance < 0
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : 'text-emerald-600 dark:text-emerald-400'
                                                }`}
                                            >
                                                {formatRupiah(row.balance)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {filteredSubtotal !== null && visibleCashflow.length > 0 && (
                                    <TableRow className="bg-muted/60 font-semibold hover:bg-muted/60">
                                        <TableCell className="font-bold uppercase">Subtotal ({typeFilter})</TableCell>
                                        <TableCell
                                            colSpan={2}
                                            className={`text-right font-bold ${
                                                filteredSubtotal < 0
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-emerald-600 dark:text-emerald-400'
                                            }`}
                                        >
                                            {formatRupiah(Math.abs(filteredSubtotal))}
                                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                {filteredSubtotal < 0 ? '(out)' : '(in)'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
