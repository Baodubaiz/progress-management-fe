export type CommentUser = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
};

export type CommentItem = {
    id: string | number;
    taskId: string | number;
    userId: string | number;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    user: CommentUser;
};

export type CreateCommentPayload = {
    taskId: string | number;
    content: string;
};

export type UpdateCommentPayload = {
    content: string;
};
