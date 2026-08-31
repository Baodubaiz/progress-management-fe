'use client';

import { useCallback, useState } from 'react';

import { commentService } from '@/src/features/comment/services/comment.service';
import type { CommentItem, CreateCommentPayload, UpdateCommentPayload } from '@/src/features/comment/types/comment.types';

export function useComments(taskId: string | number) {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await commentService.getCommentsByTask(taskId);
            setComments(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải bình luận';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    const createComment = useCallback(async (payload: CreateCommentPayload) => {
        setLoading(true);
        setError('');

        try {
            const created = await commentService.createComment(payload);
            setComments((prev) => [...prev, created]);
            return created;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo bình luận';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateComment = useCallback(async (commentId: string | number, payload: UpdateCommentPayload) => {
        setLoading(true);
        setError('');

        try {
            const updated = await commentService.updateComment(commentId, payload);
            setComments((prev) => prev.map((comment) => String(comment.id) === String(commentId) ? { ...comment, ...updated } : comment));
            return updated;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật bình luận';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteComment = useCallback(async (commentId: string | number) => {
        setLoading(true);
        setError('');

        try {
            const result = await commentService.deleteComment(commentId);
            setComments((prev) => prev.filter((comment) => String(comment.id) !== String(commentId)));
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xoá bình luận';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        comments,
        loading,
        error,
        fetchComments,
        createComment,
        updateComment,
        deleteComment,
    };
}
