import { Head, router, useForm } from '@inertiajs/react';
import { Fragment, useMemo, useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronDown,
    KeyRound,
    Minus,
    Plus,
    Search,
    Settings2,
    Shield,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';
import { PageHeader, TablePagination, usePagination } from '@/components/finance-ui';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '#' },
    { title: 'Roles', href: '/roles' },
];

interface RoleRow {
    id: number;
    name: string;
    permissions: string[];
    users_count: number;
}

interface Props {
    roles: RoleRow[];
    permissions: string[];
}

// Kelompokkan permissions berdasarkan resource
const CRUD_ACTIONS = ['view', 'create', 'edit', 'delete'] as const;
type CrudAction = (typeof CRUD_ACTIONS)[number];

interface PermissionGroup {
    resource: string;
    label: string;
    type: 'crud' | 'single';
    permissions: string[];
}

function groupPermissions(permissions: string[]): PermissionGroup[] {
    const resourceMap: Record<string, string[]> = {};
    const singlePerms: string[] = [];

    for (const perm of permissions) {
        const parts = perm.split(' ');
        const action = parts[0];
        const resource = parts.slice(1).join(' ');

        if (CRUD_ACTIONS.includes(action as CrudAction) && resource) {
            if (!resourceMap[resource]) resourceMap[resource] = [];
            resourceMap[resource].push(perm);
        } else {
            singlePerms.push(perm);
        }
    }

    const groups: PermissionGroup[] = Object.entries(resourceMap).map(([resource, perms]) => ({
        resource,
        label: resource.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        type: 'crud',
        permissions: perms,
    }));

    if (singlePerms.length > 0) {
        groups.push({
            resource: 'administration',
            label: 'Administration',
            type: 'single',
            permissions: singlePerms,
        });
    }

    return groups;
}

// Warna avatar per role: built-in punya warna tetap, sisanya bergiliran
const ROLE_COLORS = [
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
];

function roleColor(role: RoleRow, index: number): string {
    if (role.name === 'super-admin') return 'bg-rose-500/15 text-rose-600 dark:text-rose-400';
    if (role.name === 'admin') return 'bg-violet-500/15 text-violet-600 dark:text-violet-400';
    if (role.name === 'user') return 'bg-sky-500/15 text-sky-600 dark:text-sky-400';
    return ROLE_COLORS[index % ROLE_COLORS.length];
}

// Role bawaan sistem: tidak bisa dihapus, termasuk oleh super admin sendiri
const BUILT_IN_ROLES = ['super-admin', 'admin', 'user'];

function CrudPermissionRow({
    resource,
    label,
    allPermissions,
    checked,
    onToggle,
}: {
    resource: string;
    label: string;
    allPermissions: string[];
    checked: string[];
    onToggle: (perm: string) => void;
}) {
    const resourcePerms = allPermissions.filter((p) => p.endsWith(resource));

    function toggleAll() {
        const allChecked = CRUD_ACTIONS.every((a) => {
            const perm = `${a} ${resource}`;
            return !resourcePerms.includes(perm) || checked.includes(perm);
        });
        CRUD_ACTIONS.forEach((a) => {
            const perm = `${a} ${resource}`;
            if (resourcePerms.includes(perm)) {
                const shouldCheck = !allChecked;
                const isChecked = checked.includes(perm);
                if (shouldCheck !== isChecked) onToggle(perm);
            }
        });
    }

    const availableActions = CRUD_ACTIONS.filter((a) => resourcePerms.includes(`${a} ${resource}`));
    const allChecked = availableActions.length > 0 && availableActions.every((a) => checked.includes(`${a} ${resource}`));
    const someChecked = availableActions.some((a) => checked.includes(`${a} ${resource}`));

    return (
        <tr className="border-b last:border-0">
            <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={allChecked}
                        data-state={someChecked && !allChecked ? 'indeterminate' : undefined}
                        onCheckedChange={toggleAll}
                        className={someChecked && !allChecked ? 'opacity-60' : ''}
                    />
                    <span className="text-sm font-medium">{label}</span>
                </div>
            </td>
            {CRUD_ACTIONS.map((action) => {
                const perm = `${action} ${resource}`;
                const exists = resourcePerms.includes(perm);
                return (
                    <td key={action} className="px-2 py-3 text-center">
                        {exists ? (
                            <Checkbox
                                checked={checked.includes(perm)}
                                onCheckedChange={() => onToggle(perm)}
                            />
                        ) : (
                            <span className="text-muted-foreground/30">—</span>
                        )}
                    </td>
                );
            })}
        </tr>
    );
}

