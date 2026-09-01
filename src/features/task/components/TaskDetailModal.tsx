'use client';

import { X, Calendar, Clock, User, Tag, FileText, LayoutList, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { CommentList } from '@/src/features/comment/components/CommentList';
import type { TaskListItem } from '@/src/features/task/types/task.types';

interface TaskDetailModalProps {
    task: TaskListItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
    if (!isOpen || !task) return null;

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return <Badge variant="rose" className="font-semibold px-2.5 py-0.5">Khẩn cấp (URGENT)</Badge>;
            case 'HIGH':
                return <Badge variant="amber" className="font-semibold px-2.5 py-0.5">Cao (HIGH)</Badge>;
            case 'LOW':
                return <Badge variant="green" className="font-semibold px-2.5 py-0.5">Thấp (LOW)</Badge>;
            default:
                return <Badge variant="blue" className="font-semibold px-2.5 py-0.5">Trung bình (MEDIUM)</Badge>;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-detail-title"
            onMouseDown={onClose}
        >
            <div
                className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                    <div className="flex items-center gap-2 text-blue-600">
                        <LayoutList className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Chi tiết thẻ công việc</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-200/80 hover:text-slate-700 cursor-pointer transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Task Title & Priority */}
                    <div className="space-y-3 border-b border-slate-100 pb-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 id="task-detail-title" className="text-xl font-bold text-slate-900 leading-snug">
                                {task.title}
                            </h2>
                            <div>{getPriorityBadge(task.priority)}</div>
                        </div>
                    </div>

                    {/* Task Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Mô tả công việc
                        </div>
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap transition-colors hover:border-slate-300 min-h-[70px]">
                            {task.description ? task.description : <span className="italic text-slate-400">Chưa có mô tả chi tiết cho thẻ này.</span>}
                        </div>
                    </div>

                    {/* Meta info grid: Assignees & Labels */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Assignees */}
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2 transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                                <User className="h-4 w-4 text-blue-600" />
                                Người thực hiện
                            </div>
                            {task.assignees && task.assignees.length > 0 ? (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {task.assignees.map((assignee, index) => (
                                        <div
                                            key={`detail-assignee-${String(assignee.id ?? assignee.userId ?? assignee.user?.id ?? index)}-${index}`}
                                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm transition-transform duration-200 hover:scale-105"
                                        >
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                                {assignee.user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span>{assignee.user?.username || 'User'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Chưa phân công người thực hiện</p>
                            )}
                        </div>

                        {/* Labels */}
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2 transition-all hover:border-violet-200 hover:bg-white hover:shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                                <Tag className="h-4 w-4 text-violet-600" />
                                Nhãn phân loại
                            </div>
                            {task.taskLabels && task.taskLabels.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {task.taskLabels.map(({ id, label }, index) => (
                                        <span
                                            key={`detail-label-${String(id ?? label.id ?? index)}-${index}`}
                                            className="rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-105"
                                            style={{ backgroundColor: label.color || '#3b82f6' }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Chưa gắn nhãn</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline & Metadata */}
                    <div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>Ngày tạo: <b className="text-slate-800">{task.createdAt ? new Date(task.createdAt).toLocaleString('vi-VN') : '---'}</b></span>
                        </div>
                        {task.creator && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <span>Người tạo: <b className="text-slate-800">{task.creator.username}</b></span>
                            </div>
                        )}
                        {task.dueDate && (
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Calendar className="h-4 w-4 text-amber-500" />
                                <span>Hạn hoàn thành: <b className="text-amber-700">{new Date(task.dueDate).toLocaleDateString('vi-VN')}</b></span>
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-slate-100 pt-5">
                        <CommentList taskId={String(task.id)} />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-5 font-semibold text-slate-700 border-slate-200 hover:bg-slate-200/80 cursor-pointer transition-all"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}
