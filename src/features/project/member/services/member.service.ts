import { apiRequest } from '@/src/lib/api-client';
import type { AddMemberPayload, ProjectMember, UpdateMemberRolePayload } from '@/src/features/project/member/types/member.types';

export const memberService = {
    async getMembers(projectId: string | number): Promise<ProjectMember[]> {
        return apiRequest<ProjectMember[]>(`/projects/${projectId}/members`, { method: 'GET' });
    },

    async addMember(projectId: string | number, payload: AddMemberPayload): Promise<ProjectMember> {
        return apiRequest<ProjectMember>(`/projects/${projectId}/members`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async updateMemberRole(
        projectId: string | number,
        userId: string | number,
        payload: UpdateMemberRolePayload,
    ): Promise<ProjectMember> {
        return apiRequest<ProjectMember>(`/projects/${projectId}/members/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async removeMember(projectId: string | number, userId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/projects/${projectId}/members/${userId}`, {
            method: 'DELETE',
        });
    },
};
