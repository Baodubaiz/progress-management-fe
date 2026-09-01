'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderKanban, PencilLine, Tag, Trash2, Users } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { StatCard } from '@/components/common/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberList } from '@/src/features/project/member/components/MemberList';
import { useProjectDetailPage } from '@/src/features/project/project/hooks/useProjectDetailPage';

import { EditProjectDialog } from './EditProjectDialog';
import { DeleteProjectDialog } from './DeleteProjectDialog';

export function ProjectDetailView({ projectId }: { projectId: string }) {
    const {
        project,
        loading,
        error,
        deleting,
        showEditForm,
        showDeleteDialog,
        activeTab,
        setShowEditForm,
        setShowDeleteDialog,
        setActiveTab,
        handleSaveEdit,
        handleDelete,
        canManageProject,
    } = useProjectDetailPage(projectId);

    if (loading && !project) {
        return (
            <div className="flex h-40 w-full items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    Đang tải chi tiết dự án...
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Trash2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-red-700">Lỗi tải dự án</h3>
                <p className="mt-1 text-sm text-red-600">{error || 'Không tìm thấy dự án'}</p>
                <Link href="/projects" className="mt-5">
                    <Button variant="outline" className="gap-2 font-medium cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách
                    </Button>
                </Link>
            </div>
        );
    }

    const formatRole = (role: string) => {
        if (role === 'OWNER') return 'Chủ sở hữu';
        if (role === 'ADMIN') return 'Quản trị viên';
        return 'Thành viên';
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 mb-3 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách dự án
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project.name}</h1>
                        <Badge variant={project.userRole === 'OWNER' ? 'blue' : 'default'} className="font-semibold">
                            {formatRole(project.userRole)}
                        </Badge>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                        {project.description || 'Chưa có mô tả cho dự án này.'}
                    </p>
                </div>

                {canManageProject && (
                    <div className="flex items-center gap-3">
                        <Button
                            className="gap-2 bg-slate-900 px-4 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow cursor-pointer"
                            onClick={() => setShowEditForm(true)}
                        >
                            <PencilLine className="h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="destructive"
                            className="gap-2 bg-red-600 px-4 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow cursor-pointer"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={deleting}
                        >
                            <Trash2 className="h-4 w-4" />
                            Xoá
                        </Button>
                    </div>
                )}
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Thành viên" value={project.members?.length ?? 0} description="Tổng số người tham gia" icon={<Users className="h-4 w-4" />} tone="blue" />
                <StatCard title="Bảng làm việc" value={project.boards?.length ?? 0} description="Không gian quản lý công việc" icon={<FolderKanban className="h-4 w-4" />} tone="green" />
                <StatCard title="Nhãn phân loại" value={project.labels?.length ?? 0} description="Thẻ phân loại công việc" icon={<Tag className="h-4 w-4" />} tone="violet" />
            </div>

            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('BOARDS')}
                    className={`relative flex cursor-pointer items-center gap-2 pb-3 pt-2 px-1 text-sm font-medium transition-colors ${activeTab === 'BOARDS' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FolderKanban className="h-4 w-4" />
                    Bảng làm việc
                    <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${activeTab === 'BOARDS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {project.boards?.length ?? 0}
                    </span>
                    {activeTab === 'BOARDS' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('MEMBERS')}
                    className={`relative ml-8 flex cursor-pointer items-center gap-2 pb-3 pt-2 px-1 text-sm font-medium transition-colors ${activeTab === 'MEMBERS' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Users className="h-4 w-4" />
                    Thành viên
                    <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${activeTab === 'MEMBERS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {project.members?.length ?? 0}
                    </span>
                    {activeTab === 'MEMBERS' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600" />
                    )}
                </button>
            </div>

            <div className="mt-2">
                {activeTab === 'BOARDS' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Danh sách bảng làm việc</h3>
                            {canManageProject && (
                                <Link href={`/projects/${project.id}/boards`}>
                                    <Button className="gap-2 bg-blue-600 px-4 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow cursor-pointer">
                                        <FolderKanban className="h-4 w-4" />
                                        Quản lý bảng
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {project.boards?.length ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {project.boards.map((board) => (
                                    <Card
                                        key={String(board.id)}
                                        className="group relative flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                                    >
                                        <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />
                                        <CardHeader className="pb-3 pt-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                        <FolderKanban className="h-4 w-4" />
                                                    </div>
                                                    <CardTitle className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {board.name}
                                                    </CardTitle>
                                                </div>
                                                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                                    {board._count?.columns ?? 0} cột
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="mt-auto flex flex-col justify-end pt-0">
                                            <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-slate-500">
                                                {board.description || 'Chưa có mô tả cho board này.'}
                                            </p>

                                            <Link href={`/projects/${project.id}/boards/${board.id}`} className="block w-full">
                                                <Button className="w-full justify-between bg-blue-600 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow cursor-pointer">
                                                    Vào bảng
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                                <FolderKanban className="mb-3 h-8 w-8 text-slate-400" />
                                <h3 className="text-base font-bold text-slate-900">Chưa có bảng nào</h3>
                                <p className="mt-1 max-w-sm text-xs text-slate-500">Tạo bảng đầu tiên để bắt đầu quản lý công việc trong dự án này.</p>
                                {canManageProject && (
                                    <Link href={`/projects/${project.id}/boards`} className="mt-5">
                                        <Button className="bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer">Quản lý bảng</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <MemberList projectId={projectId} />
                    </div>
                )}
            </div>

            <EditProjectDialog
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                initialData={{ name: project.name, description: project.description ?? '' }}
                onSave={handleSaveEdit}
            />

            <DeleteProjectDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                projectName={project.name}
                onConfirm={handleDelete}
                deleting={deleting}
            />
        </div>
    );
}
