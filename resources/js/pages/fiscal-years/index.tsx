import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { CalendarRange, Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, formatDate, PageHeader, TablePagination, usePagination } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Fiscal Years', href: '/fiscal-years' }];

interface FiscalYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    opening_balance: number;
    total_expenses: number;
    remaining_amount: number;
    status: 'open' | 'closed';
}

interface Props {
    fiscalYears: FiscalYear[];
}

export default function FiscalYearsIndex({ fiscalYears }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<FiscalYear | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<FiscalYear | null>(null);

    const pagination = usePagination(fiscalYears);

    const createForm = useForm({
        name: '',
        start_date: '',
        end_date: '',
        opening_balance: '',
    });

    const editForm = useForm({
        name: '',
        start_date: '',
        end_date: '',
        opening_balance: '',
        status: 'open' as 'open' | 'closed',
    });

    function openCreate() {
        createForm.reset();
        setCreateOpen(true);
    }

    function openEdit(fy: FiscalYear) {
        editForm.setData({
            name: fy.name,
            start_date: fy.start_date,
            end_date: fy.end_date,
            opening_balance: String(fy.opening_balance),
            status: fy.status,
        });
        setEditTarget(fy);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/fiscal-years', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/fiscal-years/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/fiscal-years/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fiscal Years" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Budget periods with their opening balance and remaining funds."
                    action={
                        can('create fiscal-years') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> New Fiscal Year
                            </Button>
                        )
                    }
                />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead className="text-right">Opening Balance</TableHead>
                                    <TableHead className="text-right">Total Expenses</TableHead>
                                    <TableHead className="text-right">Remaining</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fiscalYears.length === 0 && (
                                    <EmptyRow
                                        colSpan={7}
                                        icon={<CalendarRange />}
                                        message="No fiscal years yet. Create your first period to start tracking."
                                    />
                                )}
                                {pagination.paged.map((fy) => {
                                    const usedPct =
                                        Number(fy.opening_balance) > 0
                                            ? Math.min(
                                                  100,
                                                  Math.round(
                                                      (Number(fy.total_expenses) / Number(fy.opening_balance)) * 100,
                                                  ),
                                              )
                                            : 0;
                                    const isOver = Number(fy.remaining_amount) < 0;
                                    return (
                                        <TableRow key={fy.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                            fy.status === 'open'
                                                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        <CalendarRange className="h-4 w-4" />
                                                    </span>
                                                    <span className="font-semibold">{fy.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                {formatDate(fy.start_date)} – {formatDate(fy.end_date)}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-right tabular-nums">
                                                {formatRupiah(fy.opening_balance)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex flex-col items-end gap-1">
                                                    <span className="whitespace-nowrap tabular-nums text-rose-600 dark:text-rose-400">
                                                        {formatRupiah(fy.total_expenses)}
                                                    </span>
                                                    <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                isOver ? 'bg-rose-600' : usedPct >= 80 ? 'bg-amber-500' : 'bg-rose-400'
                                                            }`}
                                                            style={{ width: `${usedPct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={`whitespace-nowrap text-right font-semibold tabular-nums ${
                                                    isOver
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : 'text-emerald-600 dark:text-emerald-400'
                                                }`}
                                            >
                                                {formatRupiah(fy.remaining_amount)}
                                            </TableCell>
                                            <TableCell>
                                                {fy.status === 'open' ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                        Open
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                                        Closed
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {can('edit fiscal-years') && (
                                                        <Button size="icon" variant="ghost" onClick={() => openEdit(fy)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {can('delete fiscal-years') && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-rose-500 hover:text-rose-600"
                                                            onClick={() => setDeleteTarget(fy)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                        <DialogTitle>New Fiscal Year</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g. 2026 Q1"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={createForm.data.start_date}
                                    onChange={(e) => createForm.setData('start_date', e.target.value)}
                                />
                                <InputError message={createForm.errors.start_date} />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={createForm.data.end_date}
                                    onChange={(e) => createForm.setData('end_date', e.target.value)}
                                />
                                <InputError message={createForm.errors.end_date} />
                            </div>
                        </div>
                        <div>
                            <Label>Opening Balance (Rp)</Label>
                            <MoneyInput
                                value={createForm.data.opening_balance}
                                onValueChange={(raw) => createForm.setData('opening_balance', raw)}
                            />
                            <InputError message={createForm.errors.opening_balance} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Fiscal Year</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={editForm.data.start_date}
                                    onChange={(e) => editForm.setData('start_date', e.target.value)}
                                />
                                <InputError message={editForm.errors.start_date} />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={editForm.data.end_date}
                                    onChange={(e) => editForm.setData('end_date', e.target.value)}
                                />
                                <InputError message={editForm.errors.end_date} />
                            </div>
                        </div>
                        <div>
                            <Label>Opening Balance (Rp)</Label>
                            <MoneyInput
                                value={editForm.data.opening_balance}
                                onValueChange={(raw) => editForm.setData('opening_balance', raw)}
                            />
                            <InputError message={editForm.errors.opening_balance} />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={editForm.data.status}
                                onValueChange={(v) => editForm.setData('status', v as 'open' | 'closed')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.status} />
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
                        <DialogTitle>Delete Fiscal Year</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
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
