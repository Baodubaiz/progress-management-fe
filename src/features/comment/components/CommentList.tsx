'use client';

import { useEffect, useState } from 'react';
import { MessageSquareText, Send, Trash2, PencilLine, Check, X, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComments } from '@/src/features/comment/hooks/useComments';
import { useToast } from '@/src/providers/toast-context';
import { getStoredUser } from '@/src/lib/auth';
import type { AuthUser } from '@/src/features/auth/types/auth.types';

export function CommentList({ taskId }: { taskId: string }) {
    const { comments, loading, error, fetchComments, createComment, updateComment, deleteComment } = useComments(taskId);
    const { showToast } = useToast();
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        void fetchComments();
        setCurrentUser(getStoredUser());
    }, [fetchComments]);

    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error, showToast]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        const created = await createComment({ taskId, content: content.trim() });
        if (created) {
            setContent('');
        }
        setSubmitting(false);
    };

    const handleStartEdit = (commentId: string | number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (commentId: string | number) => {
        if (!editContent.trim()) return;
        setUpdating(true);
        const updated = await updateComment(commentId, { content: editContent.trim() });
        setUpdating(false);
        if (updated) {
            setEditingCommentId(null);
            setEditContent('');
            showToast('Đã cập nhật bình luận', 'success');
        }
    };

    const handleDelete = async (commentId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá bình luận này không?')) return;
        await deleteComment(commentId);
    };

    const checkIsOwner = (commentUserId?: string | number, commentUserObj?: { id?: string | number; username?: string }) => {
        if (!currentUser) return false;

        const currentId = String(currentUser.id ?? '').trim();
        const commentId1 = String(commentUserId ?? '').trim();
        const commentId2 = String(commentUserObj?.id ?? '').trim();

        if (currentId && currentId !== 'undefined' && currentId !== 'null') {
            if (commentId1 && currentId === commentId1) return true;
            if (commentId2 && currentId === commentId2) return true;
        }

        const currentName = String(currentUser.username ?? '').trim().toLowerCase();
        const commentName = String(commentUserObj?.username ?? '').trim().toLowerCase();

        if (currentName && commentName && currentName === commentName) {
            return true;
        }

        return false;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
                <MessageSquareText className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-bold">Bình luận ({comments.length})</h3>
            </div>

            {/* Create Comment Form */}
            <form onSubmit={handleCreate} className="space-y-2">
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        className="gap-2 bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer" 
                        disabled={submitting || !content.trim()}
                    >
                        <Send className="h-4 w-4" />
                        {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            {loading && !comments.length ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">Đang tải bình luận...</div>
            ) : comments.length ? (
                <div className="space-y-3">
                    {comments.map((comment) => {
                        const isOwner = checkIsOwner(comment.userId, comment.user);
                        const isEditing = String(editingCommentId) === String(comment.id);

                        return (
                            <Card key={String(comment.id)} className="border-slate-200/90 bg-white shadow-sm transition-all hover:border-slate-300">
                                <CardHeader className="pb-2 pt-3.5 px-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xs font-bold text-slate-900">
                                                    {comment.user?.username || 'Thành viên'}
                                                </CardTitle>
                                                {comment.createdAt && (
                                                    <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons ONLY for comment owner */}
                                        {isOwner && !isEditing && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                                    onClick={() => handleStartEdit(comment.id, comment.content)}
                                                    title="Chỉnh sửa bình luận"
                                                >
                                                    <PencilLine className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                    onClick={() => handleDelete(comment.id)}
                                                    title="Xoá bình luận"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-3 pt-1 px-4 text-xs leading-relaxed text-slate-700">
                                    {isEditing ? (
                                        <div className="space-y-2 pt-1">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="min-h-16 w-full rounded-lg border border-blue-500 bg-white p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelEdit}
                                                    className="h-7 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" /> Hủy
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleSaveEdit(comment.id)}
                                                    disabled={updating || !editContent.trim()}
                                                    className="h-7 text-xs bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer"
                                                >
                                                    <Check className="h-3.5 w-3.5 mr-1" /> {updating ? 'Lưu...' : 'Lưu'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{comment.content}</p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs text-slate-500">
                    Chưa có bình luận nào cho thẻ này. Hãy là người đầu tiên bình luận!
                </div>
            )}
        </div>
    );
}
