import type { ReactNode } from 'react';

export function SectionHeader({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {description ? <p className="text-sm text-slate-500">{description}</p> : null}
            </div>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
