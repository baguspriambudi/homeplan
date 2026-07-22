import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CalendarRange, Pencil, Plus, ReceiptText, Trash2, TrendingDown, Wallet } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoneyInput } from '@/components/ui/money-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { DateField, EmptyRow, formatDate, PageHeader, SearchInput, TablePagination, usePagination, UserChip } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Expenses', href: '/expenses' }];

interface Category {
    id: number;
    name: string;
    type: string;
}

interface FiscalYear {
    id: number;
    name: string;
    status: 'open' | 'closed';
}

interface Expense {
    id: number;
    category_id: number;
    category: Category;
    amount: string;
    description: string | null;
    expense_date: string;
    creator?: { id: number; name: string };
}

interface Summary {
    opening_balance: number;
    total_spent: number;
    remaining: number;
}

interface Props {
    expenses: Expense[];
    categories: Category[];
    fiscalYears: FiscalYear[];
    selectedFiscalId: number | null;
    summary: Summary;
}

export default function ExpensesIndex({ expenses, categories, fiscalYears, selectedFiscalId, summary }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Expense | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
    const [search, setSearch] = useState('');

    const visibleExpenses = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return expenses;
        return expenses.filter(
            (exp) =>
                exp.category.name.toLowerCase().includes(q) ||
                (exp.description ?? '').toLowerCase().includes(q),
        );
    }, [expenses, search]);

    const pagination = usePagination(visibleExpenses);

    const createForm = useForm({
        category_id: '',
        amount: '',
        description: '',
        expense_date: new Date().toISOString().slice(0, 10),
    });

    const editForm = useForm({
        category_id: '',
        amount: '',
        description: '',
        expense_date: '',
    });

    function handleFiscalChange(value: string) {
        router.get('/expenses', { fiscal_year_id: value }, { preserveScroll: true });
    }

    function openCreate() {
        createForm.reset();
        createForm.setData('expense_date', new Date().toISOString().slice(0, 10));
        setCreateOpen(true);
    }

    function openEdit(exp: Expense) {
        editForm.setData({
            category_id: String(exp.category_id),
            amount: String(parseFloat(exp.amount)),
            description: exp.description ?? '',
            expense_date: exp.expense_date,
        });
        setEditTarget(exp);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/expenses', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/expenses/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/expenses/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Track and monitor all expenses per period."
                    action={
                        can('create expenses') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> Add Expense
                            </Button>
                        )
                    }
                />

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="py-0">
                        <CardContent className="flex items-center gap-2.5 px-4 py-2.5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/15">
                                <Wallet className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                            </span>
                            <div>
                                <p className="text-[11px] text-muted-foreground">Budget</p>
                                <p className="text-sm font-semibold tracking-tight">{formatRupiah(summary.opening_balance)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="py-0">
                        <CardContent className="flex items-center gap-2.5 px-4 py-2.5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15">
                                <TrendingDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                            </span>
                            <div>
                                <p className="text-[11px] text-muted-foreground">Spent</p>
                                <p className="text-sm font-semibold tracking-tight text-rose-600 dark:text-rose-400">
                                    {formatRupiah(summary.total_spent)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="py-0">
                        <CardContent className="flex items-center gap-2.5 px-4 py-2.5">
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                                    summary.remaining < 0 ? 'bg-rose-500/15' : 'bg-emerald-500/15'
                                }`}
                            >
                                <Wallet
                                    className={`h-3.5 w-3.5 ${
                                        summary.remaining < 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                />
                            </span>
                            <div>
                                <p className="text-[11px] text-muted-foreground">Remaining</p>
                                <p
                                    className={`text-sm font-semibold tracking-tight ${
                                        summary.remaining < 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    {formatRupiah(summary.remaining)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Fiscal filter + search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <Select
                            value={selectedFiscalId?.toString() ?? ''}
                            onValueChange={handleFiscalChange}
                        >
                            <SelectTrigger className="w-56 bg-card">
                                <SelectValue placeholder="Select fiscal year" />
                            </SelectTrigger>
                            <SelectContent>
                                {fiscalYears.map((fy) => (
                                    <SelectItem key={fy.id} value={fy.id.toString()}>
                                        <span className="flex items-center gap-2">
                                            {fy.name}
                                            {fy.status === 'open' && <Badge className="text-xs">Open</Badge>}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <SearchInput value={search} onChange={setSearch} placeholder="Search category or description..." />
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleExpenses.length === 0 && (
                                    <EmptyRow
                                        colSpan={6}
                                        icon={<ReceiptText />}
                                        message={
                                            search
                                                ? `No expenses match "${search}".`
                                                : 'No expenses for this period yet.'
                                        }
                                    />
                                )}
                                {pagination.paged.map((exp) => (
                                    <TableRow key={exp.id}>
                                        <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                                            {formatDate(exp.expense_date)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium">{exp.category.name}</span>
                                        </TableCell>
                                        <TableCell className="max-w-64 truncate text-sm text-muted-foreground">
                                            {exp.description ?? '-'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                                            {formatRupiah(parseFloat(exp.amount))}
                                        </TableCell>
                                        <TableCell>
                                            <UserChip name={exp.creator?.name} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {can('edit expenses') && (
                                                    <Button size="icon" variant="ghost" onClick={() => openEdit(exp)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can('delete expenses') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-rose-500 hover:text-rose-600"
                                                        onClick={() => setDeleteTarget(exp)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination {...pagination} />
                    </CardContent>
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Date</Label>
                            <DateField
                                value={createForm.data.expense_date}
                                onChange={(v) => createForm.setData('expense_date', v)}
                            />
                            <InputError message={createForm.errors.expense_date} />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={createForm.data.category_id}
                                onValueChange={(v) => createForm.setData('category_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.category_id} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                placeholder="Optional"
                                rows={3}
                            />
                            <InputError message={createForm.errors.description} />
                        </div>
                        <div>
                            <Label>Amount (Rp)</Label>
                            <MoneyInput
                                value={createForm.data.amount}
                                onValueChange={(raw) => createForm.setData('amount', raw)}
                            />
                            <InputError message={createForm.errors.amount} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div>
                            <Label>Date</Label>
                            <DateField
                                value={editForm.data.expense_date}
                                onChange={(v) => editForm.setData('expense_date', v)}
                            />
                            <InputError message={editForm.errors.expense_date} />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={editForm.data.category_id}
                                onValueChange={(v) => editForm.setData('category_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.category_id} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                rows={3}
                            />
                            <InputError message={editForm.errors.description} />
                        </div>
                        <div>
                            <Label>Amount (Rp)</Label>
                            <MoneyInput
                                value={editForm.data.amount}
                                onValueChange={(raw) => editForm.setData('amount', raw)}
                            />
                            <InputError message={editForm.errors.amount} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setEditTarget(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Expense</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this expense of{' '}
                        <strong>{deleteTarget ? formatRupiah(parseFloat(deleteTarget.amount)) : ''}</strong>?
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
