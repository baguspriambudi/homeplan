import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, PageHeader, SearchInput, TablePagination, TypeBadge, usePagination, UserChip } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/categories' }];

const TYPES = ['income', 'spending', 'bills', 'instalment', 'saving'] as const;
type CategoryType = (typeof TYPES)[number];

interface Category {
    id: number;
    name: string;
    type: CategoryType;
    creator?: { id: number; name: string };
    created_at: string;
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [search, setSearch] = useState('');

    const visibleCategories = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter(
            (cat) => cat.name.toLowerCase().includes(q) || cat.type.toLowerCase().includes(q),
        );
    }, [categories, search]);

    const pagination = usePagination(visibleCategories);

    const createForm = useForm({ name: '', type: 'spending' as CategoryType });
    const editForm = useForm({ name: '', type: 'spending' as CategoryType });

    function openCreate() {
        createForm.reset();
        setCreateOpen(true);
    }

    function openEdit(cat: Category) {
        editForm.setData({ name: cat.name, type: cat.type });
        setEditTarget(cat);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/categories', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.patch(`/categories/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/categories/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Group transactions into income and expense categories."
                    action={
                        can('create categories') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> New Category
                            </Button>
                        )
                    }
                />

                <SearchInput value={search} onChange={setSearch} placeholder="Search category name or type..." />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleCategories.length === 0 && (
                                    <EmptyRow
                                        colSpan={4}
                                        icon={<Tags />}
                                        message={
                                            search
                                                ? `No categories match "${search}".`
                                                : 'No categories yet.'
                                        }
                                    />
                                )}
                                {pagination.paged.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Tags className="h-4 w-4 text-muted-foreground" />
                                                </span>
                                                <span className="font-medium">{cat.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <TypeBadge type={cat.type} />
                                        </TableCell>
                                        <TableCell>
                                            <UserChip name={cat.creator?.name} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {can('edit categories') && (
                                                    <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can('delete categories') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-rose-500 hover:text-rose-600"
                                                        onClick={() => setDeleteTarget(cat)}
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
                        <DialogTitle>New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Category name"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Select
                                value={createForm.data.type}
                                onValueChange={(v) => createForm.setData('type', v as CategoryType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.type} />
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
                        <DialogTitle>Edit Category</DialogTitle>
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
                        <div>
                            <Label>Type</Label>
                            <Select
                                value={editForm.data.type}
                                onValueChange={(v) => editForm.setData('type', v as CategoryType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.type} />
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
                        <DialogTitle>Delete Category</DialogTitle>
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
