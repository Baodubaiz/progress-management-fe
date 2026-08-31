import type { ReactNode } from 'react';

export function PageHeader({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Workspace</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
                {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
            </div>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
