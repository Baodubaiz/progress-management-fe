'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLabels } from '@/src/features/label/hooks/useLabels';
import { useToast } from '@/src/providers/toast-context';

export function LabelList({ projectId }: { projectId: string }) {
    const { labels, loading, error, fetchLabels, createLabel, deleteLabel } = useLabels(projectId);
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchLabels();
    }, [fetchLabels]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        const created = await createLabel({ projectId, name: name.trim(), color });
        if (created) {
            setName('');
            setColor('#3b82f6');
        }
        setSubmitting(false);
    };

    const handleDelete = async (labelId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá nhãn này không?')) return;
        await deleteLabel(labelId);
    };

    return (
        <div className="space-y-5">
            <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[1fr_140px_auto] md:items-end">
                    <div className="space-y-2">
                        <Label htmlFor="label-name">Tên nhãn</Label>
                        <Input
                            id="label-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Ví dụ: Backend"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="label-color">Màu</Label>
                        <Input
                            id="label-color"
                            type="color"
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                            className="h-10 w-full cursor-pointer rounded-md border border-slate-200 bg-white p-1"
                        />
                    </div>

                    <Button type="submit" className="gap-2" disabled={submitting || !name.trim()}>
                        <Plus className="h-4 w-4" />
                        {submitting ? 'Đang tạo...' : 'Tạo nhãn'}
                    </Button>
                </div>
            </form>

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải nhãn...</div>
            ) : labels.length ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {labels.map((label) => (
                        <Card key={String(label.id)} className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-4 w-4 rounded-full border border-slate-200"
                                            style={{ backgroundColor: label.color }}
                                        />
                                        <CardTitle className="text-base text-slate-900">{label.name}</CardTitle>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                                        onClick={() => handleDelete(label.id)}
                                        aria-label={`Xoá nhãn ${label.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm text-slate-600">
                                <p>Màu: {label.color}</p>
                                <p>Task đang dùng: {label.taskCount ?? 0}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Chưa có nhãn nào trong dự án.
                </div>
            )}
        </div>
    );
}
