import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  className?: string;
  // If true, clicking on the backdrop will close the modal
  dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}

// Lightweight modal using Tailwind classes. Includes basic focus management and ESC to close.
export const Modal: React.FC<ModalProps> = ({ open, onClose, titleId, className = '', dismissOnBackdrop = true, children }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveEl = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActiveEl.current = document.activeElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    // Focus first focusable element inside dialog on next tick
    const t = setTimeout(() => {
      const el = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      if (lastActiveEl.current instanceof HTMLElement) {
        lastActiveEl.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => { if (dismissOnBackdrop) onClose(); }}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={
          `relative z-10 max-w-lg w-full mx-4 rounded-lg border border-gray-200 bg-white shadow-lg ${className}`
        }
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
