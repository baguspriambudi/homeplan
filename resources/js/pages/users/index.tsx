import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, UsersRound } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { EmptyRow, formatDate, PageHeader, SearchInput, TablePagination, usePagination } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '#' },
    { title: 'Users', href: '/users' },
];

interface UserRow {
    id: number;
    name: string;
    email: string;
    roles: string[];
    household: string | null;
    created_at: string;
}

interface Props {
    users: UserRow[];
    roles: string[];
}

const ROLE_BADGE: Record<string, string> = {
    admin: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
    user: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
};

// Warna avatar deterministik berdasarkan nama
const AVATAR_COLORS = [
    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    'bg-rose-500/15 text-rose-700 dark:text-rose-400',
    'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
    'bg-violet-500/15 text-violet-700 dark:text-violet-400',
];

function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function UsersIndex({ users, roles }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<UserRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
    const [search, setSearch] = useState('');

    const visibleUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.roles.some((r) => r.toLowerCase().includes(q)),
        );
    }, [users, search]);

    const pagination = usePagination(visibleUsers);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles[0] ?? '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    function openCreate() {
        createForm.reset();
        setCreateOpen(true);
    }

    function openEdit(user: UserRow) {
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.roles[0] ?? '',
        });
        setEditTarget(user);
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/users', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/users/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/users/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                <PageHeader
                    subtitle="Manage user accounts and their roles."
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="mr-1 h-4 w-4" /> New User
                        </Button>
                    }
                />

                <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, or role..." />

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleUsers.length === 0 && (
                                    <EmptyRow
                                        colSpan={4}
                                        icon={<UsersRound />}
                                        message={
                                            search
                                                ? `No users match "${search}".`
                                                : 'No users yet.'
                                        }
                                    />
                                )}
                                {pagination.paged.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(user.name)}`}
                                                >
                                                    {initials(user.name)}
                                                </span>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                        {user.household && (
                                                            <span className="ml-1.5 text-muted-foreground/60">
                                                                · {user.household}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${
                                                    ROLE_BADGE[user.roles[0] ?? ''] ??
                                                    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                                }`}
                                            >
                                                {user.roles[0] ?? '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                            {formatDate(user.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => openEdit(user)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-rose-500 hover:text-rose-600"
                                                    onClick={() => setDeleteTarget(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
                        <DialogTitle>New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Full name"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                            <InputError message={createForm.errors.email} />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Min 8 characters"
                            />
                            <InputError message={createForm.errors.password} />
                        </div>
                        <div>
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={createForm.data.password_confirmation}
                                onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                placeholder="Repeat password"
                            />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <Select
                                value={createForm.data.role}
                                onValueChange={(v) => createForm.setData('role', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.role} />
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
                        <DialogTitle>Edit User</DialogTitle>
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
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                            />
                            <InputError message={editForm.errors.email} />
                        </div>
                        <div>
                            <Label>
                                New Password{' '}
                                <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>
                            </Label>
                            <Input
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="Min 8 characters"
                            />
                            <InputError message={editForm.errors.password} />
                        </div>
                        <div>
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                value={editForm.data.password_confirmation}
                                onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                placeholder="Repeat new password"
                            />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(v) => editForm.setData('role', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.role} />
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
                        <DialogTitle>Delete User</DialogTitle>
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
