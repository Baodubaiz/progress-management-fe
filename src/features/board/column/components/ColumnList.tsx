'use client';

import { useCallback } from 'react';
import { Plus, Trash2, GripVertical, Ellipsis, CirclePlus, History, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActivityList } from '@/src/features/activity/components/ActivityList';
import { useColumnListLogic } from '@/src/features/board/column/hooks/useColumnListLogic';
import { TaskList } from '@/src/features/task/components/TaskList';

export function ColumnList({ boardId, projectId }: { boardId: string; projectId: string }) {
    const {
        columns,
        loading,
        tasksLoading,
        project,
        name,
        setName,
        submitting,
        dragOverColumnId,
        dragOverSide,
        draggingColumnId,
        dragType,
        showActivity,
        setShowActivity,
        tasksByColumn,
        handleCreate,
        handleDelete,
        handleMoveTask,
        handleTaskUpdated,
        handleDropOnColumn,
        handleColumnDragStart,
        handleColumnDrop,
    } = useColumnListLogic(boardId, projectId);

    const getColumnClassName = useCallback((columnId: string) => {
        const isDragOver = dragOverColumnId === columnId;
        const isBeforeIndicator = dragOverSide === 'before' && isDragOver && dragType === 'column';
        const isAfterIndicator = dragOverSide === 'after' && isDragOver && dragType === 'column';
        const isTaskHover = isDragOver && dragType === 'task';

        return {
            container: `relative flex flex-col w-[300px] min-w-[300px] max-h-[calc(100vh-200px)] rounded-2xl border p-3 shadow-sm transition-all duration-200 ${isTaskHover ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30' : 'border-slate-200/90 bg-slate-100/90'} ${draggingColumnId === columnId ? 'opacity-60' : ''}`,
            beforeIndicator: isBeforeIndicator ? 'left-[-2px]' : '',
            afterIndicator: isAfterIndicator ? 'right-[-2px]' : '',
        };
    }, [dragOverColumnId, dragOverSide, dragType, draggingColumnId]);

    return (
        <div className="relative min-h-[calc(100vh-120px)] space-y-4 pb-8">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        {projectId ? `Dự án: Project ${projectId}` : 'Bảng công việc'}
                    </span>
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Bảng Trello
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {project?.userRole === 'OWNER' && (
                        <form onSubmit={handleCreate} className="flex items-center gap-2">
                            <div className="hidden sm:block">
                                <Label htmlFor="new-column" className="sr-only">Tên cột mới</Label>
                                <Input
                                    id="new-column"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Tên cột mới..."
                                    className="h-10 w-52 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 text-sm"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-10 gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 cursor-pointer"
                                disabled={submitting || !name.trim()}
                            >
                                <CirclePlus className="h-4 w-4" />
                                <span>{submitting ? 'Đang thêm...' : 'Thêm cột'}</span>
                            </Button>
                        </form>
                    )}

                    <div className="relative">
                        <Button
                            type="button"
                            onClick={() => setShowActivity((prev) => !prev)}
                            className={`h-10 gap-2 rounded-xl font-semibold shadow-sm transition-all cursor-pointer ${showActivity ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <History className="h-4 w-4" />
                            <span>Lịch sử hoạt động</span>
                        </Button>

                        {showActivity && (
                            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <History className="h-4 w-4 text-blue-600" />
                                        <h3 className="font-bold text-sm">Lịch sử hoạt động</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowActivity(false)}
                                        className="h-7 w-7 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto pr-1">
                                    <ActivityList projectId={projectId} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading || tasksLoading ? (
                <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        Đang tải bảng công việc...
                    </div>
                </div>
            ) : columns.length ? (
                <div className="flex min-h-[70vh] gap-4 overflow-x-auto pb-4 pt-1">
                    {columns.map((column) => {
                        const className = getColumnClassName(String(column.id));

                        return (
                            <div
                                key={String(column.id)}
                                className={className.container}
                                onDragOver={(event) => {
                                    const currentDragType = event.dataTransfer.getData('application/drag-type');
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'move';
                                    if (currentDragType === 'column') {
                                        const rect = event.currentTarget.getBoundingClientRect();
                                        const isBefore = event.clientX < rect.left + rect.width / 2;
                                        setShowActivity(false);
                                        return;
                                    }

                                    if (currentDragType === 'task') {
                                        // no-op: handled via hook logic at drop stage
                                    }
                                }}
                                onDragLeave={(event) => {
                                    const nextTarget = event.relatedTarget as Node | null;
                                    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                                        // leave handled in the drag/drop lifecycle
                                    }
                                }}
                                onDrop={(event) => {
                                    const dragTypeFromTransfer = event.dataTransfer.getData('application/drag-type');
                                    if (dragTypeFromTransfer === 'column') {
                                        void handleColumnDrop(event, column.id);
                                        return;
                                    }
                                    if (dragTypeFromTransfer === 'task') {
                                        void handleDropOnColumn(event, column.id);
                                        return;
                                    }

                                    const draggedColumnIdFromTransfer = event.dataTransfer.getData('application/column-id');
                                    if (draggedColumnIdFromTransfer) {
                                        void handleColumnDrop(event, column.id);
                                        return;
                                    }
                                    void handleDropOnColumn(event, column.id);
                                }}
                            >
                                {(dragOverSide === 'before' && dragOverColumnId === String(column.id) && dragType === 'column') || (dragOverSide === 'after' && dragOverColumnId === String(column.id) && dragType === 'column') ? (
                                    <div className={`pointer-events-none absolute inset-y-2 w-[3px] rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)] ${dragOverSide === 'before' ? 'left-[-2px]' : 'right-[-2px]'}`} />
                                ) : null}

                                <div className="mb-3 flex items-center justify-between gap-2 px-1 pt-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <button
                                            type="button"
                                            draggable
                                            onDragStart={(event) => {
                                                event.stopPropagation();
                                                event.dataTransfer.effectAllowed = 'move';
                                                event.dataTransfer.setData('application/drag-type', 'column');
                                                event.dataTransfer.setData('application/column-id', String(column.id));
                                                handleColumnDragStart(column.id);
                                            }}
                                            onDragEnd={() => {
                                                // hook handles reset internally
                                            }}
                                            className="cursor-grab rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 active:cursor-grabbing shrink-0"
                                            aria-label={`Kéo cột ${column.name}`}
                                        >
                                            <GripVertical className="h-4 w-4" />
                                        </button>
                                        <h3 className="truncate text-sm font-bold text-slate-900">{column.name}</h3>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                            {(tasksByColumn.get(String(column.id)) ?? []).length}
                                        </span>
                                        {project?.userRole === 'OWNER' && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                onClick={() => void handleDelete(column.id)}
                                                aria-label={`Xoá cột ${column.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <TaskList
                                    columnId={String(column.id)}
                                    projectId={projectId}
                                    tasks={tasksByColumn.get(String(column.id)) ?? []}
                                    onMoveTask={handleMoveTask}
                                    onTaskUpdated={handleTaskUpdated}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
                    <p className="text-sm font-medium text-slate-500">Chưa có cột nào trong bảng này.</p>
                </div>
            )}
        </div>
    );
}
