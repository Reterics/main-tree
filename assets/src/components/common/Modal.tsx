import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

/* ═══════════════════════════════════════════════════════════════════════════
   MT MODAL COMPONENTS - Scoped, conflict-free
   Uses mt-modal-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  dismissOnBackdrop?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  titleId,
  dismissOnBackdrop = true,
  showCloseButton = true,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveEl = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  const generatedTitleId = titleId || `modal-title-${Math.random().toString(36).substr(2, 9)}`;

  // Keep onClose ref updated without triggering effects
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle focus and keyboard events - only runs when open changes
  useEffect(() => {
    if (!open) return;
    lastActiveEl.current = document.activeElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', onKey);

    // Focus first input element, not the close button
    const t = setTimeout(() => {
      const el = dialogRef.current?.querySelector<HTMLElement>(
        'input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || dialogRef.current?.querySelector<HTMLElement>('button, [href]');
      el?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      if (lastActiveEl.current instanceof HTMLElement) {
        lastActiveEl.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="mt-modal-backdrop" onClick={() => { if (dismissOnBackdrop) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? generatedTitleId : titleId}
        className="mt-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mt-modal-header">
            <h3 id={generatedTitleId} className="mt-modal-title">{title}</h3>
            {showCloseButton && (
              <button type="button" onClick={onClose} className="mt-btn mt-btn-ghost" aria-label="Close">
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL BODY & FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-modal-body ${className}`.trim()}>{children}</div>;

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-modal-footer ${className}`.trim()}>{children}</div>;

export default Modal;
