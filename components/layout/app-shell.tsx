import type { ReactNode } from 'react';

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
        <div className="min-h-screen bg-transparent text-white">
            <div className="flex min-h-screen flex-col">
                <TopNavbar title={title} description={description} />
                <main className="flex-1 overflow-x-auto px-4 pb-6 pt-4 md:px-6">{children}</main>
            </div>
        </div>
    );
}
