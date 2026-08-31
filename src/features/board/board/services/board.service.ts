import { apiRequest } from '@/src/lib/api-client';
import type { BoardListItem, BoardListResponse, CreateBoardPayload } from '@/src/features/board/board/types/board.types';

export const boardService = {
    async getBoardsByProject(
        projectId: string | number,
        params?: { page?: number; limit?: number; search?: string }
    ): Promise<BoardListResponse> {
        const query = new URLSearchParams({ projectId: String(projectId) });

        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.search) query.set('search', params.search);

        const suffix = query.toString() ? `?${query.toString()}` : '';
        return apiRequest<BoardListResponse>(`/boards${suffix}`, { method: 'GET' });
    },

    async createBoard(payload: CreateBoardPayload): Promise<BoardListItem> {
        return apiRequest<BoardListItem>('/boards', {
            method: 'POST',
            body: JSON.stringify({
                projectId: String(payload.projectId),
                name: payload.name,
                description: payload.description ?? null,
                initialColumns: payload.initialColumns && payload.initialColumns.length
                    ? payload.initialColumns
                    : ['To Do', 'In Progress', 'Done'],
            }),
        });
    },
};
