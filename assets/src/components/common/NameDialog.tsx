import React from 'react';
import Modal from './Modal';
import { CloseIcon, PlusIcon } from './Icons';

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
  const titleId = 'name-dialog-title';

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <Modal open={open} onClose={onCancel} titleId={titleId}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" className="p-1 text-gray-500 hover:text-gray-700" onClick={onCancel} aria-label="Close">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}

        <label className="block mt-4 text-sm">
          <span className="text-gray-700">Name</span>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Welcome Email"
          />
        </label>
        {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}

        <div className="mt-4 flex items-center gap-2 justify-end">
          <button type="button" className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={onCancel}>Cancel</button>
          <button type="button" disabled={creating} onClick={onConfirm} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-60">
            <PlusIcon className="h-4 w-4" />
            {creating ? 'Creating…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NameDialog;
