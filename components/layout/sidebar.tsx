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
        <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-slate-950/25 p-4 backdrop-blur-sm">
            <div className="mb-8 flex items-center gap-3 px-2 pt-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-200">
                    T
                </div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">Trello</p>
                    <h2 className="text-base font-semibold text-white">Progress Board</h2>
                </div>
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
                                active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
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
                    className="w-full justify-start gap-2 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>
        </aside>
    );
}
