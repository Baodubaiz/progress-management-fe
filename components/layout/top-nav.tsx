'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, LayoutGrid, FolderKanban } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStoredUser } from '@/src/lib/auth';
import type { AuthUser } from '@/src/features/auth/types/auth.types';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'Dự án', href: '/projects', icon: FolderKanban },
];

export function TopNavbar({ title, description }: { title?: string; description?: string }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        setUser(getStoredUser());
    }, []);

    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

    return (
        <header className="border-b border-sky-100 bg-white/85 shadow-[0_10px_24px_rgba(59,130,246,0.08)] backdrop-blur-md">
            <div className="flex flex-col gap-3 px-4 py-3 md:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-500 to-sky-400 text-sm font-bold text-white shadow-md shadow-blue-200/80">
                            T
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                            <span className="text-lg font-bold tracking-tight">Trello</span>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-1 rounded-xl border border-sky-100 bg-sky-50/70 p-1 shadow-inner shadow-sky-100 md:flex">
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-sky-700"
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Link
                            href="/profile"
                            aria-label="Go to profile"
                            className="group flex items-center gap-2.5 rounded-xl border border-sky-100 bg-white px-3 py-1.5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                        >
                            <Avatar className="h-8 w-8 border border-sky-100 ring-2 ring-sky-50 transition group-hover:ring-sky-100">
                                {user?.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                ) : null}
                                <AvatarFallback className="bg-blue-600 font-semibold text-white">
                                    {userInitial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden text-left md:block">
                                <p className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                                    {user?.username || 'Người dùng'}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 md:hidden">
                    <nav className="flex flex-wrap items-center gap-1">
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1.5 text-xs text-slate-700"
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {(title || description) ? (
                <div className="border-t border-sky-100 bg-sky-50/60 px-5 py-2 text-slate-700 md:px-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-sky-500" />
                        <span className="text-sm font-medium text-slate-800">{title ?? 'Board'}</span>
                        {description ? <span className="text-xs text-slate-500">• {description}</span> : null}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
