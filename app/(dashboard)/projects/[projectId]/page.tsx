import { AppShell } from '@/components/layout/app-shell';
import { ProjectDetailView } from '@/src/features/project/project/components/ProjectDetailView';

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    return (
        <AppShell title="Chi tiết dự án" description="Thông tin dự án, thành viên và board liên quan">
            <ProjectDetailView projectId={projectId} />
        </AppShell>
    );
}
