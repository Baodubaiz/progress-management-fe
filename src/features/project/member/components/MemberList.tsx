'use client';

import { useEffect, useState } from 'react';
import { UserPlus, ShieldCheck, Trash2 } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMembers } from '@/src/features/project/member/hooks/useMembers';

export function MemberList({ projectId }: { projectId: string | number }) {
    const { members, loading, error, fetchMembers, addMember, updateMemberRole, removeMember } = useMembers(projectId);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'OWNER' | 'MEMBER'>('MEMBER');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchMembers();
    }, [fetchMembers]);

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
                    Members
                </CardTitle>
                <CardDescription>Quản lý thành viên và quyền truy cập dự án</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto] md:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="member-email">Email thành viên</Label>
                            <Input
                                id="member-email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="member@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="member-role">Vai trò</Label>
                            <select
                                id="member-role"
                                value={role}
                                onChange={(event) => setRole(event.target.value as 'OWNER' | 'MEMBER')}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                            >
                                <option value="MEMBER">MEMBER</option>
                                <option value="OWNER">OWNER</option>
                            </select>
                        </div>

                        <Button onClick={handleAddMember} disabled={submitting || !email.trim()} className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            {submitting ? 'Đang thêm...' : 'Thêm'}
                        </Button>
                    </div>
                </div>

                {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Đang tải thành viên...</div>
                ) : members.length ? (
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div key={String(member.user.id)} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{member.user.username}</p>
                                    <p className="text-xs text-slate-500">{member.user.email}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={member.role === 'OWNER' ? 'blue' : 'default'}>{member.role}</Badge>

                                    {member.role === 'OWNER' ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                            onClick={() => handleUpdateRole(member.user.id, 'MEMBER')}
                                        >
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Demote
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                            onClick={() => handleUpdateRole(member.user.id, 'OWNER')}
                                        >
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Promote
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => handleRemoveMember(member.user.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                        Chưa có thành viên nào trong dự án.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
