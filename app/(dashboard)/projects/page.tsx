import { AppShell } from '@/components/layout/app-shell';
import { ProjectList } from '@/src/features/project/project/components/ProjectList';

export default function ProjectsPage() {
    return (
        <AppShell title="Dự án" description="Theo dõi các workspace và tiến độ cộng tác của bạn">
            <ProjectList />
        </AppShell>
    );
}
