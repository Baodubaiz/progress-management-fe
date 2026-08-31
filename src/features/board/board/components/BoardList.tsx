'use client';

import Link from 'next/link';
import { ArrowLeft, Layers3, Plus, KanbanSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/common/badge';
import { EmptyState } from '@/components/common/empty-state';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { SectionHeader } from '@/components/common/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoards } from '@/src/features/board/board/hooks/useBoards';

export function BoardList({ projectId }: { projectId: string }) {
    const { boards, loading, error, fetchBoards, createBoard } = useBoards();
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', description: '', initialColumns: 'To Do, In Progress, Done' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchBoards(projectId, { page: 1, limit: 10, search: search.trim() || undefined });
    }, [fetchBoards, projectId, search]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.name.trim()) return;

        setSubmitting(true);
        const created = await createBoard({
            projectId,
            name: form.name.trim(),
            description: form.description.trim() || null,
            initialColumns: form.initialColumns
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
        });

        if (created) {
            setForm({ name: '', description: '', initialColumns: 'To Do, In Progress, Done' });
        }

        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Boards"
                description="Theo dõi các board kanban của dự án"
                action={
                    <Link href="/projects">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại dự án
                        </Button>
                    </Link>
                }
            />

            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <section className="space-y-4">
                    <SectionHeader
                        title="Danh sách board"
                        description="Mỗi board tương ứng với một luồng làm việc"
                        action={<SearchBar value={search} onChange={setSearch} className="w-full md:w-72" />}
                    />

                    {loading ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải board...</div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
                    ) : boards.length ? (
                        <div className="grid gap-4">
                            {boards.map((board) => (
                                <Card key={board.id} className="border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <CardTitle className="text-xl text-slate-900">{board.name}</CardTitle>
                                                <CardDescription className="mt-2 max-w-2xl">
                                                    {board.description || 'Chưa có mô tả cho board này.'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="blue">Board</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                            <span>Owner: {board.creator?.username || 'Unknown'}</span>
                                            <span>•</span>
                                            <span>{board.columnsCount} columns</span>
                                            <span>•</span>
                                            <span>{board.tasksCount} tasks</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Chưa có board nào"
                            description="Tạo board đầu tiên để bắt đầu phân công task và theo dõi tiến độ."
                            action={<Button type="button">Tạo board</Button>}
                            icon={<KanbanSquare className="h-5 w-5" />}
                        />
                    )}
                </section>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Tạo board mới</CardTitle>
                        <CardDescription>Thiết lập luồng làm việc cho dự án</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="board-name">Tên board</Label>
                                <Input
                                    id="board-name"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    placeholder="Ví dụ: Sprint 1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="board-description">Mô tả</Label>
                                <textarea
                                    id="board-description"
                                    value={form.description}
                                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                    placeholder="Mô tả ngắn về board..."
                                    className="min-h-28 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="board-columns">Columns mặc định</Label>
                                <Input
                                    id="board-columns"
                                    value={form.initialColumns}
                                    onChange={(event) => setForm((prev) => ({ ...prev, initialColumns: event.target.value }))}
                                    placeholder="To Do, In Progress, Done"
                                />
                            </div>

                            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

                            <Button type="submit" className="w-full gap-2" disabled={submitting || !form.name.trim()}>
                                <Plus className="h-4 w-4" />
                                {submitting ? 'Đang tạo...' : 'Tạo board'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
