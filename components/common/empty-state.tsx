import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyState({
    title,
    description,
    action,
    icon,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
}) {
    return (
        <Card className="border-dashed border-slate-200 bg-slate-50/80">
            <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                    {icon ?? '•'}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {description ? <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p> : null}
                {action ? <div className="mt-5">{typeof action === 'string' ? <Button>{action}</Button> : action}</div> : null}
            </CardContent>
        </Card>
    );
}
