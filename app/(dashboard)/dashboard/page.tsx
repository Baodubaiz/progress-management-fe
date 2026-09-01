import { AppShell } from '@/components/layout/app-shell';
import { DashboardOverview } from '@/src/features/dashboard/components/DashboardOverview';

export default function DashboardPage() {
    return (
        <AppShell title="Dashboard" description="Tổng quan hoạt động và tiến độ của bạn">
            <DashboardOverview />
        </AppShell>
    );
}
