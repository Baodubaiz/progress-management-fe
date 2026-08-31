import { Bell, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStoredUser } from '@/src/lib/auth';

export function TopNavbar({ title, description }: { title?: string; description?: string }) {
    const user = getStoredUser();

    return (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Overview</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">{title ?? 'Dashboard'}</h1>
                    {description ? <p className="text-sm text-slate-500">{description}</p> : null}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden w-72 md:block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input placeholder="Tìm kiếm..." className="h-9 rounded-xl border-slate-200 bg-slate-50 pl-9" />
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-full border border-slate-200 bg-white text-slate-700">
                        <Bell className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                            <AvatarFallback>{user?.username?.slice(0, 2)?.toUpperCase() ?? 'PM'}</AvatarFallback>
                        </Avatar>
                        <div className="hidden text-left md:block">
                            <p className="text-sm font-medium text-slate-900">{user?.username ?? 'Người dùng'}</p>
                            <p className="text-[11px] text-slate-500">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
