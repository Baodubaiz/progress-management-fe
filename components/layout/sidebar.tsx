'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BriefcaseBusiness, House, LogOut, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/features/auth/hooks/useAuth';

const items = [
    { label: 'Dashboard', href: '/projects', icon: House },
    { label: 'Projects', href: '/projects', icon: BriefcaseBusiness },
    { label: 'Profile', href: '/profile', icon: UserRound },
];

export function SidebarNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="flex h-full w-72 flex-col border-r border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">PM</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Progress Board</h2>
            </div>

            <nav className="space-y-2">
                {items.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6">
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2 border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
}
