'use client';

import { useCallback, useState } from 'react';

import { labelService } from '@/src/features/label/services/label.service';
import type { CreateLabelPayload, LabelItem, UpdateLabelPayload } from '@/src/features/label/types/label.types';

export function useLabels(projectId: string | number) {
    const [labels, setLabels] = useState<LabelItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchLabels = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await labelService.getLabelsByProject(projectId);
            setLabels(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải danh sách nhãn';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const createLabel = useCallback(async (payload: CreateLabelPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await labelService.createLabel(payload);
            setLabels((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo nhãn';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLabel = useCallback(async (labelId: string | number, payload: UpdateLabelPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await labelService.updateLabel(labelId, payload);
            setLabels((prev) => prev.map((label) => String(label.id) === String(labelId) ? { ...label, ...updated } : label));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật nhãn';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteLabel = useCallback(async (labelId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await labelService.deleteLabel(labelId);
            setLabels((prev) => prev.filter((label) => String(label.id) !== String(labelId)));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá nhãn';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        labels,
        loading,
        error,
        fetchLabels,
        createLabel,
        updateLabel,
        deleteLabel,
    };
}
