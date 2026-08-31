import type { ReactNode } from 'react';

import { SidebarNav } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-nav';

export function AppShell({
    children,
    title,
    description,
}: {
    children: ReactNode;
    title?: string;
    description?: string;
}) {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <div className="hidden md:block">
                    <SidebarNav />
                </div>

                <div className="flex-1">
                    <TopNavbar title={title} description={description} />
                    <main className="p-4 md:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
