'use client';

import { useState } from 'react';
import { Key, LogOut, User, CheckCircle2, AlertCircle, Mail, Calendar, ShieldCheck, Save } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUser } from '@/src/features/user/hooks/useUser';

type ToastItem = {
    id: number;
    message: string;
    type: 'success' | 'error';
};

export function UserProfile() {
    const { user, loading, error, updateProfile, changePassword } = useUser();
    const { logout } = useAuth();
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        window.setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const handleSave = async () => {
        if (!username.trim() || !user?.id) return;

        setSaving(true);
        const result = await updateProfile({ username: username.trim() });
        if (result) {
            setUsername('');
            showToast('Cập nhật thông tin thành công!', 'success');
        }
        setSaving(false);
    };

    const handlePasswordChange = async () => {
        if (!user?.id) {
            showToast('Không tìm thấy thông tin người dùng.', 'error');
            return;
        }

        if (!currentPassword.trim()) {
            showToast('Vui lòng nhập mật khẩu hiện tại.', 'error');
            return;
        }

        if (!newPassword.trim()) {
            showToast('Vui lòng nhập mật khẩu mới.', 'error');
            return;
        }

        if (!confirmPassword.trim()) {
            showToast('Vui lòng xác nhận lại mật khẩu mới.', 'error');
            return;
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            showToast('Mật khẩu mới và xác nhận lại mật khẩu không khớp.', 'error');
            return;
        }

        if (newPassword.trim() === currentPassword.trim()) {
            showToast('Mật khẩu mới phải khác mật khẩu hiện tại.', 'error');
            return;
        }

        setChangingPassword(true);
        const result = await changePassword({ currentPassword: currentPassword.trim(), newPassword: newPassword.trim() });

        if (result) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast('Đổi mật khẩu thành công.', 'success');
        } else {
            showToast('Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.', 'error');
        }

        setChangingPassword(false);
    };

    if (loading && !user) {
        return (
            <div className="flex h-48 w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                <div className="flex items-center gap-3 text-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
                    <span>Đang tải thông tin cá nhân...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
                <AlertCircle className="mb-2 h-6 w-6 text-red-500" />
                <p className="text-sm font-semibold">{error || 'Không tìm thấy thông tin profile'}</p>
            </div>
        );
    }

    const userInitial = user.username?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Toast Notifications */}
            <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition-all ${toast.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                ))}
            </div>

            {/* Profile Header Block */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105">
                        {userInitial}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{user.username}</h1>
                            <Badge variant="blue" className="shrink-0">Active</Badge>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full gap-2 border-slate-200 text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto"
                    onClick={() => void logout()}
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">Email liên hệ</p>
                        <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
                    </div>
                </div>


                <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Ngày tham gia</p>
                        <p className="text-sm font-medium text-slate-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Action Forms Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Update Profile Form */}
                <Card className="border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            <User className="h-4 w-4 text-blue-600" />
                            Cập nhật thông tin
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">Thay đổi tên hiển thị của bạn trên hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-medium text-slate-700">Tên hiển thị mới</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder={user.username}
                                className="h-10 transition-colors focus-visible:ring-blue-500"
                            />
                        </div>

                        <Button
                            className="w-full gap-2 bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-500 hover:shadow-md disabled:opacity-70"
                            onClick={handleSave}
                            disabled={saving || !username.trim()}
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Change Password Form */}
                <Card className="border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            <Key className="h-4 w-4 text-slate-700" />
                            Đổi mật khẩu
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-xs font-medium text-slate-700">Mật khẩu hiện tại</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                placeholder="Nhập mật khẩu hiện tại"
                                className="h-10 text-sm transition-colors focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-xs font-medium text-slate-700">Mật khẩu mới</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                className="h-10 text-sm transition-colors focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-700">Xác nhận lại mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="h-10 text-sm transition-colors focus-visible:ring-blue-500"
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full gap-2 border-slate-200 text-slate-800 transition-all hover:bg-slate-50 disabled:opacity-70"
                            onClick={handlePasswordChange}
                            disabled={changingPassword || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
                        >
                            <Key className="h-4 w-4" />
                            {changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
