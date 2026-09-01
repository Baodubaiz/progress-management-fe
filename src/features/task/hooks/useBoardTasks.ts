'use client';

import { useCallback, useState } from 'react';

import { taskService } from '@/src/features/task/services/task.service';
import type { MoveTaskPayload, TaskListItem } from '@/src/features/task/types/task.types';

export function useBoardTasks(boardId: string | number) {
    const [tasks, setTasks] = useState<TaskListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await taskService.getTasksByBoard(boardId);
            setTasks(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách task';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    const moveTask = useCallback(async (
        taskId: string | number,
        payload: MoveTaskPayload,
    ) => {
        const previousTasks = [...tasks];
        const movedTask = previousTasks.find((task) => String(task.id) === String(taskId));
        if (!movedTask) return null;

        const optimisticTasks = previousTasks.filter((task) => String(task.id) !== String(taskId));
        const optimisticMovedTask: TaskListItem = {
            ...movedTask,
            columnId: payload.columnId ?? movedTask.columnId,
            position: payload.nextPosition ?? payload.prevPosition ?? movedTask.position ?? '1',
        };

        optimisticTasks.push(optimisticMovedTask);
        setTasks(optimisticTasks);

        try {
            const result = await taskService.moveTask(taskId, payload);
            setTasks((prev) => prev.map((task) => String(task.id) === String(taskId) ? { ...task, ...result } : task));
            return result;
        } catch (err) {
            setTasks(previousTasks);
            const message = err instanceof Error ? err.message : 'Không thể di chuyển task';
            setError(message);
            throw err;
        }
    }, [tasks]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        moveTask,
        setTasks,
    };
}