/** Matriks permission read-only di baris yang di-expand */
function PermissionMatrix({ role, allPermissions }: { role: RoleRow; allPermissions: string[] }) {
    const groups = groupPermissions(allPermissions);

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
                const granted = group.permissions.filter((p) => role.permissions.includes(p));
                return (
                    <div key={group.resource} className="rounded-xl border bg-card p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{group.label}</span>
                            <span
                                className={`text-xs font-medium ${
                                    granted.length === group.permissions.length
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : granted.length === 0
                                          ? 'text-muted-foreground/50'
                                          : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {granted.length}/{group.permissions.length}
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {group.permissions.map((perm) => {
                                const has = role.permissions.includes(perm);
                                const shortLabel =
                                    group.type === 'crud' ? perm.split(' ')[0] : perm;
                                return (
                                    <span
                                        key={perm}
                                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize ${
                                            has
                                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-muted text-muted-foreground/50 line-through'
                                        }`}
                                    >
                                        {has ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                        {shortLabel}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

type SortKey = 'name' | 'users' | null;

export default function RolesIndex({ roles, permissions }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<RoleRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoleRow | null>(null);
    const [editPerms, setEditPerms] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const createForm = useForm({ name: '' });
    const permissionGroups = groupPermissions(permissions);

    const totalUsers = roles.reduce((sum, r) => sum + r.users_count, 0);

    const visibleRoles = useMemo(() => {
        let list = roles;
        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.permissions.some((p) => p.toLowerCase().includes(q)),
            );
        }
        if (sortKey) {
            list = [...list].sort((a, b) => {
                const cmp =
                    sortKey === 'name'
                        ? a.name.localeCompare(b.name)
                        : a.users_count - b.users_count;
                return sortAsc ? cmp : -cmp;
            });
        }
        return list;
    }, [roles, search, sortKey, sortAsc]);

    const pagination = usePagination(visibleRoles);

    function toggleSort(key: Exclude<SortKey, null>) {
        if (sortKey === key) {
            if (sortAsc) setSortAsc(false);
            else {
                setSortKey(null);
                setSortAsc(true);
            }
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    }

    function sortIcon(key: Exclude<SortKey, null>) {
        if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
        return sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
    }

    function toggleExpand(id: number) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function openEdit(role: RoleRow) {
        setEditPerms([...role.permissions]);
        setEditTarget(role);
    }

    function togglePerm(perm: string) {
        setEditPerms((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
        );
    }

    function toggleAllPerms() {
        if (editPerms.length === permissions.length) {
            setEditPerms([]);
        } else {
            setEditPerms([...permissions]);
        }
    }

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/roles', {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function submitEditPerms() {
        if (!editTarget) return;
        router.patch(
            `/roles/${editTarget.id}/permissions`,
            { permissions: editPerms },
            { preserveScroll: true, onSuccess: () => setEditTarget(null) },
        );
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/roles/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Heading */}
                <PageHeader
                    subtitle="Manage roles and access permissions."
                    action={
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="mr-1 h-4 w-4" /> New Role
                        </Button>
                    }
                />

                {/* Summary chips */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 py-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                                <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Roles</p>
                                <p className="text-base font-bold">{roles.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 py-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                                <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Permissions</p>
                                <p className="text-base font-bold">{permissions.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 py-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                                <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            </span>
                            <div>
                                <p className="text-xs text-muted-foreground">Users Assigned</p>
                                <p className="text-base font-bold">{totalUsers}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search role or permission..."
                        className="bg-card pl-9"
                    />
                </div>

                {/* Table */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-10" />
                                    <TableHead>
                                        <button
                                            type="button"
                                            onClick={() => toggleSort('name')}
                                            className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                                        >
                                            Role {sortIcon('name')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">Permission Coverage</TableHead>
                                    <TableHead>
                                        <button
                                            type="button"
                                            onClick={() => toggleSort('users')}
                                            className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                                        >
                                            Users {sortIcon('users')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleRoles.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                            {search
                                                ? `No roles match "${search}".`
                                                : 'No roles yet.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {pagination.paged.map((role, idx) => {
                                    const isOpen = expanded.has(role.id);
                                    const coverage =
                                        permissions.length > 0
                                            ? Math.round((role.permissions.length / permissions.length) * 100)
                                            : 0;
                                    return (
                                        <Fragment key={role.id}>
                                            <TableRow
                                                onClick={() => toggleExpand(role.id)}
                                                className="cursor-pointer"
                                            >
                                                <TableCell className="pr-0">
                                                    <ChevronDown
                                                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                                                            isOpen ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${roleColor(role, idx)}`}
                                                        >
                                                            <Shield className="h-4 w-4" />
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold capitalize">{role.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {role.permissions.length} permission
                                                                {BUILT_IN_ROLES.includes(role.name) && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="ml-2 px-1.5 py-0 text-[10px]"
                                                                    >
                                                                        built-in
                                                                    </Badge>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className={`h-full rounded-full ${
                                                                    coverage === 100
                                                                        ? 'bg-emerald-500'
                                                                        : coverage > 0
                                                                          ? 'bg-amber-500'
                                                                          : 'bg-muted-foreground/20'
                                                                }`}
                                                                style={{ width: `${coverage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs tabular-nums text-muted-foreground">
                                                            {coverage}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {role.users_count}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div
                                                        className="flex justify-end gap-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Button size="sm" variant="outline" onClick={() => openEdit(role)}>
                                                            <Settings2 className="mr-1 h-3.5 w-3.5" /> Set Permissions
                                                        </Button>
                                                        {!BUILT_IN_ROLES.includes(role.name) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-rose-500 hover:text-rose-600"
                                                                onClick={() => setDeleteTarget(role)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {isOpen && (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell colSpan={5} className="bg-muted/30 p-4">
                                                        <PermissionMatrix role={role} allPermissions={permissions} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <TablePagination {...pagination} />
                    </CardContent>
                </Card>
            </div>

            {/* Create Role */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Role</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div>
                            <Label>Role Name</Label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g. manager"
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

            {/* Edit Permissions — grouped by resource */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Permissions —{' '}
                            <span className="capitalize text-primary">{editTarget?.name}</span>
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Check the actions allowed for this role.
                        </p>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-2 text-left font-medium text-muted-foreground">
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <Checkbox
                                                checked={editPerms.length === permissions.length && permissions.length > 0}
                                                data-state={
                                                    editPerms.length > 0 && editPerms.length < permissions.length
                                                        ? 'indeterminate'
                                                        : undefined
                                                }
                                                onCheckedChange={toggleAllPerms}
                                            />
                                            <span>Resource</span>
                                        </label>
                                    </th>
                                    {CRUD_ACTIONS.map((a) => (
                                        <th key={a} className="w-16 pb-2 text-center font-medium capitalize text-muted-foreground">
                                            {a}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {permissionGroups
                                    .filter((g) => g.type === 'crud')
                                    .map((group) => (
                                        <CrudPermissionRow
                                            key={group.resource}
                                            resource={group.resource}
                                            label={group.label}
                                            allPermissions={permissions}
                                            checked={editPerms}
                                            onToggle={togglePerm}
                                        />
                                    ))}
                            </tbody>
                        </table>

                        {/* Single permissions (manage users, manage roles, dll) */}
                        {permissionGroups
                            .filter((g) => g.type === 'single')
                            .map((group) => (
                                <div key={group.resource} className="mt-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        {group.label}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {group.permissions.map((perm) => (
                                            <label
                                                key={perm}
                                                className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-muted/50"
                                            >
                                                <Checkbox
                                                    checked={editPerms.includes(perm)}
                                                    onCheckedChange={() => togglePerm(perm)}
                                                />
                                                <span className="text-sm">{perm}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-xs text-muted-foreground">
                            {editPerms.length} permissions selected
                        </span>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => setEditTarget(null)}>
                                Cancel
                            </Button>
                            <Button onClick={submitEditPerms}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete role <strong>{deleteTarget?.name}</strong>? This cannot be undone.
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
