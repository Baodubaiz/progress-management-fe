'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useColumns } from '@/src/features/board/column/hooks/useColumns';

export function ColumnList({ boardId, projectId }: { boardId: string; projectId: string }) {
    const { columns, loading, error, fetchColumns, createColumn, deleteColumn } = useColumns(boardId);
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchColumns();
    }, [fetchColumns]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        const created = await createColumn({ boardId, name: name.trim() });
        if (created) {
            setName('');
        }
        setSubmitting(false);
    };

    const handleDelete = async (columnId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá cột này không?')) return;
        await deleteColumn(columnId);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Board</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">Quản lý cột</h2>
                </div>

                <form onSubmit={handleCreate} className="flex w-full max-w-md items-center gap-2">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="new-column" className="sr-only">Tên cột mới</Label>
                        <Input
                            id="new-column"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Tên cột mới..."
                        />
                    </div>
                    <Button type="submit" className="gap-2" disabled={submitting || !name.trim()}>
                        <Plus className="h-4 w-4" />
                        {submitting ? 'Đang thêm...' : 'Thêm'}
                    </Button>
                </form>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
            ) : null}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải cột...</div>
            ) : columns.length ? (
                <div className="grid gap-4 xl:grid-cols-3">
                    {columns.map((column) => (
                        <Card key={String(column.id)} className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-slate-400" />
                                        <CardTitle className="text-lg text-slate-900">{column.name}</CardTitle>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                                        onClick={() => handleDelete(column.id)}
                                        aria-label={`Xoá cột ${column.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <CardDescription>
                                    {column._count?.tasks ?? 0} task đang ở cột này
                                </CardDescription>

                                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                    <p>Project ID: {projectId}</p>
                                    <p>Board ID: {boardId}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Chưa có cột nào trong board này.
                </div>
            )}
        </div>
    );
}
