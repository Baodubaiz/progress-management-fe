import { AppShell } from '@/components/layout/app-shell';
import { ProjectDetailView } from '@/src/features/project/project/components/ProjectDetailView';

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    return (
        <AppShell title="Project detail" description="Thông tin dự án, members và board liên quan">
            <ProjectDetailView projectId={projectId} />
        </AppShell>
    );
}
