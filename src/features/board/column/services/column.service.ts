import { apiRequest } from '@/src/lib/api-client';
import type { BoardColumn, CreateColumnPayload, MoveColumnPayload, UpdateColumnPayload } from '@/src/features/board/column/types/column.types';

export const columnService = {
    async getColumnsByBoard(boardId: string | number): Promise<BoardColumn[]> {
        return apiRequest<BoardColumn[]>(`/columns?boardId=${encodeURIComponent(String(boardId))}`, { method: 'GET' });
    },

    async createColumn(payload: CreateColumnPayload): Promise<BoardColumn> {
        return apiRequest<BoardColumn>('/columns', {
            method: 'POST',
            body: JSON.stringify({
                boardId: String(payload.boardId),
                name: payload.name,
                ...(payload.position !== undefined ? { position: payload.position } : {}),
            }),
        });
    },

    async updateColumn(columnId: string | number, payload: UpdateColumnPayload): Promise<BoardColumn> {
        return apiRequest<BoardColumn>(`/columns/${columnId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async moveColumn(columnId: string | number, payload: MoveColumnPayload): Promise<BoardColumn> {
        return apiRequest<BoardColumn>(`/columns/${columnId}/move`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteColumn(columnId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/columns/${columnId}`, {
            method: 'DELETE',
        });
    },
};
