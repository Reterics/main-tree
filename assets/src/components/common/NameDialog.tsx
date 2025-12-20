import React from 'react';
import Modal, { ModalBody, ModalFooter } from './Modal';
import { PlusIcon } from './Icons';
import { Button } from './Button';
import { Input, FormField } from './Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT NAME DIALOG - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

interface NameDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  name: string;
  setName: (v: string) => void;
  error?: string | null;
  creating?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export const NameDialog: React.FC<NameDialogProps> = ({
  open,
  title = 'Create',
  description,
  name,
  setName,
  error,
  creating = false,
  onCancel,
  onConfirm,
  confirmLabel = 'Create'
}) => {
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <ModalBody>
        {description && <p style={{ fontSize: 11, color: 'var(--mt-text-muted)', marginBottom: 10 }}>{description}</p>}
        <FormField label="Name" error={error || undefined}>
          <Input
            id="name-dialog-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Enter a name..."
            autoFocus
          />
        </FormField>
      </ModalBody>
      <ModalFooter>
        <Button variant="default" size="sm" onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={creating || !name.trim()}
          icon={<PlusIcon />}
        >
          {creating ? 'Creating...' : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NameDialog;
