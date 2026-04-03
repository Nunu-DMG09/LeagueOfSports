import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-ls-danger/30 bg-ls-surface p-6 shadow-2xl">
        <div className="flex items-center gap-4 text-ls-danger mb-4">
          <AlertTriangle size={32} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="rounded border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="rounded bg-ls-danger px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}