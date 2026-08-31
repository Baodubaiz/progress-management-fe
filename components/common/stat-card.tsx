import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
    title,
    value,
    description,
    icon,
    tone = 'blue',
}: {
    title: string;
    value: string | number;
    description?: string;
    icon?: ReactNode;
    tone?: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
}) {
    const toneStyles: Record<string, string> = {
        blue: 'border-blue-100 bg-blue-50/70 text-blue-700',
        green: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
        violet: 'border-violet-100 bg-violet-50/70 text-violet-700',
        amber: 'border-amber-100 bg-amber-50/70 text-amber-700',
        rose: 'border-rose-100 bg-rose-50/70 text-rose-700',
    };

    return (
        <Card className={cn('border', toneStyles[tone])}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-slate-600">{title}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
                    </div>
                    {icon ? <div className="rounded-xl bg-white/80 p-2 shadow-sm">{icon}</div> : null}
                </div>
            </CardContent>
        </Card>
    );
}
