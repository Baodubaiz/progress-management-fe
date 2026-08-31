import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
    {
        variants: {
            variant: {
                default: 'border-slate-200 bg-slate-100 text-slate-700',
                blue: 'border-blue-200 bg-blue-50 text-blue-700',
                green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                violet: 'border-violet-200 bg-violet-50 text-violet-700',
                amber: 'border-amber-200 bg-amber-50 text-amber-700',
                rose: 'border-rose-200 bg-rose-50 text-rose-700',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export function Badge({
    children,
    className,
    variant,
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
    return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
