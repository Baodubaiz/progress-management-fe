'use client';

import Link from 'next/link';
import { ArrowLeft, FolderKanban, PencilLine, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MemberList } from '@/src/features/project/member/components/MemberList';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';

export function ProjectDetailView({ projectId }: { projectId: string }) {
    const { project, loading, error, fetchProjectById, updateProject, deleteProject } = useProjects();
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        void fetchProjectById(projectId);
    }, [fetchProjectById, projectId]);

    useEffect(() => {
        if (project) {
            setForm({
                name: project.name,
                description: project.description ?? '',
            });
        }
    }, [project]);

    const handleSave = async () => {
        if (!project || !form.name.trim()) return;

        setSaving(true);
        await updateProject(project.id, {
            name: form.name.trim(),
            description: form.description.trim() || null,
        });
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!project) return;

        const confirmed = window.confirm('Bạn có chắc muốn xoá dự án này không?');
        if (!confirmed) return;

        setDeleting(true);
        const result = await deleteProject(project.id);
        setDeleting(false);

        if (result) {
            window.location.href = '/projects';
        }
    };

    if (loading && !project) {
        return <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">Đang tải chi tiết dự án...</div>;
    }

    if (!project) {
        return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">{error || 'Không tìm thấy dự án'}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/projects">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                </Link>

                <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={deleting}>
                    <Trash2 className="h-4 w-4" />
                    {deleting ? 'Đang xoá...' : 'Xoá dự án'}
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Project</p>
                                <CardTitle className="mt-2 text-2xl text-slate-900">{project.name}</CardTitle>
                                <CardDescription className="mt-2 text-slate-600">
                                    {project.description || 'Chưa có mô tả cho dự án này.'}
                                </CardDescription>
                            </div>
                            <Badge variant={project.userRole === 'OWNER' ? 'blue' : 'default'}>{project.userRole}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Members</p>
                                <p className="mt-2 text-xl font-bold text-slate-900">{project.members?.length ?? 0}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Boards</p>
                                <p className="mt-2 text-xl font-bold text-slate-900">{project.boards?.length ?? 0}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Labels</p>
                                <p className="mt-2 text-xl font-bold text-slate-900">{project.labels?.length ?? 0}</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Project members</span>
                            </div>
                            <div className="mt-3 space-y-2">
                                {project.members?.map((member) => (
                                    <div key={String(member.user.id)} className="flex items-center justify-between rounded-lg bg-white p-2">
                                        <div>
                                            <p className="font-medium text-slate-900">{member.user.username}</p>
                                            <p className="text-xs text-slate-500">{member.user.email}</p>
                                        </div>
                                        <Badge variant={member.role === 'OWNER' ? 'blue' : 'default'}>{member.role}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                            <PencilLine className="h-4 w-4 text-blue-600" />
                            Sửa thông tin dự án
                        </CardTitle>
                        <CardDescription>Chỉnh sửa tên và mô tả</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project-name">Tên dự án</Label>
                            <Input
                                id="project-name"
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project-description">Mô tả</Label>
                            <textarea
                                id="project-description"
                                value={form.description}
                                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                className="min-h-28 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>

                        <Button className="w-full gap-2" onClick={handleSave} disabled={saving || !form.name.trim()}>
                            <FolderKanban className="h-4 w-4" />
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Boards trong dự án</h3>
                    <Link href={`/projects/${project.id}/boards`}>
                        <Button variant="outline" className="gap-2">
                            Quản lý board
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {project.boards?.length ? (
                        project.boards.map((board) => (
                            <div key={String(board.id)} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-slate-900">{board.name}</p>
                                    <Badge variant="default">{board._count?.columns ?? 0} columns</Badge>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{board.description || 'Không có mô tả'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                            Chưa có board nào trong dự án này.
                        </div>
                    )}
                </div>
            </div>

            <MemberList projectId={projectId} />
        </div>
    );
}
