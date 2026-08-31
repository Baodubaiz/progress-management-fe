'use client';

import { useState } from 'react';
import { Eye, KeyRound, PencilLine, Trash2, UserRound } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/src/features/user/hooks/useUser';

export function UserProfile() {
    const { user, users, loading, error, updateProfile, changePassword, deleteUserById } = useUser();
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleSave = async () => {
        if (!username.trim() || !user?.id) return;

        setSaving(true);
        const result = await updateProfile({ username: username.trim() });
        if (result) {
            setUsername('');
        }
        setSaving(false);
    };

    const handlePasswordChange = async () => {
        if (!user?.id || !currentPassword.trim() || !newPassword.trim()) return;

        setChangingPassword(true);
        await changePassword({ currentPassword: currentPassword.trim(), newPassword: newPassword.trim() });
        setCurrentPassword('');
        setNewPassword('');
        setChangingPassword(false);
    };

    const handleDelete = async () => {
        if (!user?.id) return;

        const confirmed = window.confirm('Bạn chắc chắn muốn xoá tài khoản này?');
        if (!confirmed) return;

        setDeleting(true);
        await deleteUserById(user.id);
        setDeleting(false);
    };

    if (loading && !user) {
        return <div className="p-6 text-slate-600">Đang tải profile...</div>;
    }

    if (!user) {
        return <div className="p-6 text-red-500">{error || 'Không tìm thấy profile'}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                            {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">User profile</p>
                            <h1 className="mt-2 text-2xl font-bold text-slate-900">{user.username}</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="blue">Active</Badge>
                                <span className="text-sm text-slate-500">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={deleting}>
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Đang xoá...' : 'Xoá tài khoản'}
                    </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Ngày tạo</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                                <PencilLine className="h-4 w-4 text-blue-600" />
                                Cập nhật thông tin
                            </CardTitle>
                            <CardDescription>Thay đổi tên hiển thị của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Tên hiển thị</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder={user.username}
                                />
                            </div>

                            <Button className="w-full gap-2" onClick={handleSave} disabled={saving || !username.trim()}>
                                <UserRound className="h-4 w-4" />
                                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                                <KeyRound className="h-4 w-4 text-emerald-600" />
                                Đổi mật khẩu
                            </CardTitle>
                            <CardDescription>Cập nhật mật khẩu hiện tại</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>

                            <Button
                                className="w-full gap-2"
                                variant="outline"
                                onClick={handlePasswordChange}
                                disabled={changingPassword || !currentPassword.trim() || !newPassword.trim()}
                            >
                                <Eye className="h-4 w-4" />
                                {changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Directory</p>
                        <h2 className="mt-2 text-xl font-bold text-slate-900">Danh sách người dùng</h2>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Đang tải người dùng...</div>
                ) : users.length ? (
                    <div className="space-y-3">
                        {users.map((item) => (
                            <div
                                key={String(item.id)}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                        {item.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.username}</p>
                                        <p className="text-sm text-slate-500">{item.email}</p>
                                    </div>
                                </div>

                                <Badge variant={String(item.id) === String(user.id) ? 'green' : 'default'}>
                                    {String(item.id) === String(user.id) ? 'You' : 'Member'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        Chưa có người dùng nào.
                    </div>
                )}
            </div>

            {error ? <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
        </div>
    );
}
