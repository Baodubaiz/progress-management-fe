'use client';

import { useEffect } from 'react';
import { Activity, Clock, User } from 'lucide-react';

import { useActivities } from '@/src/features/activity/hooks/useActivities';
import { useToast } from '@/src/providers/toast-context';

export function ActivityList({ projectId }: { projectId: string }) {
    const { activities, loading, error, fetchActivities } = useActivities(projectId);
    const { showToast } = useToast();

    useEffect(() => {
        void fetchActivities();
    }, [fetchActivities]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

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
            MEMBER_ADDED: 'Thêm thành viên',
        };

        return map[action] || action;
    };

    if (loading) {
        return <div className="p-4 text-center text-xs text-slate-400 animate-pulse">Đang tải hoạt động...</div>;
    }

    if (!activities.length) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
                <Activity className="mb-2 h-6 w-6 text-slate-300" />
                Chưa có hoạt động nào trong dự án.
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {activities.map((activity) => (
                <div key={String(activity.id)} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs transition-colors hover:bg-slate-100/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                                {activity.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span>{activity.user?.username || 'Thành viên'}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                    </div>

                    <div className="pl-6 space-y-0.5">
                        <p className="font-semibold text-blue-600">{formatAction(activity.action)}</p>
                        {activity.task ? (
                            <p className="text-slate-600 font-medium">Task: <span className="text-slate-800">{activity.task.title}</span></p>
                        ) : null}
                        {activity.newValue ? (
                            <p className="text-[11px] text-slate-400 truncate">Chi tiết: {activity.newValue}</p>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}
