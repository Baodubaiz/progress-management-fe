import { apiRequest } from '@/src/lib/api-client';
import type {
    CreateProjectPayload,
    ProjectDetail,
    ProjectListItem,
    ProjectListResponse,
    UpdateProjectPayload,
} from '@/src/features/project/project/types/project.types';

export const projectService = {
    async getProjects(params?: { page?: number; limit?: number; search?: string }): Promise<ProjectListResponse> {
        const query = new URLSearchParams();

        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.search) query.set('search', params.search);

        const suffix = query.toString() ? `?${query.toString()}` : '';
        return apiRequest<ProjectListResponse>(`/projects${suffix}`, { method: 'GET' });
    },

    async getProjectById(projectId: string | number): Promise<ProjectDetail> {
        return apiRequest<ProjectDetail>(`/projects/${projectId}`, { method: 'GET' });
    },

    async createProject(payload: CreateProjectPayload): Promise<ProjectListItem> {
        return apiRequest<ProjectListItem>('/projects', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async updateProject(projectId: string | number, payload: UpdateProjectPayload): Promise<ProjectDetail> {
        return apiRequest<ProjectDetail>(`/projects/${projectId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteProject(projectId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/projects/${projectId}`, { method: 'DELETE' });
    },
};
