import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Progress Management',
        short_name: 'Trello',
        description: 'Quản lý dự án và cộng tác nhóm.',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/icons/pwa-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/icons/pwa-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'maskable',
            },
        ],
    };
}
