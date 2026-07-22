import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { BadgeDollarSign, Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, PageHeader } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Plans', href: '/plans' }];

interface Plan {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    payment_orders_count: number;
}

interface Props {
    plans: Plan[];
}

const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

interface PlanFormData {
    name: string;
    duration_days: number | string;
    price: number | string;
    description: string;
    is_active: boolean;
    sort_order: number | string;
    [key: string]: string | number | boolean;
}

const emptyPlan: PlanFormData = {
    name: '',
    duration_days: 30,
    price: 25000,
    description: '',
    is_active: true,
    sort_order: 0,
};

export default function PlansIndex({ plans }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Plan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

    const createForm = useForm<PlanFormData>(emptyPlan);
    const editForm = useForm<PlanFormData>(emptyPlan);

    function openCreate() {
        createForm.setData(emptyPlan);
        createForm.clearErrors();
        setCreateOpen(true);
    }

    function openEdit(plan: Plan) {
        editForm.setData({
            name: plan.name,
            duration_days: plan.duration_days,
            price: plan.price,
            description: plan.description ?? '',
            is_active: plan.is_active,
            sort_order: plan.sort_order,
        });
        editForm.clearErrors();
        setEditTarget(plan);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/plans', { onSuccess: () => setCreateOpen(false) });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/plans/${editTarget.id}`, { onSuccess: () => setEditTarget(null) });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/plans/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
    }

    function planFields(form: typeof createForm) {
        return (
            <>
                <div>
                    <Label>Name</Label>
                    <Input
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="e.g. Bulanan"
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label>Duration (days)</Label>
                        <Input
                            type="number"
                            min={1}
                            value={form.data.duration_days}
                            onChange={(e) => form.setData('duration_days', e.target.value)}
                        />
                        <InputError message={form.errors.duration_days} />
                    </div>
                    <div>
                        <Label>Price (Rp)</Label>
                        <MoneyInput
                            value={String(form.data.price)}
                            onValueChange={(raw) => form.setData('price', raw)}
                        />
                        <InputError message={form.errors.price} />
                    </div>
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Optional short description"
                        rows={3}
                    />
                    <InputError message={form.errors.description} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label>Sort order</Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.data.sort_order}
                            onChange={(e) => form.setData('sort_order', e.target.value)}
                        />
                        <InputError message={form.errors.sort_order} />
                    </div>
                    <div className="flex items-end gap-2 pb-2">
                        <Checkbox
                            id={`active-${form === createForm ? 'create' : 'edit'}`}
                            checked={form.data.is_active}
                            onCheckedChange={(v) => form.setData('is_active', v === true)}
                        />
                        <Label htmlFor={`active-${form === createForm ? 'create' : 'edit'}`}>
                            Active
                        </Label>
                    </div>
                </div>
            </>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Plans" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Master harga langganan untuk registrasi dan perpanjangan."
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="mr-1 h-4 w-4" /> New Plan
                        </Button>
                    }
                />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.length === 0 && (
                                    <EmptyRow
                                        colSpan={6}
                                        icon={<BadgeDollarSign />}
                                        message="No plans yet."
                                    />
                                )}
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>
                                            <div className="font-medium">{plan.name}</div>
                                            {plan.description && (
                                                <div className="text-xs text-muted-foreground">
                                                    {plan.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {idr.format(plan.price)}
                                        </TableCell>
                                        <TableCell>{plan.duration_days} hari</TableCell>
                                        <TableCell>
                                            <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                                                {plan.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{plan.payment_orders_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => openEdit(plan)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-rose-500 hover:text-rose-600"
                                                    onClick={() => setDeleteTarget(plan)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Plan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        {planFields(createForm)}
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
                        <DialogTitle>Edit Plan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        {planFields(editForm)}
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
                        <DialogTitle>Delete Plan</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot
                        be undone.
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
