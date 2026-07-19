import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CookingPot, Pencil, Plus, Trash2, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { EmptyRow, formatQty, ingredientColor, PageHeader, SearchInput, TablePagination, usePagination, UserChip } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meal Planning', href: '#' },
    { title: 'Menus', href: '/menus' },
];

interface UomOption {
    id: number;
    name: string;
}

interface Ingredient {
    id: number;
    name: string;
    qty: string;
    uom?: { id: number; name: string };
}

interface Menu {
    id: number;
    name: string;
    description: string | null;
    ingredients: Ingredient[];
    creator?: { id: number; name: string };
}

interface Props {
    menus: Menu[];
    uoms: UomOption[];
}

interface IngredientRow {
    name: string;
    qty: string;
    uom_id: string;
}

// Hanya angka + satu pemisah desimal; titik otomatis jadi koma agar cocok dgn format id-ID
function sanitizeQty(value: string): string {
    const cleaned = value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const [head, ...rest] = cleaned.split(',');
    return rest.length > 0 ? `${head},${rest.join('')}` : head;
}

export default function MenusIndex({ menus, uoms }: Props) {
    const { can } = usePermission();
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Menu | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
    const [search, setSearch] = useState('');

    // Default satuan mengikuti master "gr" jika ada
    const defaultUomId = String(uoms.find((u) => u.name === 'gr')?.id ?? uoms[0]?.id ?? '');
    const emptyRow = (): IngredientRow => ({ name: '', qty: '', uom_id: defaultUomId });

    const visibleMenus = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return menus;
        return menus.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.ingredients.some((i) => i.name.toLowerCase().includes(q)),
        );
    }, [menus, search]);

    const pagination = usePagination(visibleMenus);

    const form = useForm<{ name: string; description: string; ingredients: IngredientRow[] }>({
        name: '',
        description: '',
        ingredients: [emptyRow()],
    });

    const errors = form.errors as Record<string, string>;

    function openCreate() {
        form.setData({ name: '', description: '', ingredients: [emptyRow()] });
        form.clearErrors();
        setEditTarget(null);
        setCreateOpen(true);
    }

    function openEdit(menu: Menu) {
        form.setData({
            name: menu.name,
            description: menu.description ?? '',
            ingredients: menu.ingredients.map((i) => ({
                name: i.name,
                // Nilai edit tanpa pemisah ribuan ("1.500" akan terbaca 1,5 oleh backend)
                qty: String(Number(i.qty)).replace('.', ','),
                uom_id: String(i.uom?.id ?? defaultUomId),
            })),
        });
        form.clearErrors();
        setCreateOpen(false);
        setEditTarget(menu);
    }

    function closeDialog() {
        setCreateOpen(false);
        setEditTarget(null);
    }

    function setIngredient(index: number, patch: Partial<IngredientRow>) {
        form.setData(
            'ingredients',
            form.data.ingredients.map((row, i) => (i === index ? { ...row, ...patch } : row)),
        );
    }

    function addRow() {
        form.setData('ingredients', [...form.data.ingredients, emptyRow()]);
    }

    function removeRow(index: number) {
        if (form.data.ingredients.length <= 1) return;
        form.setData(
            'ingredients',
            form.data.ingredients.filter((_, i) => i !== index),
        );
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editTarget) {
            form.patch(`/menus/${editTarget.id}`, { onSuccess: closeDialog });
        } else {
            form.post('/menus', { onSuccess: closeDialog });
        }
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/menus/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const dialogOpen = createOpen || !!editTarget;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menus" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Master dish menus with their ingredients — used when scheduling meal plans."
                    action={
                        can('create menus') && (
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" /> New Menu
                            </Button>
                        )
                    }
                />

                <SearchInput value={search} onChange={setSearch} placeholder="Search menu or ingredient name..." />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Menu</TableHead>
                                    <TableHead>Ingredients</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleMenus.length === 0 && (
                                    <EmptyRow
                                        colSpan={4}
                                        icon={<CookingPot />}
                                        message={search ? `No menus match "${search}".` : 'No menus yet.'}
                                    />
                                )}
                                {pagination.paged.map((menu) => (
                                    <TableRow key={menu.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <CookingPot className="h-4 w-4 text-muted-foreground" />
                                                </span>
                                                <div>
                                                    <p className="font-medium">{menu.name}</p>
                                                    {menu.description && (
                                                        <p className="max-w-xs truncate text-xs text-muted-foreground">
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex max-w-md flex-wrap gap-1">
                                                {menu.ingredients.map((ing) => (
                                                    <Badge
                                                        key={ing.id}
                                                        variant="secondary"
                                                        className={`font-normal ${ingredientColor(ing.name)}`}
                                                    >
                                                        {ing.name} {formatQty(ing.qty)} {ing.uom?.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <UserChip name={menu.creator?.name} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {can('edit menus') && (
                                                    <Button size="icon" variant="ghost" onClick={() => openEdit(menu)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can('delete menus') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-rose-500 hover:text-rose-600"
                                                        onClick={() => setDeleteTarget(menu)}
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

            {/* Create / Edit Modal */}
            <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editTarget ? 'Edit Menu' : 'New Menu'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <Label>Menu Name</Label>
                            <Input
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g. Ayam Goreng Lengkuas"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label>
                                Description <span className="text-xs text-muted-foreground">(optional)</span>
                            </Label>
                            <Textarea
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Short note about this dish"
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Ingredients</Label>
                                <Button type="button" size="sm" variant="outline" onClick={addRow}>
                                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Ingredient
                                </Button>
                            </div>
                            <InputError message={errors.ingredients} />

                            {form.data.ingredients.map((row, i) => (
                                <div key={i} className="rounded-lg border p-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={row.name}
                                                onChange={(e) => setIngredient(i, { name: e.target.value })}
                                                placeholder="Ingredient name, e.g. Ayam"
                                            />
                                            <InputError message={errors[`ingredients.${i}.name`]} />
                                        </div>
                                        <div className="w-full sm:w-28">
                                            <Input
                                                value={row.qty}
                                                onChange={(e) => setIngredient(i, { qty: sanitizeQty(e.target.value) })}
                                                placeholder="Qty (0,5)"
                                                inputMode="decimal"
                                            />
                                            <InputError message={errors[`ingredients.${i}.qty`]} />
                                        </div>
                                        <div className="w-full sm:w-32">
                                            <Select
                                                value={row.uom_id}
                                                onValueChange={(v) => setIngredient(i, { uom_id: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {uoms.map((u) => (
                                                        <SelectItem key={u.id} value={String(u.id)}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors[`ingredients.${i}.uom_id`]} />
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="shrink-0 text-muted-foreground hover:text-rose-500"
                                            onClick={() => removeRow(i)}
                                            disabled={form.data.ingredients.length <= 1}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-muted-foreground">
                                Qty boleh pakai koma, contoh: 0,5 — satuan default gr.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {editTarget ? 'Save' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Menu</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong> and its ingredients? This
                        cannot be undone.
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
