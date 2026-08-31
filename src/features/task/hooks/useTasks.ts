'use client';

import { useCallback, useState } from 'react';

import { taskService } from '@/src/features/task/services/task.service';
import type { CreateTaskPayload, MoveTaskPayload, TaskListItem, UpdateTaskPayload } from '@/src/features/task/types/task.types';

export function useTasks(columnId?: string | number) {
    const [tasks, setTasks] = useState<TaskListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTasks = useCallback(async () => {
        if (!columnId) {
            setTasks([]);
            return [];
        }

        setLoading(true);
        setError('');

        try {
            const data = await taskService.getTasksByColumn(columnId);
            setTasks(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [columnId]);

    const createTask = useCallback(async (payload: CreateTaskPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await taskService.createTask(payload);
            setTasks((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTask = useCallback(async (taskId: string | number, payload: UpdateTaskPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await taskService.updateTask(taskId, payload);
            setTasks((prev) => prev.map((task) => String(task.id) === String(taskId) ? { ...task, ...updated } : task));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const moveTask = useCallback(async (taskId: string | number, payload: MoveTaskPayload) => {
        setLoading(true);
        setError('');

        try {
            const moved = await taskService.moveTask(taskId, payload);
            setTasks((prev) => prev.map((task) => String(task.id) === String(taskId) ? { ...task, ...moved } : task));
            return moved;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể di chuyển task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTask = useCallback(async (taskId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await taskService.deleteTask(taskId);
            setTasks((prev) => prev.filter((task) => String(task.id) !== String(taskId)));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
    };
}
