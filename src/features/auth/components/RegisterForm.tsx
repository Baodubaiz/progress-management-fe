'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useToast } from '@/src/providers/toast-context';

export function RegisterForm() {
    const { register } = useAuth();
    const { showToast } = useToast();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            await register({
                username: form.username.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/60">
                <CardHeader className="space-y-2 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Progress Management</p>
                    <CardTitle className="text-3xl">Đăng ký</CardTitle>
                    <CardDescription>Tạo tài khoản mới để bắt đầu quản lý dự án</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên người dùng</Label>
                            <Input
                                id="username"
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                                placeholder="nguyenvana"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="••••••••"
                                required
                            />
                        </div>


                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Đăng nhập
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
