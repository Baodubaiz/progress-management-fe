'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { getStoredUser } from '@/src/lib/auth';

export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const user = getStoredUser();

        if (!user) {
            router.replace('/login');
            return;
        }

        setReady(true);
    }, [router]);

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
                Đang kiểm tra phiên đăng nhập...
            </div>
        );
    }

    return <>{children}</>;
}
