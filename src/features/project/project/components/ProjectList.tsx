'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Crown, FolderKanban, Plus, Search, UserRound } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { useToast } from '@/src/providers/toast-context';
import { CreateProjectDialog } from './CreateProjectDialog';

type TabType = 'OWNED' | 'JOINED';

export function ProjectList() {
    const { projects, loading, error, fetchProjects, createProject } = useProjects();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('OWNED');

    useEffect(() => {
        const timeout = setTimeout(() => {
            void fetchProjects({ page: 1, limit: 50, search: search.trim() || undefined });
        }, 300);
        return () => clearTimeout(timeout);
    }, [fetchProjects, search]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    const groupedProjects = useMemo(() => {
        const owned = projects.filter((project) => project.userRole === 'OWNER' || project.userRole === 'ADMIN');
        const joined = projects.filter((project) => project.userRole === 'MEMBER');

        return { owned, joined };
    }, [projects]);

    const handleCreateSubmit = async (data: { name: string; description: string }) => {
        const created = await createProject(data);
        if (created) {
            setShowCreateForm(false);
            return true;
        }
        return false;
    };

    const displayProjects = activeTab === 'OWNED' ? groupedProjects.owned : groupedProjects.joined;

    return (
        <div className="w-full space-y-6 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dự án</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Quản lý dự án của bạn và các dự án bạn tham gia
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm dự án..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 pl-9 transition-colors focus-visible:ring-blue-500"
                        />
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        className="h-10 shrink-0 gap-2 bg-blue-600 px-4 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Tạo dự án
                    </Button>
                </div>
            </div>

            <CreateProjectDialog
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onSubmit={handleCreateSubmit}
            />

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('OWNED')}
                    className={`relative flex cursor-pointer items-center gap-2 pb-3 pt-2 px-1 text-sm font-medium transition-colors ${
                        activeTab === 'OWNED' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Crown className="h-4 w-4" />
                    Dự án của tôi
                    <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        activeTab === 'OWNED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {groupedProjects.owned.length}
                    </span>
                    {activeTab === 'OWNED' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('JOINED')}
                    className={`relative ml-8 flex cursor-pointer items-center gap-2 pb-3 pt-2 px-1 text-sm font-medium transition-colors ${
                        activeTab === 'JOINED' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <UserRound className="h-4 w-4" />
                    Đang tham gia
                    <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        activeTab === 'JOINED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {groupedProjects.joined.length}
                    </span>
                    {activeTab === 'JOINED' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div>
                {loading ? (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            Đang tải danh sách dự án...
                        </div>
                    </div>
                ) : displayProjects.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {displayProjects.map((project) => (
                            <Card 
                                key={project.id} 
                                className="group relative flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

                                <CardHeader className="flex-none pb-3 pt-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <CardTitle className="line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {project.name}
                                        </CardTitle>
                                        <Badge variant={project.userRole === 'OWNER' ? 'blue' : 'default'} className="shrink-0 font-semibold">
                                            {project.userRole}
                                        </Badge>
                                    </div>
                                    <CardDescription className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-slate-500">
                                        {project.description || 'Chưa có mô tả cho dự án này.'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="mt-auto flex flex-col justify-end pt-0">
                                    <div className="mb-4 flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                                                {project.creator?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="truncate">Tạo bởi <b className="text-slate-800">{project.creator?.username || 'Unknown'}</b></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="flex items-center gap-1.5">
                                                <UserRound className="h-3.5 w-3.5 text-slate-400" />
                                                {project.membersCount} thành viên
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                                                {project.boardsCount} bảng
                                            </span>
                                        </div>
                                    </div>

                                    {/* High Contrast Solid Blue Button */}
                                    <Link href={`/projects/${project.id}`} className="block w-full">
                                        <Button 
                                            className="w-full justify-between bg-blue-600 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow cursor-pointer"
                                        >
                                            Vào dự án
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={activeTab === 'OWNED' ? "Chưa có dự án nào của bạn" : "Bạn chưa tham gia dự án nào"}
                        description={activeTab === 'OWNED'
                            ? "Tạo workspace đầu tiên để bắt đầu quản lý task và tiến độ dự án."
                            : "Bạn sẽ thấy các dự án được mời ở đây khi có thành viên cộng tác."}
                        icon={activeTab === 'OWNED' ? <FolderKanban className="h-6 w-6" /> : <UserRound className="h-6 w-6" />}
                    />
                )}
            </div>
        </div>
    );
}
