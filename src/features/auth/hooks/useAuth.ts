'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/src/features/auth/services/auth.service';
import { clearAuthState, saveAuthState } from '@/src/lib/auth';
import type { LoginPayload, RegisterPayload } from '@/src/features/auth/types/auth.types';

export function useAuth() {
    const router = useRouter();

    const login = async (payload: LoginPayload) => {
        const data = await authService.login(payload);
        saveAuthState(data);
        router.push('/projects');
        return data;
    };

    const register = async (payload: RegisterPayload) => {
        const data = await authService.register(payload);
        saveAuthState(data);
        router.push('/projects');
        return data;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            clearAuthState();
            router.push('/login');
        }
    };

    return { login, register, logout };
}
