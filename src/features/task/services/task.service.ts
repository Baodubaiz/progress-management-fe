import { apiRequest } from '@/src/lib/api-client';
import type { CreateTaskPayload, MoveTaskPayload, TaskListItem, UpdateTaskPayload } from '@/src/features/task/types/task.types';

export const taskService = {
    async getTasksByColumn(columnId: string | number): Promise<TaskListItem[]> {
        return apiRequest<TaskListItem[]>(`/tasks?columnId=${encodeURIComponent(String(columnId))}`, { method: 'GET' });
    },

    async getTasksByBoard(boardId: string | number): Promise<TaskListItem[]> {
        return apiRequest<TaskListItem[]>(`/tasks?boardId=${encodeURIComponent(String(boardId))}`, { method: 'GET' });
    },

    async createTask(payload: CreateTaskPayload): Promise<TaskListItem> {
        return apiRequest<TaskListItem>('/tasks', {
            method: 'POST',
            body: JSON.stringify({
                columnId: String(payload.columnId),
                title: payload.title,
                description: payload.description ?? null,
                priority: payload.priority ?? 'MEDIUM',
                dueDate: payload.dueDate ?? null,
                assigneeIds: payload.assigneeIds ?? [],
                labelIds: payload.labelIds ?? [],
            }),
        });
    },

    async updateTask(taskId: string | number, payload: UpdateTaskPayload): Promise<TaskListItem> {
        return apiRequest<TaskListItem>(`/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async moveTask(taskId: string | number, payload: MoveTaskPayload): Promise<TaskListItem> {
        return apiRequest<TaskListItem>(`/tasks/${taskId}/move`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteTask(taskId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
    },
};
