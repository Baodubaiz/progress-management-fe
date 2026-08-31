'use client';

import { useEffect, useState } from 'react';
import { PencilLine, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTasks } from '@/src/features/task/hooks/useTasks';

export function TaskList({ columnId }: { columnId: string }) {
    const { tasks, loading, error, fetchTasks, createTask, deleteTask } = useTasks(columnId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchTasks();
    }, [fetchTasks]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        const created = await createTask({
            columnId,
            title: title.trim(),
            description: description.trim() || null,
            priority: 'MEDIUM',
        });

        if (created) {
            setTitle('');
            setDescription('');
        }

        setSubmitting(false);
    };

    const handleDelete = async (taskId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá task này không?')) return;
        await deleteTask(taskId);
    };

    return (
        <div className="space-y-5">
            <form onSubmit={handleCreate} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="task-title">Tên task</Label>
                    <Input
                        id="task-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ví dụ: Hoàn thiện wireframe"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="task-description">Mô tả</Label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="min-h-24 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                        placeholder="Mô tả ngắn cho task..."
                    />
                </div>

                <Button type="submit" className="gap-2" disabled={submitting || !title.trim()}>
                    <Plus className="h-4 w-4" />
                    {submitting ? 'Đang tạo...' : 'Tạo task'}
                </Button>
            </form>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải task...</div>
            ) : tasks.length ? (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <Card key={String(task.id)} className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base text-slate-900">{task.title}</CardTitle>
                                        <CardDescription className="mt-2">{task.description || 'Không có mô tả'}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            task.priority === 'URGENT'
                                                ? 'rose'
                                                : task.priority === 'HIGH'
                                                    ? 'amber'
                                                    : task.priority === 'LOW'
                                                        ? 'green'
                                                        : 'blue'
                                        }>
                                            {task.priority}
                                        </Badge>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                            <PencilLine className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleDelete(task.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm text-slate-600">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span>Assignees: {task.assignees?.length ?? 0}</span>
                                    <span>•</span>
                                    <span>Labels: {task.taskLabels?.length ?? 0}</span>
                                    <span>•</span>
                                    <span>Comments: {task._count?.comments ?? 0}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Chưa có task nào trong cột này.
                </div>
            )}
        </div>
    );
}
