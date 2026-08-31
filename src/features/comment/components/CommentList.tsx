'use client';

import { useEffect, useState } from 'react';
import { MessageSquareText, Send, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComments } from '@/src/features/comment/hooks/useComments';

export function CommentList({ taskId }: { taskId: string }) {
    const { comments, loading, error, fetchComments, createComment, deleteComment } = useComments(taskId);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void fetchComments();
    }, [fetchComments]);

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

    const handleDelete = async (commentId: string | number) => {
        if (!window.confirm('Bạn có chắc muốn xoá bình luận này không?')) return;
        await deleteComment(commentId);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
                <MessageSquareText className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold">Bình luận</h3>
            </div>

            <form onSubmit={handleCreate} className="flex gap-2">
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Viết bình luận..."
                    className="min-h-24 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
                <Button type="submit" className="gap-2 self-end" disabled={submitting || !content.trim()}>
                    <Send className="h-4 w-4" />
                    {submitting ? '...' : 'Gửi'}
                </Button>
            </form>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải bình luận...</div>
            ) : comments.length ? (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <Card key={String(comment.id)} className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm text-slate-900">{comment.user?.username || 'User'}</CardTitle>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                                        onClick={() => handleDelete(comment.id)}
                                        aria-label={`Xoá bình luận ${comment.id}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm text-slate-600">
                                {comment.content}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Chưa có bình luận nào cho task này.
                </div>
            )}
        </div>
    );
}
