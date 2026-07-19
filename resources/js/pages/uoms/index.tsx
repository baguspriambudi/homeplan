import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Ruler, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, PageHeader, SearchInput, TablePagination, usePagination, UserChip } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meal Planning', href: '#' },
    { title: 'Units', href: '/uoms' },
];

interface Uom {
    id: number;
    name: string;
    ingredients_count: number;
    creator?: { id: number; name: string };
}

interface Props {
    uoms: Uom[];
}

export default function UomsIndex({ uoms }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Uom | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Uom | null>(null);
    const [search, setSearch] = useState('');

    const visibleUoms = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return uoms;
        return uoms.filter((u) => u.name.toLowerCase().includes(q));
    }, [uoms, search]);

    const pagination = usePagination(visibleUoms);

    const createForm = useForm({ name: '' });
    const editForm = useForm({ name: '' });

    function openCreate() {
        createForm.reset();
        setCreateOpen(true);
    }

    function openEdit(uom: Uom) {
        editForm.setData({ name: uom.name });
        setEditTarget(uom);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/uoms', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/uoms/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/uoms/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Master units of measure for menu ingredients (gr, kg, ml, ...)."
                    action={
                        can('create uoms') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> New Unit
                            </Button>
                        )
                    }
                />

                <SearchInput value={search} onChange={setSearch} placeholder="Search unit name..." />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Used By</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleUoms.length === 0 && (
                                    <EmptyRow
                                        colSpan={4}
                                        icon={<Ruler />}
                                        message={search ? `No units match "${search}".` : 'No units yet.'}
                                    />
                                )}
                                {pagination.paged.map((uom) => (
                                    <TableRow key={uom.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                                </span>
                                                <span className="font-medium">{uom.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {uom.ingredients_count} ingredient{uom.ingredients_count === 1 ? '' : 's'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <UserChip name={uom.creator?.name} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {can('edit uoms') && (
                                                    <Button size="icon" variant="ghost" onClick={() => openEdit(uom)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can('delete uoms') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-rose-500 hover:text-rose-600"
                                                        onClick={() => setDeleteTarget(uom)}
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
                        <DialogTitle>New Unit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g. gr, kg, ml"
                            />
                            <InputError message={createForm.errors.name} />
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
                        <DialogTitle>Edit Unit</DialogTitle>
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
                        <DialogTitle>Delete Unit</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
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
