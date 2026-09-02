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
        blue: 'border-blue-100 bg-blue-50/70 text-blue-700 hover:border-blue-300 hover:bg-blue-100/50',
        green: 'border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100/50',
        violet: 'border-violet-100 bg-violet-50/70 text-violet-700 hover:border-violet-300 hover:bg-violet-100/50',
        amber: 'border-amber-100 bg-amber-50/70 text-amber-700 hover:border-amber-300 hover:bg-amber-100/50',
        rose: 'border-rose-100 bg-rose-50/70 text-rose-700 hover:border-rose-300 hover:bg-rose-100/50',
    };

    return (
        <Card className={cn('border transition-all duration-200 hover:-translate-y-0.5 shadow-sm cursor-pointer', toneStyles[tone])}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">{title}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                        {description ? <p className="mt-1 text-[11px] font-medium text-slate-500">{description}</p> : null}
                    </div>
                    {icon ? <div className="rounded-xl bg-white p-2.5 shadow-sm transition-transform group-hover:scale-110">{icon}</div> : null}
                </div>
            </CardContent>
        </Card>
    );
}
