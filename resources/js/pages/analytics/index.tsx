import { Head, router } from '@inertiajs/react';
import { CalendarRange, ChartColumnBig, ReceiptText, Trophy } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, PageHeader } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Analytics', href: '/analytics' }];

// Warna chart tervalidasi (kontras & CVD-safe di light + dark): sky-600 & rose-600
const BUDGET_COLOR = '#0284c7';
const SPEND_COLOR = '#e11d48';

interface FiscalYear {
    id: number;
    name: string;
    status: 'open' | 'closed';
}

interface CategoryTotal {
    name: string;
    type: string;
    total: number;
    tx_count: number;
}

interface TopExpense {
    id: number;
    category: string | null;
    amount: number;
    description: string | null;
    expense_date: string;
}

interface PeriodRow {
    id: number;
    name: string;
    opening_balance: number;
    spent: number;
    remaining: number;
    status: 'open' | 'closed';
}

interface MonthPoint {
    month: string;
    year: string;
    total: number;
}

interface Props {
    fiscalYears: FiscalYear[];
    selectedFiscalId: number | null;
    topCategories: CategoryTotal[];
    topExpenses: TopExpense[];
    periodTotal: number;
    periods: PeriodRow[];
    monthlyTrend: MonthPoint[];
}

export default function AnalyticsIndex({
    fiscalYears,
    selectedFiscalId,
    topCategories,
    topExpenses,
    periodTotal,
    periods,
    monthlyTrend,
}: Props) {
    function handleFiscalChange(value: string) {
        router.get('/analytics', { fiscal_year_id: value }, { preserveScroll: true });
    }

    const maxCategory = Math.max(...topCategories.map((c) => c.total), 1);
    const maxPeriod = Math.max(...periods.flatMap((p) => [p.opening_balance, p.spent]), 1);
    const maxMonth = Math.max(...monthlyTrend.map((m) => m.total), 1);
    const peakMonthIdx = monthlyTrend.reduce((best, m, i) => (m.total > monthlyTrend[best].total ? i : best), 0);
    const biggestPeriod = periods.reduce<PeriodRow | null>(
        (best, p) => (best === null || p.spent > best.spent ? p : best),
        null,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    subtitle="Spending analysis across categories and periods."
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Top Spending Categories (periode terpilih) */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ChartColumnBig className="h-4 w-4 text-muted-foreground" />
                                Top Spending Categories
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                This period · total {formatRupiah(periodTotal)}
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-4">
                            {topCategories.length === 0 && (
                                <p className="flex flex-1 items-center justify-center py-8 text-center text-sm text-muted-foreground">
                                    No expenses in this period.
                                </p>
                            )}
                            {/* Bar kategori didistribusi merata mengisi tinggi kartu */}
                            <div className="flex flex-1 flex-col justify-evenly gap-3">
                                {topCategories.map((cat) => {
                                    const pct = periodTotal > 0 ? (cat.total / periodTotal) * 100 : 0;
                                    return (
                                        <div
                                            key={cat.name}
                                            className="group rounded-md px-1 py-1 transition-colors hover:bg-muted/50"
                                            title={`${cat.name}: ${formatRupiah(cat.total)} (${pct.toFixed(1)}% · ${cat.tx_count} transactions)`}
                                        >
                                            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                                                <span className="truncate text-sm font-medium">
                                                    {cat.name}
                                                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                                        {cat.tx_count} tx
                                                    </span>
                                                </span>
                                                <span className="whitespace-nowrap text-sm tabular-nums">
                                                    {formatRupiah(cat.total)}
                                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                                        {pct.toFixed(1)}%
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-r-full"
                                                    style={{
                                                        width: `${(cat.total / maxCategory) * 100}%`,
                                                        backgroundColor: SPEND_COLOR,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Ringkasan menempel di dasar kartu agar tinggi setara kartu sebelah */}
                            {topCategories.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 divide-x rounded-lg border bg-muted/30 py-3 text-center">
                                    <div className="px-2">
                                        <p className="text-lg font-bold tabular-nums leading-tight">
                                            {topCategories.length}
                                        </p>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Categories
                                        </p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-lg font-bold tabular-nums leading-tight">
                                            {topCategories.reduce((sum, c) => sum + c.tx_count, 0)}
                                        </p>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Transactions
                                        </p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-lg font-bold tabular-nums leading-tight">
                                            {periodTotal > 0
                                                ? ((topCategories[0].total / periodTotal) * 100).toFixed(0)
                                                : 0}
                                            %
                                        </p>
                                        <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Top: {topCategories[0].name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Biggest Single Expenses (periode terpilih) */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                Biggest Expenses
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Top 10 transactions this period</p>
                        </CardHeader>
                        <CardContent className="pt-2">
                            {topExpenses.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No expenses in this period.
                                </p>
                            )}
                            <ol className="divide-y">
                                {topExpenses.map((exp, i) => (
                                    <li key={exp.id} className="flex items-center gap-3 py-2.5">
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                i === 0
                                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {exp.description ?? exp.category ?? '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {exp.category} · {formatDate(exp.expense_date)}
                                            </p>
                                        </div>
                                        <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                                            {formatRupiah(exp.amount)}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget vs Spending per Period */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-col gap-2 border-b sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base">Budget vs Spending per Period</CardTitle>
                            {biggestPeriod && (
                                <p className="text-xs text-muted-foreground">
                                    Highest spending: <span className="font-medium text-foreground">{biggestPeriod.name}</span>{' '}
                                    ({formatRupiah(biggestPeriod.spent)})
                                </p>
                            )}
                        </div>
                        {/* Legend — 2 seri */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: BUDGET_COLOR }} />
                                Budget
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: SPEND_COLOR }} />
                                Spent
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 pt-4">
                        {periods.map((p) => {
                            const isSelected = p.id === selectedFiscalId;
                            const overspent = p.remaining < 0;
                            return (
                                <div
                                    key={p.id}
                                    className={`group rounded-lg p-2 transition-colors hover:bg-muted/50 ${
                                        isSelected ? 'bg-muted/40 ring-1 ring-border' : ''
                                    }`}
                                    title={`${p.name} — Budget ${formatRupiah(p.opening_balance)} · Spent ${formatRupiah(p.spent)} · Remaining ${formatRupiah(p.remaining)}`}
                                >
                                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                                        <span className="text-sm font-medium">
                                            {p.name}
                                            {p.status === 'open' && (
                                                <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                                    open
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            className={`text-xs font-medium tabular-nums ${
                                                overspent
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-emerald-600 dark:text-emerald-400'
                                            }`}
                                        >
                                            {overspent ? 'over by ' : 'left '}
                                            {formatRupiah(Math.abs(p.remaining))}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 rounded-r-full"
                                                style={{
                                                    width: `${(p.opening_balance / maxPeriod) * 100}%`,
                                                    backgroundColor: BUDGET_COLOR,
                                                }}
                                            />
                                            <span className="whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
                                                {formatRupiah(p.opening_balance)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 rounded-r-full"
                                                style={{
                                                    width: `${(p.spent / maxPeriod) * 100}%`,
                                                    backgroundColor: SPEND_COLOR,
                                                }}
                                            />
                                            <span className="whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
                                                {formatRupiah(p.spent)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ReceiptText className="h-4 w-4 text-muted-foreground" />
                            Monthly Spending — Last 12 Months
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Peak: {monthlyTrend[peakMonthIdx].month} {monthlyTrend[peakMonthIdx].year} (
                            {formatRupiah(monthlyTrend[peakMonthIdx].total)})
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex h-44 items-end gap-1.5 border-b pb-px sm:gap-2.5">
                            {monthlyTrend.map((m, i) => (
                                <div
                                    key={`${m.year}-${m.month}`}
                                    className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                                    title={`${m.month} ${m.year}: ${formatRupiah(m.total)}`}
                                >
                                    {i === peakMonthIdx && m.total > 0 && (
                                        <span className="whitespace-nowrap text-[10px] font-semibold tabular-nums">
                                            {formatRupiah(m.total)}
                                        </span>
                                    )}
                                    <div
                                        className="w-full max-w-8 rounded-t transition-opacity group-hover:opacity-80"
                                        style={{
                                            height: `${Math.max((m.total / maxMonth) * 100, m.total > 0 ? 2 : 0)}%`,
                                            backgroundColor: SPEND_COLOR,
                                            opacity: i === peakMonthIdx ? 1 : 0.75,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-1.5 flex gap-1.5 sm:gap-2.5">
                            {monthlyTrend.map((m) => (
                                <span
                                    key={`label-${m.year}-${m.month}`}
                                    className="flex-1 text-center text-[10px] text-muted-foreground"
                                >
                                    {m.month}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
