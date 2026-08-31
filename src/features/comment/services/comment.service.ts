import { apiRequest } from '@/src/lib/api-client';
import type { CommentItem, CreateCommentPayload, UpdateCommentPayload } from '@/src/features/comment/types/comment.types';

export const commentService = {
    async getCommentsByTask(taskId: string | number): Promise<CommentItem[]> {
        return apiRequest<CommentItem[]>(`/comments?taskId=${encodeURIComponent(String(taskId))}`, { method: 'GET' });
    },

    async createComment(payload: CreateCommentPayload): Promise<CommentItem> {
        return apiRequest<CommentItem>('/comments', {
            method: 'POST',
            body: JSON.stringify({
                taskId: String(payload.taskId),
                content: payload.content,
            }),
        });
    },

    async updateComment(commentId: string | number, payload: UpdateCommentPayload): Promise<CommentItem> {
        return apiRequest<CommentItem>(`/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    async deleteComment(commentId: string | number): Promise<{ message: string }> {
        return apiRequest<{ message: string }>(`/comments/${commentId}`, {
            method: 'DELETE',
        });
    },
};
