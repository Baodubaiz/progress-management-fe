import { AppShell } from '@/components/layout/app-shell';
import { ColumnList } from '@/src/features/board/column/components/ColumnList';

export default async function BoardDetailPage({
    params,
}: {
    params: Promise<{ projectId: string; boardId: string }>;
}) {
    const { projectId, boardId } = await params;

    return (
        <AppShell
            title="Board detail"
            description="Theo dõi và quản lý các cột trong board"
        >
            <ColumnList boardId={boardId} projectId={projectId} />
        </AppShell>
    );
}
