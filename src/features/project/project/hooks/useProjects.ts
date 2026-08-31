'use client';

import { useCallback, useState } from 'react';

import { projectService } from '@/src/features/project/project/services/project.service';
import type {
    CreateProjectPayload,
    ProjectDetail,
    ProjectListItem,
    ProjectListResponse,
    UpdateProjectPayload,
} from '@/src/features/project/project/types/project.types';

export function useProjects() {
    const [projects, setProjects] = useState<ProjectListItem[]>([]);
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [pagination, setPagination] = useState<ProjectListResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProjects = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
        setLoading(true);
        setError('');

        try {
            const result = await projectService.getProjects(params);
            setProjects(result.projects || []);
            setPagination(result.pagination || null);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách dự án';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProjectById = useCallback(async (projectId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const data = await projectService.getProjectById(projectId);
            setProject(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải chi tiết dự án';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (payload: CreateProjectPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await projectService.createProject(payload);
            setProjects((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo dự án';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (projectId: string | number, payload: UpdateProjectPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await projectService.updateProject(projectId, payload);
            setProject(updated);
            setProjects((prev) => prev.map((item) => String(item.id) === String(projectId) ? {
                ...item,
                name: updated.name,
                description: updated.description ?? null,
                updatedAt: updated.updatedAt,
            } : item));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật dự án';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProject = useCallback(async (projectId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await projectService.deleteProject(projectId);
            setProjects((prev) => prev.filter((item) => String(item.id) !== String(projectId)));
            if (project && String(project.id) === String(projectId)) {
                setProject(null);
            }
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá dự án';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [project]);

    return {
        projects,
        project,
        pagination,
        loading,
        error,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
    };
}
