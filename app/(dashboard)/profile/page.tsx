import { AppShell } from '@/components/layout/app-shell';
import { UserProfile } from '@/src/features/user/components/UserProfile';

export default function ProfilePage() {
    return (
        <AppShell title="Profile" description="Thông tin cá nhân và cài đặt tài khoản">
            <UserProfile />
        </AppShell>
    );
}
