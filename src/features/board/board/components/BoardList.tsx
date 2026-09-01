'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, KanbanSquare, LayoutGrid, Search, Columns3, ListTodo, User, CalendarDays, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoards } from '@/src/features/board/board/hooks/useBoards';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { useToast } from '@/src/providers/toast-context';

export function BoardList({ projectId }: { projectId: string }) {
    const { boards, loading, error, fetchBoards, createBoard } = useBoards();
    const { project, fetchProjectById } = useProjects();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', description: '', initialColumns: 'To Do, In Progress, Done' });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        void fetchBoards(projectId, { page: 1, limit: 50, search: search.trim() || undefined });
        void fetchProjectById(projectId);
    }, [fetchBoards, fetchProjectById, projectId, search]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    useEffect(() => {
        if (showForm) setTimeout(() => nameInputRef.current?.focus(), 50);
    }, [showForm]);

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
            setShowForm(false);
            showToast('Đã tạo board thành công!', 'success');
        }

        setSubmitting(false);
    };

    const isOwner = project?.userRole === 'OWNER';

    const filteredBoards = search.trim()
        ? boards.filter((b) => b.name.toLowerCase().includes(search.trim().toLowerCase()))
        : boards;

    return (
        <div className="min-h-screen bg-slate-50/40 px-4 py-6 sm:px-6">
            {/* Top Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/projects">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Dự án
                        </Button>
                    </Link>
                    <span className="text-slate-300">/</span>
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Quản lý Bảng làm việc</h1>
                            {project?.name && (
                                <p className="mt-0.5 text-xs text-slate-500">Dự án: <span className="font-semibold text-slate-700">{project.name}</span></p>
                            )}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <Button
                        type="button"
                        onClick={() => setShowForm((v) => !v)}
                        className="gap-2 bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        {showForm ? 'Đóng form' : 'Tạo bảng mới'}
                    </Button>
                )}
            </div>

            {/* Create Form */}
            {isOwner && showForm && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="rounded-2xl border border-blue-200/80 bg-white p-6 shadow-md">
                        <div className="mb-5 flex items-center gap-2">
                            <KanbanSquare className="h-5 w-5 text-blue-600" />
                            <h2 className="text-base font-bold text-slate-900">Tạo bảng làm việc mới</h2>
                        </div>

                        <form onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="board-name" className="text-xs font-semibold text-slate-700">
                                    Tên bảng <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    ref={nameInputRef}
                                    id="board-name"
                                    value={form.name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ví dụ: Sprint 1, Phát triển tính năng..."
                                    className="h-10 text-sm font-medium text-slate-900 bg-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="board-columns" className="text-xs font-semibold text-slate-700">
                                    Cột mặc định
                                </Label>
                                <Input
                                    id="board-columns"
                                    value={form.initialColumns}
                                    onChange={(e) => setForm((prev) => ({ ...prev, initialColumns: e.target.value }))}
                                    placeholder="To Do, In Progress, Done"
                                    className="h-10 text-sm font-medium text-slate-900 bg-white"
                                />
                                <p className="text-[11px] text-slate-400">Phân cách bằng dấu phẩy</p>
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="board-description" className="text-xs font-semibold text-slate-700">
                                    Mô tả <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                                </Label>
                                <textarea
                                    id="board-description"
                                    value={form.description}
                                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả ngắn về mục đích của bảng làm việc này..."
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 sm:col-span-2 border-t border-slate-100 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting || !form.name.trim()}
                                    className="gap-2 px-6 bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    {submitting ? 'Đang tạo...' : 'Tạo bảng'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search + Count */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-sm font-bold text-slate-700">
                        Danh sách bảng
                        {!loading && <span className="ml-2 text-xs font-normal text-slate-400">({filteredBoards.length} bảng)</span>}
                    </h2>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm bảng..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Board Grid */}
            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-2xl border border-slate-200 bg-white animate-pulse" />
                    ))}
                </div>
            ) : filteredBoards.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredBoards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/projects/${projectId}/boards/${board.id}`}
                            className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        >
                            {/* Board Card Header */}
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                                    <KanbanSquare className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 mt-1 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                            </div>

                            {/* Board Name */}
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mb-1">
                                {board.name}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed min-h-[2.5rem]">
                                {board.description || 'Chưa có mô tả cho bảng này.'}
                            </p>

                            {/* Stats */}
                            <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Columns3 className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{board.columnsCount ?? 0} cột</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ListTodo className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{board.tasksCount ?? 0} thẻ</span>
                                </div>
                                {board.creator?.username && (
                                    <div className="flex items-center gap-1 ml-auto">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{board.creator.username}</span>
                                    </div>
                                )}
                            </div>

                            {/* Created date */}
                            {board.createdAt && (
                                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                                    <CalendarDays className="h-3 w-3" />
                                    <span>Tạo {new Date(board.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <KanbanSquare className="h-7 w-7 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-700">
                            {search ? 'Không tìm thấy bảng phù hợp' : 'Chưa có bảng làm việc nào'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {search ? 'Thử tìm với từ khóa khác.' : 'Tạo bảng đầu tiên để bắt đầu quản lý công việc.'}
                        </p>
                    </div>
                    {isOwner && !search && (
                        <Button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="gap-2 bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo bảng đầu tiên
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
