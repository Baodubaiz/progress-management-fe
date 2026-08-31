import { apiRequest } from '@/src/lib/api-client';
import type { CreateLabelPayload, LabelItem, UpdateLabelPayload } from '@/src/features/label/types/label.types';

export const labelService = {
    async getLabelsByProject(projectId: string | number): Promise<LabelItem[]> {
        return apiRequest<LabelItem[]>(`/labels?projectId=${encodeURIComponent(String(projectId))}`, { method: 'GET' });
    },

    async createLabel(payload: CreateLabelPayload): Promise<LabelItem> {
        return apiRequest<LabelItem>('/labels', {
            method: 'POST',
            body: JSON.stringify({
                projectId: String(payload.projectId),
                name: payload.name,
                color: payload.color,
            }),
        });
    },

    async updateLabel(labelId: string | number, payload: UpdateLabelPayload): Promise<LabelItem> {
        return apiRequest<LabelItem>(`/labels/${labelId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteLabel(labelId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/labels/${labelId}`, {
            method: 'DELETE',
        });
    },
};
