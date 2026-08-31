'use client';

import { useCallback, useState } from 'react';

import { boardService } from '@/src/features/board/board/services/board.service';
import type { BoardListItem, BoardListResponse, CreateBoardPayload } from '@/src/features/board/board/types/board.types';

export function useBoards() {
    const [boards, setBoards] = useState<BoardListItem[]>([]);
    const [pagination, setPagination] = useState<BoardListResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBoards = useCallback(async (projectId: string | number, params?: { page?: number; limit?: number; search?: string }) => {
        setLoading(true);
        setError('');

        try {
            const result = await boardService.getBoardsByProject(projectId, params);
            setBoards(result.boards || []);
            setPagination(result.pagination || null);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách board';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createBoard = useCallback(async (payload: CreateBoardPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await boardService.createBoard(payload);
            setBoards((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo board';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { boards, pagination, loading, error, fetchBoards, createBoard };
}
