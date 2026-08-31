'use client';

import { useCallback, useState } from 'react';

import { activityService } from '@/src/features/activity/services/activity.service';
import type { ActivityItem } from '@/src/features/activity/types/activity.types';

export function useActivities(projectId: string | number) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await activityService.getActivitiesByProject(projectId);
            setActivities(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải hoạt động';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    return {
        activities,
        loading,
        error,
        fetchActivities,
    };
}
