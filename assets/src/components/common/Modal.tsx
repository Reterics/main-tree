import React, { useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string; // e.g., 'max-w-2xl'
}

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, widthClass = 'max-w-2xl' }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label={title} className={`relative bg-white rounded-lg shadow-lg border border-gray-200 w-full ${widthClass} mx-4`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <button type="button" onClick={onClose} className="inline-flex items-center px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Close" title="Close">✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
