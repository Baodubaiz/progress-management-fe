'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FolderKanban, Plus, Users, BriefcaseBusiness, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { EmptyState } from '@/components/common/empty-state';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { SectionHeader } from '@/components/common/section-header';
import { StatCard } from '@/components/common/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';

export function ProjectList() {
    const { projects, loading, error, fetchProjects, createProject } = useProjects();
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchProjects({ page: 1, limit: 10, search: search.trim() || undefined });
    }, [fetchProjects, search]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.name.trim()) return;

        setSubmitting(true);
        const created = await createProject({
            name: form.name.trim(),
            description: form.description.trim() || null,
        });

        if (created) {
            setForm({ name: '', description: '' });
        }

        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects"
                description="Quản lý dự án, thành viên và tiến độ công việc"
                action={
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New project
                    </Button>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total projects" value={projects.length} description="Tổng số dự án" icon={<FolderKanban className="h-4 w-4" />} tone="blue" />
                <StatCard title="Members" value={projects.reduce((sum, project) => sum + Number(project.membersCount || 0), 0)} description="Thành viên toàn bộ" icon={<Users className="h-4 w-4" />} tone="green" />
                <StatCard title="Boards" value={projects.reduce((sum, project) => sum + Number(project.boardsCount || 0), 0)} description="Số board" icon={<BriefcaseBusiness className="h-4 w-4" />} tone="violet" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <section className="space-y-4">
                    <SectionHeader
                        title="Danh sách dự án"
                        description="Tất cả các workspace bạn đang tham gia"
                        action={<SearchBar value={search} onChange={setSearch} className="w-full md:w-72" />}
                    />

                    {loading ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải dự án...</div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
                    ) : projects.length ? (
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <Card key={project.id} className="border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <CardTitle className="text-xl text-slate-900">{project.name}</CardTitle>
                                                <CardDescription className="mt-2 max-w-2xl">
                                                    {project.description || 'Chưa có mô tả cho dự án này.'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={project.userRole === 'OWNER' ? 'blue' : 'default'}>{project.userRole}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                            <span>Owner: {project.creator?.username || 'Unknown'}</span>
                                            <span>•</span>
                                            <span>{project.membersCount} members</span>
                                            <span>•</span>
                                            <span>{project.boardsCount} boards</span>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <Link href={`/projects/${project.id}`}>
                                                <Button variant="outline" className="gap-2">
                                                    Open project
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Chưa có dự án nào"
                            description="Tạo workspace đầu tiên để bắt đầu quản lý task và tiến độ dự án."
                            action={<Button type="button">Tạo dự án</Button>}
                            icon={<FolderKanban className="h-5 w-5" />}
                        />
                    )}
                </section>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Tạo dự án mới</CardTitle>
                        <CardDescription>Thiết lập workspace cho team của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="project-name">Tên dự án</Label>
                                <Input
                                    id="project-name"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    placeholder="Ví dụ: Website renewal"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project-description">Mô tả</Label>
                                <textarea
                                    id="project-description"
                                    value={form.description}
                                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                    placeholder="Mô tả ngắn về mục tiêu dự án..."
                                    className="min-h-28 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                                />
                            </div>

                            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

                            <Button type="submit" className="w-full gap-2" disabled={submitting || !form.name.trim()}>
                                <Plus className="h-4 w-4" />
                                {submitting ? 'Đang tạo...' : 'Tạo dự án'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
