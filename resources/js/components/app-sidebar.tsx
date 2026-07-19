import { Link } from '@inertiajs/react';
import { BadgeDollarSign, BotMessageSquare, CalendarRange, ChartColumnBig, CookingPot, LayoutGrid, ListChecks, ReceiptText, Ruler, ShieldCheck, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
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

    const mealNavItems: NavItem[] = [
        ...(can('view meal-plans') ? [{
            title: 'Meal Plans',
            href: '/meal-plans',
            icon: CalendarRange,
        }] : []),
        ...(can('view menus') ? [{
            title: 'Menus',
            href: '/menus',
            icon: CookingPot,
        }] : []),
        ...(can('view uoms') ? [{
            title: 'Units',
            href: '/uoms',
            icon: Ruler,
        }] : []),
    ];

    const adminNavItems: NavItem[] = [
        ...(can('view users') ? [{
            title: 'Users',
            href: '/users',
            icon: Users,
        }] : []),
        ...(can('manage telegram') ? [{
            title: 'Telegram Bot',
            href: '/telegram-config',
            icon: BotMessageSquare,
        }] : []),
        ...(can('manage roles') ? [{
            title: 'Roles',
            href: '/roles',
            icon: ShieldCheck,
        }] : []),
        ...(can('manage plans') ? [{
            title: 'Plans',
            href: '/plans',
            icon: BadgeDollarSign,
        }] : []),
        ...(can('manage payments') ? [{
            title: 'Payments',
            href: '/payment-orders',
            icon: ReceiptText,
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
                {mealNavItems.length > 0 && (
                    <NavMain items={mealNavItems} label="Meal Planning" />
                )}
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
