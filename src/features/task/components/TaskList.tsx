'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { PencilLine, Plus, Trash2, GripVertical, CircleDashed, X, UserPlus, Tag, Palette, Check, Eye } from 'lucide-react';

import { Badge } from '@/components/common/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLabels } from '@/src/features/label/hooks/useLabels';
import { useMembers } from '@/src/features/project/member/hooks/useMembers';
import { useProjects } from '@/src/features/project/project/hooks/useProjects';
import { taskService } from '@/src/features/task/services/task.service';
import { useTasks } from '@/src/features/task/hooks/useTasks';
import { useToast } from '@/src/providers/toast-context';
import type { TaskListItem, UpdateTaskPayload } from '@/src/features/task/types/task.types';
import { TaskDetailModal } from './TaskDetailModal';

export function TaskList({
    columnId,
    projectId,
    tasks: controlledTasks,
    onMoveTask,
    onTaskUpdated,
    onTaskCreated,
    onTaskDeleted,
}: {
    columnId: string;
    projectId?: string;
    tasks?: TaskListItem[];
    onMoveTask?: (
        sourceColumnId: string | number,
        taskId: string | number,
        targetColumnId: string | number,
        prevPosition?: string | number | null,
        nextPosition?: string | number | null,
    ) => Promise<unknown> | unknown;
    onTaskUpdated?: (taskId: string | number, updatedTask: Partial<TaskListItem>) => void;
    onTaskCreated?: (newTask: TaskListItem) => void;
    onTaskDeleted?: (taskId: string | number) => void;
}) {
    const { tasks: fetchedTasks, loading, error, fetchTasks, createTask, deleteTask, moveTask, updateTask } = useTasks(columnId);
    const { labels, fetchLabels, createLabel, updateLabel, deleteLabel } = useLabels(projectId ?? columnId);
    const { members, fetchMembers } = useMembers(projectId ?? columnId);
    const { project, fetchProjectById } = useProjects();
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [draggingTaskId, setDraggingTaskId] = useState<string | number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskListItem | null>(null);
    const [editorTitle, setEditorTitle] = useState('');
    const [editorDescription, setEditorDescription] = useState('');
    const [editorPriority, setEditorPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
    const [editorDueDate, setEditorDueDate] = useState<string>('');
    const [editorAssigneeIds, setEditorAssigneeIds] = useState<Array<string | number>>([]);
    const [editorLabelIds, setEditorLabelIds] = useState<Array<string | number>>([]);
    const [showMemberPicker, setShowMemberPicker] = useState(false);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [labelName, setLabelName] = useState('');
    const [labelColor, setLabelColor] = useState('#3b82f6');
    const [editingLabelId, setEditingLabelId] = useState<string | number | null>(null);
    const [selectedDetailTask, setSelectedDetailTask] = useState<TaskListItem | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const tasks = controlledTasks ?? fetchedTasks;

    useEffect(() => {
        if (!controlledTasks) {
            void fetchTasks();
        }
    }, [controlledTasks, fetchTasks]);

    useEffect(() => {
        if (projectId) {
            void fetchLabels();
            void fetchMembers();
            void fetchProjectById(projectId);
        }
    }, [projectId, fetchLabels, fetchMembers, fetchProjectById]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    useEffect(() => {
        if (showCreateForm && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [showCreateForm]);

    useEffect(() => {
        if (editingTask) {
            setEditorTitle(editingTask.title ?? '');
            setEditorDescription(editingTask.description ?? '');
            setEditorPriority(editingTask.priority ?? 'MEDIUM');
            setEditorDueDate(editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 10) : '');
            setEditorAssigneeIds((editingTask.assignees ?? []).map((assignee) => Number(assignee.userId ?? assignee.user?.id ?? 0)).filter(Boolean));
            setEditorLabelIds((editingTask.taskLabels ?? []).map((taskLabel) => Number(taskLabel.label?.id ?? taskLabel.id ?? 0)).filter(Boolean));
        }
    }, [editingTask]);

    const formatDisplayDate = (value?: string | null) => {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const orderedTasks = useMemo(
        () => [...tasks].sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)),
        [tasks],
    );

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        const created = await createTask({
            columnId,
            title: title.trim(),
            description: description.trim() || null,
            priority: 'MEDIUM',
        });

        if (created) {
            if (onTaskCreated) {
                onTaskCreated(created);
            }
            setTitle('');
            setDescription('');
            if (titleInputRef.current) {
                titleInputRef.current.focus();
            }
        }

        setSubmitting(false);
    };

    const handleDelete = async (taskId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá task này không?')) return;
        const result = await deleteTask(taskId);
        if (result && onTaskDeleted) {
            onTaskDeleted(taskId);
        }
    };

    const handleOpenEditor = (task: TaskListItem) => {
        setEditingTask(task);
        setEditorTitle(task.title ?? '');
        setEditorDescription(task.description ?? '');
        setEditorPriority(task.priority ?? 'MEDIUM');
        setEditorAssigneeIds((task.assignees ?? []).map((assignee) => Number(assignee.userId ?? assignee.user?.id ?? 0)).filter((value) => value > 0));
        setEditorLabelIds((task.taskLabels ?? []).map((taskLabel) => Number(taskLabel.label?.id ?? taskLabel.id ?? 0)).filter((value) => value > 0));
        setShowMemberPicker(false);
        setShowLabelPicker(false);
        setEditingLabelId(null);
        setLabelName('');
        setLabelColor('#3b82f6');
    };

    const handleSaveTask = async () => {
        if (!editingTask) return;

        // Only include fields that actually changed
        const payload: UpdateTaskPayload = {
            title: editorTitle.trim(),
            description: editorDescription.trim() || null,
            priority: editorPriority,
            dueDate: editorDueDate ? new Date(`${editorDueDate}T00:00:00`).toISOString() : null,
        };

        // Only include assigneeIds if they changed
        const originalAssigneeIds = (editingTask.assignees ?? []).map((a) => String(a.userId ?? a.user?.id ?? 0)).filter(Boolean);
        const newAssigneeIds = editorAssigneeIds.map(String);
        if (JSON.stringify(originalAssigneeIds.sort()) !== JSON.stringify(newAssigneeIds.sort())) {
            payload.assigneeIds = newAssigneeIds;
        }

        // Only include labelIds if they changed
        const originalLabelIds = (editingTask.taskLabels ?? []).map((tl) => String(tl.label?.id ?? tl.id ?? 0)).filter(Boolean);
        const newLabelIds = editorLabelIds.map(String);
        if (JSON.stringify(originalLabelIds.sort()) !== JSON.stringify(newLabelIds.sort())) {
            payload.labelIds = newLabelIds;
        }

        const updated = await taskService.updateTask(editingTask.id, payload);
        if (updated) {
            if (onTaskUpdated) {
                onTaskUpdated(editingTask.id, updated);
            }
            setEditingTask(null);
            showToast('Task đã được cập nhật', 'success');
        }
    };

    const handleCreateLabel = async () => {
        if (!projectId || !labelName.trim()) return;

        const created = await createLabel({ projectId, name: labelName.trim(), color: labelColor });
        if (created) {
            setLabelName('');
            setLabelColor('#3b82f6');
            setEditingLabelId(null);
            setEditorLabelIds((prev) => Array.from(new Set([...prev, Number(created.id)])));
        }
    };

    const handleUpdateExistingLabel = async (labelId: string | number) => {
        if (!projectId || !labelName.trim()) return;

        const updated = await updateLabel(labelId, { name: labelName.trim(), color: labelColor });
        if (updated) {
            setLabelName('');
            setLabelColor('#3b82f6');
            setEditingLabelId(null);
        }
    };

    const handleDeleteLabel = async (labelId: string | number, labelNameStr?: string) => {
        if (!projectId) return;
        if (!window.confirm(`Bạn có chắc chắn muốn xoá nhãn "${labelNameStr ?? ''}" này không?`)) return;
        await deleteLabel(labelId);
        setEditorLabelIds((prev) => prev.filter((id) => Number(id) !== Number(labelId)));
        showToast('Đã xoá nhãn thành công', 'success');
    };

    const getAssigneeKey = (assignee: { id?: string | number; userId?: string | number; user?: { id?: string | number } }, index: number) =>
        `assignee-${String(assignee.id ?? assignee.userId ?? assignee.user?.id ?? `${index}`)}-${index}`;

    const getTaskLabelKey = (taskLabel: { id?: string | number; label?: { id?: string | number } }, index: number) =>
        `task-label-${String(taskLabel.id ?? taskLabel.label?.id ?? `${index}`)}-${index}`;

    const handleDropTask = async (event: React.DragEvent<HTMLElement>, targetTaskId?: string | number | null) => {
        event.preventDefault();
        event.stopPropagation();

        const taskIdFromTransfer = event.dataTransfer.getData('application/task-id');
        const sourceColumnIdFromTransfer = event.dataTransfer.getData('application/source-column-id');
        const draggedTaskId = taskIdFromTransfer || draggingTaskId;

        if (!draggedTaskId || draggedTaskId === targetTaskId) return;

        const sourceColumnIdForMove = sourceColumnIdFromTransfer || columnId;
        const targetTasks = orderedTasks;
        const targetIndex = targetTaskId == null ? targetTasks.length : targetTasks.findIndex((task) => String(task.id) === String(targetTaskId));

        const prevTask = targetIndex > 0 ? targetTasks[targetIndex - 1] : null;
        const nextTask = targetIndex >= 0 ? targetTasks[targetIndex] : null;

        const prevPosition = prevTask ? prevTask.position ?? null : null;
        const nextPosition = nextTask ? nextTask.position ?? null : null;

        try {
            if (onMoveTask) {
                await onMoveTask(sourceColumnIdForMove, draggedTaskId, columnId, prevPosition, nextPosition);
            } else {
                await moveTask(draggedTaskId, {
                    columnId,
                    prevPosition,
                    nextPosition,
                });
            }
        } finally {
            setDraggingTaskId(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[50px] p-0.5">
                {loading ? (
                    <div className="rounded-xl bg-slate-200/50 p-4 text-xs text-slate-500 text-center animate-pulse">Đang tải thẻ...</div>
                ) : orderedTasks.length ? (
                    <div
                        className="space-y-2 min-h-full"
                        onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(event) => {
                            void handleDropTask(event);
                        }}
                    >
                        {orderedTasks.map((task) => (
                            <div
                                key={String(task.id)}
                                draggable
                                onDragStart={(event) => {
                                    event.stopPropagation();
                                    event.dataTransfer.effectAllowed = 'move';
                                    event.dataTransfer.setData('text/plain', String(task.id));
                                    event.dataTransfer.setData('application/drag-type', 'task');
                                    event.dataTransfer.setData('application/task-id', String(task.id));
                                    event.dataTransfer.setData('application/source-column-id', String(columnId));
                                    setDraggingTaskId(task.id);
                                }}
                                onDragEnd={() => setDraggingTaskId(null)}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={(event) => {
                                    event.stopPropagation();
                                    void handleDropTask(event, task.id);
                                }}
                                className="group relative cursor-grab rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md active:cursor-grabbing hover:-translate-y-0.5"
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <GripVertical className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                        <Badge variant={
                                            task.priority === 'URGENT'
                                                ? 'rose'
                                                : task.priority === 'HIGH'
                                                    ? 'amber'
                                                    : task.priority === 'LOW'
                                                        ? 'green'
                                                        : 'blue'
                                        } className="text-[10px] px-1.5 py-0 font-semibold">
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                            onClick={() => setSelectedDetailTask(task)}
                                            title="Xem chi tiết thẻ"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                        {project?.userRole === 'OWNER' && (
                                            <>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer" onClick={() => handleOpenEditor(task)}>
                                                    <PencilLine className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                    onClick={() => void handleDelete(task.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h4
                                    className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => setSelectedDetailTask(task)}
                                >
                                    {task.title}
                                </h4>
                                {task.description && (
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{task.description}</p>
                                )}

                                {(task.taskLabels?.length ?? 0) > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                                        {(task.taskLabels ?? []).map((taskLabel, idx) => (
                                            <span
                                                key={getTaskLabelKey(taskLabel, idx)}
                                                className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-slate-900"
                                                style={{ backgroundColor: `${taskLabel.label?.color ?? '#e2e8f0'}cc`, border: '1px solid rgba(15, 23, 42, 0.08)' }}
                                            >
                                                {taskLabel.label?.name ?? 'Label'}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {(task.assignees?.length ?? 0) > 0 && (
                                    <div className="mt-2 flex -space-x-2 overflow-hidden">
                                        {(task.assignees ?? []).slice(0, 3).map((assignee, idx) => (
                                            <div key={getAssigneeKey(assignee, idx)} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-[9px] font-semibold text-white">
                                                {(assignee.user?.username ?? 'U').charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-4 text-center text-xs text-slate-400">
                        Chưa có thẻ nào.
                    </div>
                )}
            </div>

            {showCreateForm ? (
                <form onSubmit={handleCreate} className="mt-1 space-y-2 rounded-xl border border-blue-400/50 bg-white p-3 shadow-md animate-in fade-in slide-in-from-top-2">
                    <Input
                        ref={titleInputRef}
                        id={`task-title-${columnId}`}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Nhập tiêu đề thẻ..."
                        className="h-9 rounded-lg border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:ring-blue-500 text-sm"
                    />

                    <textarea
                        id={`task-description-${columnId}`}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="min-h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 resize-none"
                        placeholder="Mô tả thêm (không bắt buộc)..."
                    />

                    <div className="flex items-center justify-between pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => {
                            setShowCreateForm(false);
                            setTitle('');
                            setDescription('');
                        }} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                            <X className="h-4 w-4 mr-1" /> Hủy
                        </Button>
                        <Button type="submit" size="sm" className="gap-1.5 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer" disabled={submitting || !title.trim()}>
                            <Plus className="h-3.5 w-3.5" />
                            {submitting ? 'Đang thêm...' : 'Thêm thẻ'}
                        </Button>
                    </div>
                </form>
            ) : (
                project?.userRole === 'OWNER' && (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 font-semibold mt-1 h-9 px-3 rounded-xl cursor-pointer"
                        onClick={() => setShowCreateForm(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Thêm thẻ
                    </Button>
                )
            )}

            {editingTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={() => setEditingTask(null)}
                >
                    <div
                        className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <PencilLine className="h-5 w-5" />
                                <h3 className="text-base font-bold text-slate-900">Chỉnh sửa thẻ công việc</h3>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingTask(null)}
                                className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-200/80 hover:text-slate-700 cursor-pointer transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="editor-title" className="text-xs font-semibold text-slate-700">Tiêu đề thẻ <span className="text-red-500">*</span></Label>
                                <Input
                                    id="editor-title"
                                    value={editorTitle}
                                    onChange={(event) => setEditorTitle(event.target.value)}
                                    className="h-10 text-sm font-medium text-slate-900 bg-white border-slate-200 transition-colors focus-visible:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="editor-description" className="text-xs font-semibold text-slate-700">Mô tả công việc</Label>
                                <textarea
                                    id="editor-description"
                                    value={editorDescription}
                                    onChange={(event) => setEditorDescription(event.target.value)}
                                    className="min-h-[90px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Nhập mô tả chi tiết..."
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-700">Mức độ ưu tiên</Label>
                                    <select
                                        value={editorPriority}
                                        onChange={(event) => setEditorPriority(event.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="LOW">Thấp (LOW)</option>
                                        <option value="MEDIUM">Trung bình (MEDIUM)</option>
                                        <option value="HIGH">Cao (HIGH)</option>
                                        <option value="URGENT">Khẩn cấp (URGENT)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="editor-due-date" className="text-xs font-semibold text-slate-700">Hạn hoàn thành (Deadline)</Label>
                                    <Input
                                        id="editor-due-date"
                                        type="date"
                                        value={editorDueDate}
                                        min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                                        onChange={(event) => setEditorDueDate(event.target.value)}
                                        className="h-10 text-sm font-medium text-slate-900 bg-white border-slate-200 transition-colors focus-visible:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Task Metadata - Created, Updated, Deadline */}
                            <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
                                <div className="grid gap-4 md:grid-cols-3 text-sm">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Ngày tạo</div>
                                        <div className="font-medium text-slate-900">{formatDisplayDate(editingTask?.createdAt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Ngày sửa</div>
                                        <div className="font-medium text-slate-900">{formatDisplayDate(editingTask?.updatedAt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Hạn hoàn thành</div>
                                        <div className="font-medium text-slate-900">{formatDisplayDate(editingTask?.dueDate)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Member Assignment Section */}
                            <div className="space-y-3 rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <UserPlus className="h-4 w-4 text-blue-600" /> Người thực hiện
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowMemberPicker((prev) => !prev)}
                                        className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-all"
                                    >
                                        {showMemberPicker ? 'Đóng chọn' : 'Chọn thành viên'}
                                    </Button>
                                </div>

                                {showMemberPicker && (
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm animate-in fade-in">
                                        <div className="flex flex-wrap gap-2">
                                            {(members ?? []).map((member) => {
                                                const checked = editorAssigneeIds.includes(Number(member.user.id));
                                                return (
                                                    <button
                                                        key={`member-${String(member.user.id)}`}
                                                        type="button"
                                                        onClick={() => setEditorAssigneeIds((prev) => checked ? prev.filter((id) => Number(id) !== Number(member.user.id)) : [...prev, Number(member.user.id)])}
                                                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${checked ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                                            {(member.user.username ?? 'U').charAt(0).toUpperCase()}
                                                        </span>
                                                        {member.user.username}
                                                        {checked && <Check className="h-3 w-3 text-blue-600" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {(editorAssigneeIds.length > 0 || (editingTask.assignees ?? []).length > 0) && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {(members ?? []).filter((member) => editorAssigneeIds.includes(Number(member.user.id))).map((member) => (
                                            <span key={`selected-member-${String(member.user.id)}`} className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                <UserPlus className="h-3 w-3" />
                                                {member.user.username}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Label Picker Section */}
                            <div className="space-y-3 rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <Tag className="h-4 w-4 text-violet-600" /> Nhãn phân loại
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowLabelPicker((prev) => !prev)}
                                        className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 cursor-pointer transition-all"
                                    >
                                        {showLabelPicker ? 'Đóng chọn' : 'Chọn nhãn'}
                                    </Button>
                                </div>

                                {showLabelPicker && (
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm space-y-3 animate-in fade-in">
                                        <div className="flex gap-2">
                                            <Input value={labelName} onChange={(event) => setLabelName(event.target.value)} placeholder="Tên nhãn mới..." className="h-9 text-xs" />
                                            <Input type="color" value={labelColor} onChange={(event) => setLabelColor(event.target.value)} className="h-9 w-12 rounded-lg border border-slate-200 bg-white p-1 cursor-pointer" />
                                            <Button type="button" onClick={editingLabelId ? () => void handleUpdateExistingLabel(editingLabelId) : handleCreateLabel} className="h-9 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer">
                                                {editingLabelId ? 'Lưu' : 'Tạo'}
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {(labels ?? []).map((label) => {
                                                const checked = editorLabelIds.includes(Number(label.id));
                                                return (
                                                    <div
                                                        key={String(label.id)}
                                                        className={`group relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${checked ? 'ring-2 ring-blue-500 text-slate-900' : 'text-slate-700 opacity-80 hover:opacity-100'
                                                            }`}
                                                        style={{ backgroundColor: `${label.color}22`, borderColor: label.color }}
                                                        onClick={() => setEditorLabelIds((prev) => checked ? prev.filter((id) => Number(id) !== Number(label.id)) : [...prev, Number(label.id)])}
                                                    >
                                                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                                                        <span>{label.name}</span>

                                                        {/* X icon to delete label - hidden by default, shown on hover */}
                                                        <button
                                                            type="button"
                                                            className="ml-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-0.5 rounded cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                void handleDeleteLabel(label.id, label.name);
                                                            }}
                                                            title={`Xoá nhãn "${label.name}"`}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {(editorLabelIds.length > 0 || (editingTask.taskLabels ?? []).length > 0) && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {(labels ?? []).filter((label) => editorLabelIds.includes(Number(label.id))).map((label) => (
                                            <span
                                                key={`label-${String(label.id)}`}
                                                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
                                                style={{ backgroundColor: label.color || '#3b82f6' }}
                                            >
                                                {label.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                                className="px-5 font-semibold text-slate-700 border-slate-200 hover:bg-slate-200/80 cursor-pointer transition-colors"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                onClick={() => void handleSaveTask()}
                                className="px-5 bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition-all hover:-translate-y-0.5"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <TaskDetailModal
                task={selectedDetailTask}
                isOpen={!!selectedDetailTask}
                onClose={() => setSelectedDetailTask(null)}
            />
        </div>
    );
}
