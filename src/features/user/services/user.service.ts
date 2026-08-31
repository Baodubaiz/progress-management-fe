import { apiRequest } from '@/src/lib/api-client';
import type {
    ChangePasswordPayload,
    CreateUserPayload,
    UpdateUserPayload,
    User,
    UsersListResponse,
} from '@/src/features/user/types/user.types';

export const userService = {
    async getCurrentUser(): Promise<User> {
        return apiRequest<User>('/users/me', { method: 'GET' });
    },

    async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<UsersListResponse> {
        const query = new URLSearchParams();

        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.search) query.set('search', params.search);

        const suffix = query.toString() ? `?${query.toString()}` : '';

        const result = await apiRequest<{ data?: User[]; meta?: UsersListResponse['pagination']; users?: User[]; pagination?: UsersListResponse['pagination'] }>(`/users${suffix}`, {
            method: 'GET',
        });

        const users = Array.isArray(result?.users)
            ? result.users
            : Array.isArray(result?.data)
                ? result.data
                : [];

        return {
            users,
            pagination: result?.pagination || result?.meta || {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
        };
    },

    async getUserById(id: string | number): Promise<User> {
        return apiRequest<User>(`/users/${id}`, { method: 'GET' });
    },

    async createUser(payload: CreateUserPayload): Promise<User> {
        return apiRequest<User>('/users', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async updateUser(id: string | number, payload: UpdateUserPayload): Promise<User> {
        return apiRequest<User>(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async changePassword(id: string | number, payload: ChangePasswordPayload): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/users/${id}/change-password`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteUser(id: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
    },
};
