export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskUser = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
};

export type TaskLabel = {
    id: string | number;
    name: string;
    color?: string;
    description?: string | null;
};

export type TaskAssignee = {
    id: string | number;
    userId: string | number;
    taskId: string | number;
    user: TaskUser;
};

export type TaskListItem = {
    id: string | number;
    columnId: string | number;
    title: string;
    description?: string | null;
    priority: TaskPriority;
    dueDate?: string | null;
    position?: string | number;
    createdBy?: string | number;
    createdAt?: string;
    updatedAt?: string;
    creator?: TaskUser;
    assignees?: TaskAssignee[];
    taskLabels?: Array<{ id: string | number; label: TaskLabel }>;
    _count?: {
        comments?: number;
    };
};

export type CreateTaskPayload = {
    columnId: string | number;
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    dueDate?: string | null;
    assigneeIds?: Array<string | number>;
    labelIds?: Array<string | number>;
};

export type UpdateTaskPayload = {
    title?: string;
    description?: string | null;
    priority?: TaskPriority;
    dueDate?: string | null;
    assigneeIds?: Array<string | number>;
    labelIds?: Array<string | number>;
};

export type MoveTaskPayload = {
    columnId?: string | number;
    prevPosition?: string | number | null;
    nextPosition?: string | number | null;
    targetPosition?: string | number | null;
};
