import { AppShell } from '@/components/layout/app-shell';
import { BoardList } from '@/src/features/board/board/components/BoardList';

export default async function ProjectBoardsPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    return (
        <AppShell title="Boards" description="Quản lý board và luồng công việc của dự án">
            <BoardList projectId={projectId} />
        </AppShell>
    );
}
