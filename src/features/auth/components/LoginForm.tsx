'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/src/features/auth/hooks/useAuth';

export function LoginForm() {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({
                email: form.email.trim().toLowerCase(),
                password: form.password,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/60">
                <CardHeader className="space-y-2 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Progress Management</p>
                    <CardTitle className="text-3xl">Đăng nhập</CardTitle>
                    <CardDescription>Quản lý dự án, task và tiến độ của bạn</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        {error ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        ) : null}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                            Đăng ký ngay
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
