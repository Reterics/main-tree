import React, { useEffect, useMemo, useState } from 'react';
import DataTable, { Column, RowAction } from './common/DataTable';
import Modal from './common/Modal';
import formService, { FormDef } from '../services/FormService';
import { EditIcon, PreviewIcon, DuplicateIcon, DeleteIcon, PlusIcon, CloseIcon, CopyIcon } from './common/Icons';
import { FormEditor } from './forms/FormEditor';

// Small helper
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const t = document.createElement('textarea');
    t.value = text;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(t);
    return true;
  }
}

export const FormsComponent: React.FC = () => {
  // Routing inside Forms: list vs editor
  const [subroute, setSubroute] = useState<string>(() => (location.hash.substring(1) || 'forms'));
  useEffect(() => {
    const onHash = () => setSubroute(location.hash.substring(1) || 'forms');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Listing state
  const [forms, setForms] = useState<FormDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [previewForm, setPreviewForm] = useState<FormDef | null>(null);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  // Load list
  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.list();
      setForms(data);
    } catch (e) {
      setError('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Actions
  const onEdit = (row: FormDef) => {
    location.hash = `forms/edit/${encodeURIComponent(row.id)}`;
  };
  const onPreview = (row: FormDef) => setPreviewForm(row);
  const onDuplicate = async (row: FormDef) => {
    try {
      setBusyActionId(row.id);
      const dup = await formService.duplicate(row.id);
      if (dup) setForms(prev => [dup, ...prev]);
    } finally {
      setBusyActionId(null);
    }
  };
  const onDelete = async (row: FormDef) => {
    if (!confirm(`Delete form "${row.name}"?`)) return;
    try {
      setBusyActionId(row.id);
      const ok = await formService.remove(row.id);
      if (ok) setForms(prev => prev.filter(f => f.id !== row.id));
    } finally {
      setBusyActionId(null);
    }
  };


  // Table columns & actions
  const columns: Column<FormDef>[] = useMemo(() => ([
    { key: 'name', header: 'Name', align: 'left', render: (r) => (
      <div className="font-medium text-gray-900">{r.name}</div>
    )},
    { key: 'fieldsCount', header: 'Fields', align: 'center', width: '80px', render: (r) => (
      <span>{r.fields?.length || 0}</span>
    )},
    { key: 'shortcode', header: 'Shortcode', render: (r) => (
      <div className="flex items-center gap-2">
        <code className="text-xs bg-gray-50 text-gray-800 rounded px-2 py-1 border border-gray-200">[mt_form id="{r.id}"]</code>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => copyToClipboard(`[mt_form id="${r.id}"]`)}
          title="Copy shortcode"
          aria-label="Copy shortcode"
        >
          <CopyIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </button>
      </div>
    )},
  ]), []);

  const actions: RowAction<FormDef>[] = useMemo(() => ([
    { key: 'edit', label: 'Edit', icon: <EditIcon className="h-4 w-4" />, onAction: onEdit, intent: 'primary' },
    { key: 'preview', label: 'Preview', icon: <PreviewIcon className="h-4 w-4" />, onAction: onPreview },
    { key: 'duplicate', label: 'Duplicate', icon: <DuplicateIcon className="h-4 w-4" />, onAction: onDuplicate, disabled: (r) => busyActionId === r.id },
    { key: 'delete', label: 'Delete', icon: <DeleteIcon className="h-4 w-4" />, onAction: onDelete, intent: 'danger', disabled: (r) => busyActionId === r.id },
  ]), [busyActionId]);

  // Route matching: forms, forms/new, forms/edit/:id
  const editorNew = subroute === 'forms/new';
  const editMatch = subroute.match(/^forms\/edit\/(.+)$/);
  if (editorNew || editMatch) {
    const id = editMatch ? decodeURIComponent(editMatch[1]) : undefined;
    return (
      <div className="w-full">
        <FormEditor
          id={id}
          onSaved={(form) => {
            // refresh list in background and stay in editor
            loadForms();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Forms</h3>
        <p className="text-sm text-gray-600">Create simple forms and use them via shortcode.</p>
      </div>

      {/* Header + Add New button */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium text-gray-900">Forms List</h4>
            <p className="text-sm text-gray-600">Manage and embed forms via shortcode.</p>
          </div>
          <div>
            <button
              onClick={() => (location.hash = 'forms/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forms list via DataTable */}
      <div className="mt-4 max-w-5xl">
        <DataTable<FormDef>
          columns={columns}
          data={forms}
          rowKey={(r) => r.id}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No forms yet. Create one above."
        />
      </div>

      {/* Preview Modal */}
      <Modal open={!!previewForm} onClose={() => setPreviewForm(null)} title={previewForm ? `Preview: ${previewForm.name}` : 'Preview'} widthClass="max-w-xl">
        {previewForm && (
          <div className="space-y-3">
            {previewForm.fields?.map((field, i) => {
              const req = !!field.required;
              return (
                <div key={i} className="flex flex-col text-sm">
                  <label className="text-gray-800 mb-1">
                    <span>{field.label}{req ? ' *' : ''}</span>
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea className="border rounded px-2 py-1" placeholder={field.label} />
                  ) : (
                    <input className="border rounded px-2 py-1" type={field.type === 'email' ? 'email' : 'text'} placeholder={field.label} />
                  )}
                </div>
              );
            })}
            <div>
              <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-gray-800 text-white" onClick={() => setPreviewForm(null)}>
                            <CloseIcon className="h-4 w-4" />
                            <span>Close</span>
                          </button>
            </div>
          </div>
        )}
      </Modal>


      <div className="bg-white/60 border border-gray-200 rounded-lg p-4 sm:p-6 mt-4 max-w-5xl">
        <p className="text-xs text-gray-600">
          Submission handling is minimal in this MVP. Forms render with standard HTML inputs. You can enhance handling later.
        </p>
      </div>
    </div>
  );
};
