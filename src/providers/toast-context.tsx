'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
};

type ToastContextType = {
    toasts: ToastItem[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'error', duration = 3000) => {
        const id = `${Date.now()}-${Math.random()}`;

        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            const timer = setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);

            return () => clearTimeout(timer);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}

            {/* Toast Container */}
            <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex max-h-screen flex-col gap-3 overflow-hidden">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${toast.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : toast.type === 'error'
                                    ? 'border-red-200 bg-red-50 text-red-800'
                                    : toast.type === 'warning'
                                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                                        : 'border-blue-200 bg-blue-50 text-blue-800'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto flex-shrink-0 text-current opacity-50 hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return context;
}
