import { apiRequest } from '@/src/lib/api-client';
import type { ActivityItem } from '@/src/features/activity/types/activity.types';

export const activityService = {
    async getActivitiesByProject(projectId: string | number): Promise<ActivityItem[]> {
        return apiRequest<ActivityItem[]>(`/activities?projectId=${encodeURIComponent(String(projectId))}`, { method: 'GET' });
    },
};
