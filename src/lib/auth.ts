import type { AuthResponse } from '@/src/features/auth/types/auth.types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export function getStoredAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

export function getStoredRefreshToken() {
    return null;
}

export function saveAuthState(data: AuthResponse) {
    if (typeof window === 'undefined') return;

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearAuthState() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
}


export function getStoredUser() {
    if (typeof window === 'undefined') return null;

    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}
