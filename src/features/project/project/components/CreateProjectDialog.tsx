import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CreateProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string }) => Promise<boolean>;
}

export function CreateProjectDialog({ isOpen, onClose, onSubmit }: CreateProjectDialogProps) {
    const [form, setForm] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.name.trim()) return;

        setSubmitting(true);
        const success = await onSubmit({
            name: form.name.trim(),
            description: form.description.trim() || '',
        });

        if (success) {
            setForm({ name: '', description: '' });
        }

        setSubmitting(false);
    };

    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="create-project-title" onMouseDown={handleClose}>
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)] transition-all duration-300 animate-in zoom-in-95" onMouseDown={(event) => event.stopPropagation()}>
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">Dự án mới</p>
                        <h3 id="create-project-title" className="mt-1 text-2xl font-bold text-slate-900">Tạo dự án mới</h3>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        ×
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-sm font-medium text-slate-700">Tên dự án <span className="text-red-500">*</span></Label>
                        <Input
                            id="project-name"
                            value={form.name}
                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            placeholder="Ví dụ: Website renewal"
                            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project-description" className="text-sm font-medium text-slate-700">Mô tả</Label>
                        <textarea
                            id="project-description"
                            value={form.description}
                            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                            placeholder="Mô tả ngắn về mục tiêu dự án..."
                            className="min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={handleClose} className="px-5 transition-colors hover:bg-slate-50">
                            Hủy
                        </Button>
                        <Button type="submit" className="gap-2 bg-blue-600 px-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md disabled:opacity-70 disabled:hover:translate-y-0" disabled={submitting || !form.name.trim()}>
                            <Plus className="h-4 w-4" />
                            {submitting ? 'Đang tạo...' : 'Tạo dự án'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

