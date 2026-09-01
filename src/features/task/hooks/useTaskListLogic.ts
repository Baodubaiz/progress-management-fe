'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLabels } from '@/src/features/label/hooks/useLabels';
import { useMembers } from '@/src/features/project/member/hooks/useMembers';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { useTasks } from '@/src/features/task/hooks/useTasks';
import { taskService } from '@/src/features/task/services/task.service';
import { useToast } from '@/src/providers/toast-context';
import type { TaskListItem, UpdateTaskPayload } from '@/src/features/task/types/task.types';

export function useTaskListLogic({
    columnId,
    projectId,
    controlledTasks,
    onMoveTask,
    onTaskUpdated,
}: {
    columnId: string;
    projectId?: string;
    controlledTasks?: TaskListItem[];
    onMoveTask?: (
        sourceColumnId: string | number,
        taskId: string | number,
        targetColumnId: string | number,
        prevPosition?: string | number | null,
        nextPosition?: string | number | null,
    ) => Promise<unknown> | unknown;
    onTaskUpdated?: (taskId: string | number, updatedTask: Partial<TaskListItem>) => void;
}) {
    const { tasks: fetchedTasks, loading, error, fetchTasks, createTask, deleteTask, moveTask, updateTask } = useTasks(columnId);
    const { labels, fetchLabels, createLabel, updateLabel, deleteLabel } = useLabels(projectId ?? columnId);
    const { members, fetchMembers } = useMembers(projectId ?? columnId);
    const { project, fetchProjectById } = useProjects();
    const { showToast } = useToast();

    useEffect(() => {
        if (!controlledTasks) {
            void fetchTasks();
        }
    }, [controlledTasks, fetchTasks]);

    useEffect(() => {
        if (projectId) {
            void fetchLabels();
            void fetchMembers();
            void fetchProjectById(projectId);
        }
    }, [projectId, fetchLabels, fetchMembers, fetchProjectById]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    const tasks = controlledTasks ?? fetchedTasks;

    const orderedTasks = useMemo(
        () => [...tasks].sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)),
        [tasks],
    );

    const formatDisplayDate = useCallback((value?: string | null) => {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const handleCreate = useCallback(async ({ title, description }: { title: string; description: string }) => {
        if (!title.trim()) return null;

        const created = await createTask({
            columnId,
            title: title.trim(),
            description: description.trim() || null,
            priority: 'MEDIUM',
        });

        return created;
    }, [columnId, createTask]);

    const handleDelete = useCallback(async (taskId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá task này không?')) return false;
        const result = await deleteTask(taskId);
        return Boolean(result);
    }, [deleteTask]);

    const handleSaveTask = useCallback(async ({
        editingTask,
        editorTitle,
        editorDescription,
        editorPriority,
        editorDueDate,
        editorAssigneeIds,
        editorLabelIds,
    }: {
        editingTask: TaskListItem;
        editorTitle: string;
        editorDescription: string;
        editorPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
        editorDueDate: string;
        editorAssigneeIds: Array<string | number>;
        editorLabelIds: Array<string | number>;
    }) => {
        if (!editingTask) return null;

        const payload: UpdateTaskPayload = {
            title: editorTitle.trim(),
            description: editorDescription.trim() || null,
            priority: editorPriority,
            dueDate: editorDueDate ? new Date(`${editorDueDate}T00:00:00`).toISOString() : null,
        };

        const originalAssigneeIds = (editingTask.assignees ?? []).map((a) => String(a.userId ?? a.user?.id ?? 0)).filter(Boolean);
        const newAssigneeIds = editorAssigneeIds.map(String);
        if (JSON.stringify(originalAssigneeIds.sort()) !== JSON.stringify(newAssigneeIds.sort())) {
            payload.assigneeIds = newAssigneeIds;
        }

        const originalLabelIds = (editingTask.taskLabels ?? []).map((tl) => String(tl.label?.id ?? tl.id ?? 0)).filter(Boolean);
        const newLabelIds = editorLabelIds.map(String);
        if (JSON.stringify(originalLabelIds.sort()) !== JSON.stringify(newLabelIds.sort())) {
            payload.labelIds = newLabelIds;
        }

        const updated = await taskService.updateTask(editingTask.id, payload);
        if (updated) {
            if (onTaskUpdated) {
                onTaskUpdated(editingTask.id, updated);
            }
            showToast('Task đã được cập nhật', 'success');
        }

        return updated;
    }, [onTaskUpdated, showToast]);

    const handleCreateLabel = useCallback(async ({ labelName, labelColor }: { labelName: string; labelColor: string }) => {
        if (!projectId || !labelName.trim()) return null;

        const created = await createLabel({ projectId, name: labelName.trim(), color: labelColor });
        return created;
    }, [createLabel, projectId]);

    const handleUpdateExistingLabel = useCallback(async ({ labelId, labelName, labelColor }: { labelId: string | number; labelName: string; labelColor: string }) => {
        if (!projectId || !labelName.trim()) return null;

        const updated = await updateLabel(labelId, { name: labelName.trim(), color: labelColor });
        return updated;
    }, [projectId, updateLabel]);

    const handleDeleteLabel = useCallback(async ({ labelId, labelNameStr }: { labelId: string | number; labelNameStr?: string }) => {
        if (!projectId) return false;
        if (!window.confirm(`Bạn có chắc chắn muốn xoá nhãn "${labelNameStr ?? ''}" này không?`)) return false;
        const result = await deleteLabel(labelId);
        if (result) showToast('Đã xoá nhãn thành công', 'success');
        return Boolean(result);
    }, [deleteLabel, projectId, showToast]);

    const handleDropTask = useCallback(async ({
        event,
        targetTaskId,
        draggingTaskId,
        columnId: currentColumnId,
    }: {
        event: React.DragEvent<HTMLElement>;
        targetTaskId?: string | number | null;
        draggingTaskId: string | number | null;
        columnId: string;
    }) => {
        event.preventDefault();
        event.stopPropagation();

        const taskIdFromTransfer = event.dataTransfer.getData('application/task-id');
        const sourceColumnIdFromTransfer = event.dataTransfer.getData('application/source-column-id');
        const draggedTaskId = taskIdFromTransfer || draggingTaskId;

        if (!draggedTaskId || draggedTaskId === targetTaskId) return;

        const sourceColumnIdForMove = sourceColumnIdFromTransfer || currentColumnId;
        const targetTasks = orderedTasks;
        const targetIndex = targetTaskId == null ? targetTasks.length : targetTasks.findIndex((task) => String(task.id) === String(targetTaskId));

        const prevTask = targetIndex > 0 ? targetTasks[targetIndex - 1] : null;
        const nextTask = targetIndex >= 0 ? targetTasks[targetIndex] : null;

        const prevPosition = prevTask ? prevTask.position ?? null : null;
        const nextPosition = nextTask ? nextTask.position ?? null : null;

        try {
            if (onMoveTask) {
                await onMoveTask(sourceColumnIdForMove, draggedTaskId, currentColumnId, prevPosition, nextPosition);
            } else {
                await moveTask(draggedTaskId, {
                    columnId: currentColumnId,
                    prevPosition,
                    nextPosition,
                });
            }
        } finally {
            return;
        }
    }, [columnId, moveTask, onMoveTask, orderedTasks]);

    return {
        tasks,
        orderedTasks,
        loading,
        error,
        labels,
        members,
        project,
        formatDisplayDate,
        handleCreate,
        handleDelete,
        handleSaveTask,
        handleCreateLabel,
        handleUpdateExistingLabel,
        handleDeleteLabel,
        handleDropTask,
        fetchTasks,
        updateTask,
        moveTask,
    };
}
