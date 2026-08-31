'use client';

import { useCallback, useState } from 'react';

import { memberService } from '@/src/features/project/member/services/member.service';
import type { AddMemberPayload, ProjectMember, UpdateMemberRolePayload } from '@/src/features/project/member/types/member.types';

export function useMembers(projectId: string | number) {
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await memberService.getMembers(projectId);
            setMembers(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách thành viên';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const addMember = useCallback(async (payload: AddMemberPayload) => {
        setLoading(true);
        setError('');

        try {
            const member = await memberService.addMember(projectId, payload);
            setMembers((prev) => [member, ...prev]);
            return member;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể thêm thành viên';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const updateMemberRole = useCallback(async (userId: string | number, payload: UpdateMemberRolePayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await memberService.updateMemberRole(projectId, userId, payload);
            setMembers((prev) => prev.map((member) => String(member.user.id) === String(userId) ? {
                ...member,
                role: updated.role,
            } : member));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật quyền thành viên';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const removeMember = useCallback(async (userId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await memberService.removeMember(projectId, userId);
            setMembers((prev) => prev.filter((member) => String(member.user.id) !== String(userId)));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá thành viên';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    return {
        members,
        loading,
        error,
        fetchMembers,
        addMember,
        updateMemberRole,
        removeMember,
    };
}
