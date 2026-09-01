'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/src/features/user/services/user.service';
import type {
    ChangePasswordPayload,
    CreateUserPayload,
    UpdateUserPayload,
    User,
    UsersListResponse,
} from '@/src/features/user/types/user.types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<UsersListResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await userService.getCurrentUser();
            setUser(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải profile');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
        setLoading(true);
        setError('');

        try {
            const result = await userService.getUsers(params);
            setUsers(result.users || []);
            setPagination(result.pagination || null);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách người dùng';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserById = useCallback(async (id: string | number) => {
        setLoading(true);
        setError('');

        try {
            const data = await userService.getUserById(id);
            setUser(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải người dùng';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (payload: CreateUserPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await userService.createUser(payload);
            setUsers((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo người dùng';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (payload: UpdateUserPayload) => {
        if (!user?.id) return null;

        setLoading(true);
        setError('');

        try {
            const updated = await userService.updateUser(user.id, payload);
            setUser(updated);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể cập nhật profile');
            return null;
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
        if (!user?.id) return null;

        setLoading(true);
        setError('');

        try {
            const result = await userService.changePassword(user.id, payload);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể đổi mật khẩu';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const deleteUserById = useCallback(async (id: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await userService.deleteUser(id);
            setUsers((prev) => prev.filter((item) => String(item.id) !== String(id)));
            if (user && String(user.id) === String(id)) {
                setUser(null);
            }
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá người dùng';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    return {
        user,
        users,
        pagination,
        loading,
        error,
        fetchProfile,
        fetchUsers,
        fetchUserById,
        createUser,
        updateProfile,
        changePassword,
        deleteUserById,
    };
}
