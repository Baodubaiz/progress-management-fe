'use client';

import { useCallback, useState } from 'react';

import { columnService } from '@/src/features/board/column/services/column.service';
import type { BoardColumn, CreateColumnPayload, MoveColumnPayload, UpdateColumnPayload } from '@/src/features/board/column/types/column.types';

export function useColumns(boardId: string | number) {
    const [columns, setColumns] = useState<BoardColumn[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchColumns = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await columnService.getColumnsByBoard(boardId);
            setColumns(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách cột';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    const createColumn = useCallback(async (payload: CreateColumnPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await columnService.createColumn(payload);
            setColumns((prev) => [...prev, created]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo cột';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateColumn = useCallback(async (columnId: string | number, payload: UpdateColumnPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await columnService.updateColumn(columnId, payload);
            setColumns((prev) => prev.map((column) => String(column.id) === String(columnId) ? { ...column, ...updated } : column));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật cột';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const moveColumn = useCallback(async (columnId: string | number, payload: MoveColumnPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await columnService.moveColumn(columnId, payload);
            setColumns((prev) => prev.map((column) => String(column.id) === String(columnId) ? { ...column, ...updated } : column));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể di chuyển cột';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteColumn = useCallback(async (columnId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await columnService.deleteColumn(columnId);
            setColumns((prev) => prev.filter((column) => String(column.id) !== String(columnId)));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá cột';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        columns,
        loading,
        error,
        fetchColumns,
        createColumn,
        updateColumn,
        moveColumn,
        deleteColumn,
    };
}
