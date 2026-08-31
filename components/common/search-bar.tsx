import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchBar({
    value,
    onChange,
    placeholder = 'Tìm kiếm...',
    className,
}: {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    return (
        <div className={cn('relative w-full', className)}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm"
            />
        </div>
    );
}
