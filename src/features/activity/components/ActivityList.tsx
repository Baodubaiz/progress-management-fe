'use client';

import { useEffect } from 'react';
import { Activity } from 'lucide-react';

import { useActivities } from '@/src/features/activity/hooks/useActivities';

export function ActivityList({ projectId }: { projectId: string }) {
    const { activities, loading, error, fetchActivities } = useActivities(projectId);

    useEffect(() => {
        void fetchActivities();
    }, [fetchActivities]);

    const formatAction = (action: string) => {
        const map: Record<string, string> = {
            TASK_CREATED: 'Tạo task',
            TASK_UPDATED: 'Cập nhật task',
            TASK_DELETED: 'Xoá task',
            TASK_MOVED: 'Di chuyển task',
            COMMENT_ADDED: 'Thêm bình luận',
            COMMENT_UPDATED: 'Cập nhật bình luận',
            COMMENT_DELETED: 'Xoá bình luận',
            BOARD_CREATED: 'Tạo board',
            COLUMN_CREATED: 'Tạo cột',
            LABEL_CREATED: 'Tạo nhãn',
        };

        return map[action] || action;
    };

    return (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
                <Activity className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold">Hoạt động gần đây</h3>
            </div>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

            {loading ? (
                <div className="text-sm text-slate-500">Đang tải hoạt động...</div>
            ) : activities.length ? (
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div key={String(activity.id)} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-medium text-slate-900">{activity.user?.username || 'User'}</p>
                                    <p className="text-sm text-slate-600">{formatAction(activity.action)}</p>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {activity.createdAt ? new Date(activity.createdAt).toLocaleString('vi-VN') : ''}
                                </span>
                            </div>
                            {activity.task ? (
                                <p className="mt-2 text-sm text-slate-600">Task: {activity.task.title}</p>
                            ) : null}
                            {activity.newValue ? (
                                <p className="mt-2 text-sm text-slate-500">Chi tiết: {activity.newValue}</p>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Chưa có hoạt động nào trong dự án.
                </div>
            )}
        </div>
    );
}
