export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth, Household } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    households: Household[];
    householdFilter: number | null;
    [key: string]: unknown;
};
