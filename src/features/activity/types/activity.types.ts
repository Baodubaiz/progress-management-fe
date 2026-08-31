export type ActivityAction =
    | 'TASK_CREATED'
    | 'TASK_UPDATED'
    | 'TASK_DELETED'
    | 'TASK_MOVED'
    | 'COMMENT_ADDED'
    | 'COMMENT_UPDATED'
    | 'COMMENT_DELETED'
    | 'BOARD_CREATED'
    | 'COLUMN_CREATED'
    | 'LABEL_CREATED';

export type ActivityUser = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
};

export type ActivityTask = {
    id: string | number;
    title: string;
};

export type ActivityItem = {
    id: string | number;
    projectId: string | number;
    taskId?: string | number | null;
    userId: string | number;
    action: ActivityAction;
    newValue?: string | null;
    createdAt?: string;
    user: ActivityUser;
    task?: ActivityTask | null;
};
