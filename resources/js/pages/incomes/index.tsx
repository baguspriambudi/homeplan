import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CalendarRange, HandCoins, Pencil, Plus, Trash2, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, formatDate, PageHeader, SearchInput, TablePagination, usePagination, UserChip } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Income', href: '/incomes' }];

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

interface Income {
    id: number;
    category_id: number;
    category: Category;
    amount: string;
    description: string | null;
    income_date: string;
    adjust_to_cash: boolean;
    creator?: { id: number; name: string };
}

interface Props {
    incomes: Income[];
    categories: Category[];
    fiscalYears: FiscalYear[];
    selectedFiscalId: number | null;
    totalIncome: number;
}

export default function IncomesIndex({ incomes, categories, fiscalYears, selectedFiscalId, totalIncome }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Income | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
    const [search, setSearch] = useState('');

    const visibleIncomes = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return incomes;
        return incomes.filter(
            (inc) =>
                inc.category.name.toLowerCase().includes(q) ||
                (inc.description ?? '').toLowerCase().includes(q),
        );
    }, [incomes, search]);

    const pagination = usePagination(visibleIncomes);

    const createForm = useForm({
        category_id: '',
        amount: '',
        description: '',
        income_date: new Date().toISOString().slice(0, 10),
        adjust_to_cash: false,
    });

    const editForm = useForm({
        category_id: '',
        amount: '',
        description: '',
        income_date: '',
        adjust_to_cash: false,
    });

    function handleFiscalChange(value: string) {
        router.get('/incomes', { fiscal_year_id: value }, { preserveScroll: true });
    }

    function openCreate() {
        createForm.reset();
        createForm.setData('income_date', new Date().toISOString().slice(0, 10));
        setCreateOpen(true);
    }

    function openEdit(inc: Income) {
        editForm.setData({
            category_id: String(inc.category_id),
            amount: String(parseFloat(inc.amount)),
            description: inc.description ?? '',
            income_date: inc.income_date,
            adjust_to_cash: inc.adjust_to_cash,
        });
        setEditTarget(inc);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/incomes', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/incomes/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/incomes/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Income" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Record income and savings deposits per period."
                    action={
                        can('create incomes') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> Add Income
                            </Button>
                        )
                    }
                />

                {/* Total income card */}
                <Card className="w-full py-0 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-transparent sm:w-fit dark:border-emerald-500/20 dark:from-emerald-500/10">
                    <CardContent className="flex items-center gap-2.5 px-4 py-2.5 sm:pr-10">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <div>
                            <p className="text-[11px] text-muted-foreground">Total Income (this period)</p>
                            <p className="text-sm font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {formatRupiah(totalIncome)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

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
                                    <TableHead>Adjust to Cash</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleIncomes.length === 0 && (
                                    <EmptyRow
                                        colSpan={7}
                                        icon={<HandCoins />}
                                        message={
                                            search
                                                ? `No income records match "${search}".`
                                                : 'No income records for this period yet.'
                                        }
                                    />
                                )}
                                {pagination.paged.map((inc) => (
                                    <TableRow key={inc.id}>
                                        <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                                            {formatDate(inc.income_date)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium">{inc.category.name}</span>
                                        </TableCell>
                                        <TableCell className="max-w-64 truncate text-sm text-muted-foreground">
                                            {inc.description ?? '-'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(parseFloat(inc.amount))}
                                        </TableCell>
                                        <TableCell>
                                            {inc.adjust_to_cash ? (
                                                <Badge className="bg-emerald-500/15 text-xs text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                                                    Yes
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <UserChip name={inc.creator?.name} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {can('edit incomes') && (
                                                    <Button size="icon" variant="ghost" onClick={() => openEdit(inc)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can('delete incomes') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-rose-500 hover:text-rose-600"
                                                        onClick={() => setDeleteTarget(inc)}
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
                        <DialogTitle>Add Income</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={createForm.data.income_date}
                                onChange={(e) => createForm.setData('income_date', e.target.value)}
                            />
                            <InputError message={createForm.errors.income_date} />
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
                            <Input
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                placeholder="Optional"
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
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="create_adjust"
                                checked={createForm.data.adjust_to_cash}
                                onCheckedChange={(checked) =>
                                    createForm.setData('adjust_to_cash', checked === true)
                                }
                            />
                            <Label htmlFor="create_adjust" className="cursor-pointer font-normal">
                                Adjust to opening balance (adds to fiscal year cash)
                            </Label>
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
                        <DialogTitle>Edit Income</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={editForm.data.income_date}
                                onChange={(e) => editForm.setData('income_date', e.target.value)}
                            />
                            <InputError message={editForm.errors.income_date} />
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
                            <Input
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
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
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="edit_adjust"
                                checked={editForm.data.adjust_to_cash}
                                onCheckedChange={(checked) =>
                                    editForm.setData('adjust_to_cash', checked === true)
                                }
                            />
                            <Label htmlFor="edit_adjust" className="cursor-pointer font-normal">
                                Adjust to opening balance
                            </Label>
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
                        <DialogTitle>Delete Income</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this income of{' '}
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
