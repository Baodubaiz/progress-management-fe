'use client';

import { useCallback, useEffect, useState } from 'react';

import { useProjects } from '@/src/features/project/project/hooks/useProjects';

export function useProjectDetailPage(projectId: string) {
    const { project, loading, error, fetchProjectById, updateProject, deleteProject } = useProjects();
    const [deleting, setDeleting] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [activeTab, setActiveTab] = useState<'BOARDS' | 'MEMBERS'>('BOARDS');

    useEffect(() => {
        void fetchProjectById(projectId);
    }, [fetchProjectById, projectId]);

    const handleSaveEdit = useCallback(async (data: { name: string; description: string }) => {
        if (!project) return;
        await updateProject(project.id, {
            name: data.name,
            description: data.description || null,
        });
        setShowEditForm(false);
    }, [project, updateProject]);

    const handleDelete = useCallback(async () => {
        if (!project) return;
        setDeleting(true);
        const result = await deleteProject(project.id);
        setDeleting(false);

        if (result) {
            window.location.href = '/projects';
        }
    }, [deleteProject, project]);

    const canManageProject = project?.userRole === 'OWNER';

    return {
        project,
        loading,
        error,
        deleting,
        showEditForm,
        showDeleteDialog,
        activeTab,
        setShowEditForm,
        setShowDeleteDialog,
        setActiveTab,
        handleSaveEdit,
        handleDelete,
        canManageProject,
    };
}
