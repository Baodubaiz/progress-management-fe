import { AppShell } from '@/components/layout/app-shell';
import { ProjectList } from '@/src/features/project/project/components/ProjectList';

export default function ProjectsPage() {
    return (
        <AppShell title="Dashboard" description="Tổng quan hoạt động và tiến độ của bạn">
            <ProjectList />
        </AppShell>
    );
}
