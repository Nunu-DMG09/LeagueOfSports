import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'gold';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Sí, eliminar',
  confirmVariant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmStyles =
    confirmVariant === 'gold'
      ? 'bg-gradient-to-r from-[#c8aa6e] to-[#a88a4e] text-[#0a0a0c] hover:shadow-[0_0_20px_rgba(200,170,110,0.4)]'
      : 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]/85 backdrop-blur-md p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#ef4444]/30 bg-[#121418] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Línea superior degradada */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-800/80 bg-gradient-to-b from-[#1a1c23]/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 shadow-[0_0_15px_rgba(239,68,68,0.15)] shrink-0">
              <AlertTriangle size={20} className="text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-gray-700 p-2 rounded-lg transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <p className="text-sm sm:text-base text-[#a0aec0] leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-5 sm:p-6 pt-0 border-t border-gray-800/60 mt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-gray-700 bg-[#0a0a0c]/60 px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`group/confirm relative w-full sm:w-auto overflow-hidden rounded-lg px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 ${confirmStyles}`}
          >
            <span className="relative z-10">{confirmLabel}</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg bg-white opacity-20 transition-all duration-300 group-hover/confirm:scale-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
