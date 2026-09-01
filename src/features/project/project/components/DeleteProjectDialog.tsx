import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    projectName: string;
    onConfirm: () => Promise<void>;
    deleting: boolean;
}

export function DeleteProjectDialog({ isOpen, onClose, projectName, onConfirm, deleting }: DeleteProjectDialogProps) {
    if (!isOpen) return null;

    const handleClose = () => {
        if (!deleting) onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in" role="alertdialog" aria-modal="true" aria-labelledby="delete-project-title" onMouseDown={handleClose}>
            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.24)] transition-all duration-300 animate-in zoom-in-95" onMouseDown={(event) => event.stopPropagation()}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
                    <Trash2 className="h-6 w-6" />
                </div>
                <h2 id="delete-project-title" className="text-xl font-bold text-slate-900">Xoá dự án này?</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Thao tác này sẽ xoá dự án <strong className="text-slate-900">{projectName}</strong> và tất cả các bảng, thẻ bên trong. Hành động này không thể hoàn tác.
                </p>
                <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                    <Button type="button" variant="outline" onClick={handleClose} disabled={deleting} className="px-5 hover:bg-slate-50 transition-colors">
                        Hủy
                    </Button>
                    <Button variant="destructive" className="gap-2 px-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:hover:translate-y-0" onClick={onConfirm} disabled={deleting}>
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Đang xoá...' : 'Xoá dự án'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

