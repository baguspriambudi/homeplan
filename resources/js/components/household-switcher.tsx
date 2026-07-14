import { router, usePage } from '@inertiajs/react';
import { House } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SharedData } from '@/types';

/** Dropdown untuk super admin: lihat semua household atau satu household tertentu */
export function HouseholdSwitcher() {
    const { auth, households, householdFilter } = usePage<SharedData>().props;

    if (!auth.is_super_admin || households.length === 0) return null;

    function handleChange(value: string) {
        router.post(
            '/household-filter',
            { household_id: value === 'all' ? null : Number(value) },
            { preserveScroll: true },
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <House className="h-4 w-4 text-muted-foreground" />
            <Select value={householdFilter?.toString() ?? 'all'} onValueChange={handleChange}>
                <SelectTrigger className="h-8 w-44 bg-card text-xs">
                    <SelectValue placeholder="All households" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All households</SelectItem>
                    {households.map((h) => (
                        <SelectItem key={h.id} value={String(h.id)}>
                            {h.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
