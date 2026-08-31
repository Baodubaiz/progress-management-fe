import { API_BASE, clearAuthState, getStoredAccessToken, saveAuthState } from '@/src/lib/auth';

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE}/auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    clearAuthState();
                    throw new Error(result?.message || 'Session expired');
                }

                const payload = result?.data ?? result;

                if (payload?.accessToken) {
                    saveAuthState(payload);
                    return payload.accessToken;
                }

                clearAuthState();
                return null;
            } catch (error) {
                clearAuthState();
                throw error;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retry = false): Promise<T> {
    const token = getStoredAccessToken();
    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    const result = await response.json().catch(() => ({}));

    if (response.status === 401 && !retry && endpoint !== '/auth/refresh-token') {
        try {
            const newToken = await refreshAccessToken();
            if (newToken) {
                const retryHeaders = new Headers(options.headers || {});

                if (!(options.body instanceof FormData) && !retryHeaders.has('Content-Type')) {
                    retryHeaders.set('Content-Type', 'application/json');
                }

                retryHeaders.set('Authorization', `Bearer ${newToken}`);

                return apiRequest<T>(endpoint, {
                    ...options,
                    headers: retryHeaders,
                }, true);
            }
        } catch {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
    }

    if (!response.ok) {
        throw new Error(result?.message || 'Request failed');
    }

    return (result?.data ?? result) as T;
}
