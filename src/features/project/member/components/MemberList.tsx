'use client';

import { useEffect, useState } from 'react';
import { UserPlus, ShieldCheck, Trash2 } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMembers } from '@/src/features/project/member/hooks/useMembers';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { useToast } from '@/src/providers/toast-context';

export function MemberList({ projectId }: { projectId: string | number }) {
    const { members, loading, error, fetchMembers, addMember, updateMemberRole, removeMember } = useMembers(projectId);
    const { project, fetchProjectById } = useProjects();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'OWNER' | 'MEMBER'>('MEMBER');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchMembers();
        void fetchProjectById(String(projectId));
    }, [fetchMembers, fetchProjectById, projectId]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    const handleAddMember = async () => {
        if (!email.trim()) return;
        setSubmitting(true);
        const result = await addMember({ email: email.trim(), role });
        setSubmitting(false);
        if (result) {
            setEmail('');
            setRole('MEMBER');
        }
    };

    const handleUpdateRole = async (userId: string | number, nextRole: 'OWNER' | 'MEMBER') => {
        await updateMemberRole(userId, { role: nextRole });
    };

    const handleRemoveMember = async (userId: string | number) => {
        const confirmed = window.confirm('Bạn có chắc muốn xoá thành viên này khỏi dự án?');
        if (!confirmed) return;
        await removeMember(userId);
    };

    return (
        <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    Thành viên dự án
                </CardTitle>
                <CardDescription>Quản lý thành viên và phân quyền truy cập trong dự án</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {project?.userRole === 'OWNER' && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto] md:items-end">
                            <div className="space-y-2">
                                <Label htmlFor="member-email">Email thành viên</Label>
                                <Input
                                    id="member-email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="nhanvien@example.com"
                                    className="h-10 transition-colors focus-visible:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="member-role">Vai trò</Label>
                                <select
                                    id="member-role"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value as 'OWNER' | 'MEMBER')}
                                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="MEMBER">Thành viên</option>
                                    <option value="OWNER">Chủ sở hữu</option>
                                </select>
                            </div>

                            <Button
                                onClick={handleAddMember}
                                disabled={submitting || !email.trim()}
                                className="gap-2 bg-blue-600 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 cursor-pointer"
                            >
                                <UserPlus className="h-4 w-4" />
                                {submitting ? 'Đang thêm...' : 'Thêm thành viên'}
                            </Button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Đang tải danh sách thành viên...</div>
                ) : members.length ? (
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div key={String(member.user.id)} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                        {member.user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{member.user.username}</p>
                                        <p className="text-xs text-slate-500">{member.user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={member.role === 'OWNER' ? 'blue' : 'default'} className="font-semibold">
                                        {member.role === 'OWNER' ? 'Chủ sở hữu' : 'Thành viên'}
                                    </Badge>

                                    {project?.userRole === 'OWNER' && (
                                        <>
                                            {member.role === 'OWNER' ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                                    onClick={() => handleUpdateRole(member.user.id, 'MEMBER')}
                                                >
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    Hạ quyền
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-pointer"
                                                    onClick={() => handleUpdateRole(member.user.id, 'OWNER')}
                                                >
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    Thăng quyền
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="gap-1 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                                onClick={() => handleRemoveMember(member.user.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Xoá
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        Chưa có thành viên nào trong dự án.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
