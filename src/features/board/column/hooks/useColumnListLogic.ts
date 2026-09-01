'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useColumns } from '@/src/features/board/column/hooks/useColumns';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { useBoardTasks } from '@/src/features/task/hooks/useBoardTasks';
import { useToast } from '@/src/providers/toast-context';
import type { TaskListItem } from '@/src/features/task/types/task.types';

export function useColumnListLogic(boardId: string, projectId: string) {
    const { columns, loading, error, fetchColumns, createColumn, deleteColumn, moveColumn } = useColumns(boardId);
    const { tasks: boardTasks, loading: tasksLoading, error: tasksError, fetchTasks: fetchBoardTasks, moveTask: moveBoardTask, setTasks: setBoardTasks } = useBoardTasks(boardId);
    const { project, fetchProjectById } = useProjects();
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
    const [dragOverSide, setDragOverSide] = useState<'before' | 'after' | null>(null);
    const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
    const [dragType, setDragType] = useState<'task' | 'column' | null>(null);
    const [showActivity, setShowActivity] = useState(false);

    useEffect(() => {
        void fetchColumns();
        void fetchBoardTasks();
        void fetchProjectById(projectId);
    }, [fetchColumns, fetchBoardTasks, fetchProjectById, projectId]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    useEffect(() => {
        if (tasksError) showToast(tasksError, 'error');
    }, [tasksError, showToast]);

    const tasksByColumn = useMemo(() => {
        const map = new Map<string, TaskListItem[]>();
        for (const task of boardTasks) {
            const key = String(task.columnId);
            const existing = map.get(key) ?? [];
            existing.push(task);
            map.set(key, existing);
        }

        for (const values of map.values()) {
            values.sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0));
        }

        return map;
    }, [boardTasks]);

    const handleCreate = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        const created = await createColumn({ boardId, name: name.trim() });
        if (created) {
            setName('');
            void fetchBoardTasks();
        }
        setSubmitting(false);
    }, [boardId, createColumn, fetchBoardTasks, name]);

    const handleDelete = useCallback(async (columnId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá cột này không?')) return;
        await deleteColumn(columnId);
    }, [deleteColumn]);

    const handleMoveTask = useCallback(async (
        sourceColumnId: string | number,
        taskId: string | number,
        targetColumnId: string | number,
        prevPosition?: string | number | null,
        nextPosition?: string | number | null,
    ) => {
        if (sourceColumnId === targetColumnId) {
            return null;
        }

        return moveBoardTask(taskId, {
            columnId: targetColumnId,
            prevPosition,
            nextPosition,
        });
    }, [moveBoardTask]);

    const handleTaskUpdated = useCallback((taskId: string | number, updatedTask: Partial<TaskListItem>) => {
        setBoardTasks((prev) => prev.map((task) => String(task.id) === String(taskId) ? { ...task, ...updatedTask } : task));
    }, [setBoardTasks]);

    const handleDropOnColumn = useCallback(async (event: React.DragEvent<HTMLDivElement>, targetColumnId: string | number) => {
        event.preventDefault();
        event.stopPropagation();

        const taskId = event.dataTransfer.getData('application/task-id');
        const sourceColumnId = event.dataTransfer.getData('application/source-column-id');

        if (!taskId || !sourceColumnId) {
            setDragOverColumnId(null);
            return;
        }

        const targetTasks = tasksByColumn.get(String(targetColumnId)) ?? [];
        const lastTask = targetTasks.length ? targetTasks[targetTasks.length - 1] : null;
        const prevPosition = lastTask ? lastTask.position ?? null : null;

        await handleMoveTask(sourceColumnId, taskId, targetColumnId, prevPosition, null);
        setDragOverColumnId(null);
    }, [handleMoveTask, tasksByColumn]);

    const handleColumnDragStart = useCallback((columnId: string | number) => {
        setDraggingColumnId(String(columnId));
        setDragType('column');
        setDragOverColumnId(null);
        setDragOverSide(null);
    }, []);

    const handleColumnDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>, targetColumnId: string | number) => {
        event.preventDefault();
        event.stopPropagation();

        const draggedColumnId = event.dataTransfer.getData('application/column-id') || draggingColumnId;
        if (!draggedColumnId || String(draggedColumnId) === String(targetColumnId)) {
            setDraggingColumnId(null);
            setDragOverColumnId(null);
            setDragOverSide(null);
            return;
        }

        const draggedColumn = columns.find((column) => String(column.id) === String(draggedColumnId));
        const targetColumn = columns.find((column) => String(column.id) === String(targetColumnId));

        if (!draggedColumn || !targetColumn) {
            setDraggingColumnId(null);
            setDragOverColumnId(null);
            setDragOverSide(null);
            return;
        }

        const draggedPosition = draggedColumn.position ?? null;
        const targetPosition = targetColumn.position ?? null;

        const result = await Promise.all([
            moveColumn(draggedColumnId, { targetPosition }),
            moveColumn(targetColumnId, { targetPosition: draggedPosition }),
        ]);

        setDraggingColumnId(null);
        setDragOverColumnId(null);
        setDragOverSide(null);
        setDragType(null);

        return result;
    }, [columns, draggingColumnId, moveColumn]);

    return {
        columns,
        loading,
        error,
        tasksLoading,
        boardTasks,
        project,
        name,
        setName,
        submitting,
        dragOverColumnId,
        setDragOverColumnId,
        dragOverSide,
        setDragOverSide,
        draggingColumnId,
        setDraggingColumnId,
        dragType,
        setDragType,
        showActivity,
        setShowActivity,
        tasksByColumn,
        handleCreate,
        handleDelete,
        handleMoveTask,
        handleTaskUpdated,
        handleDropOnColumn,
        handleColumnDragStart,
        handleColumnDrop,
    };
}
