import { apiRequest } from '@/src/lib/api-client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/src/features/auth/types/auth.types';

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async logout(): Promise<void> {
        await apiRequest('/auth/logout', {
            method: 'POST',
        });
    },
};
