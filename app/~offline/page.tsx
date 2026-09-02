import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12 text-slate-900">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-blue-100/60">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <WifiOff className="h-7 w-7" aria-hidden="true" />
                </div>
                <h1 className="text-xl font-bold">Bạn đang ngoại tuyến</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Hãy kiểm tra kết nối mạng rồi thử lại. Những trang bạn đã mở trước đó có thể vẫn xem được.
                </p>
                <Link
                    href="/"
                    className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Thử lại
                </Link>
            </section>
        </main>
    );
}
