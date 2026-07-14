import { Link } from '@inertiajs/react';
import { ChartColumnBig, LayoutGrid, ListChecks, ShieldCheck, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/use-permission';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { can } = usePermission();

    const mainNavItems: NavItem[] = [
        ...(can('view dashboard') ? [{
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        }, {
            title: 'Analytics',
            href: '/analytics',
            icon: ChartColumnBig,
        }] : []),
        ...(can('view expenses') ? [{
            title: 'Expenses',
            href: '/expenses',
            icon: TrendingDown,
        }] : []),
        ...(can('view incomes') ? [{
            title: 'Income',
            href: '/incomes',
            icon: TrendingUp,
        }] : []),
        ...(can('view categories') ? [{
            title: 'Categories',
            href: '/categories',
            icon: ListChecks,
        }] : []),
        ...(can('view fiscal-years') ? [{
            title: 'Fiscal Years',
            href: '/fiscal-years',
            icon: Wallet,
        }] : []),
    ];

    const adminNavItems: NavItem[] = [
        ...(can('manage users') ? [{
            title: 'Users',
            href: '/users',
            icon: Users,
        }] : []),
        ...(can('manage roles') ? [{
            title: 'Roles',
            href: '/roles',
            icon: ShieldCheck,
        }] : []),
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {adminNavItems.length > 0 && (
                    <NavMain items={adminNavItems} label="Administration" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
