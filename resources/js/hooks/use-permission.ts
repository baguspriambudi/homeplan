import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    function isSuperAdmin(): boolean {
        return auth.is_super_admin ?? false;
    }

    function can(permission: string): boolean {
        if (isSuperAdmin()) return true; // super admin lolos semua check (selaras Gate::before)
        return auth.permissions?.includes(permission) ?? false;
    }

    function hasRole(role: string): boolean {
        return auth.roles?.includes(role) ?? false;
    }

    function isAdmin(): boolean {
        return hasRole('admin') || isSuperAdmin();
    }

    return { can, hasRole, isAdmin, isSuperAdmin };
}
