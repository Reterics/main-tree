import React, { useEffect, useMemo, useState } from 'react';
import DataTable, { Column, RowAction } from './common/DataTable';
import Modal, { ModalBody, ModalFooter } from './common/Modal';
import formService, { FormDef } from '../services/FormService';
import { EditIcon, PreviewIcon, DuplicateIcon, DeleteIcon, PlusIcon, CopyIcon } from './common/Icons';
import { FormEditor } from './forms/FormEditor';
import { Button } from './common/Button';
import { Card, CardBody, Badge, Input, Textarea, FormField, PageHeader } from './common/Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT FORMS - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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
  const [subroute, setSubroute] = useState<string>(() => (location.hash.substring(1) || 'forms'));
  useEffect(() => {
    const onHash = () => setSubroute(location.hash.substring(1) || 'forms');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [forms, setForms] = useState<FormDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<FormDef | null>(null);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

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

  const columns: Column<FormDef>[] = useMemo(() => ([
    { key: 'name', header: 'Name', align: 'left', render: (r) => (
      <span style={{ fontWeight: 500, color: 'var(--mt-text)' }}>{r.name}</span>
    )},
    { key: 'fieldsCount', header: 'Fields', align: 'center', width: '60px', render: (r) => (
      <Badge>{r.fields?.length || 0}</Badge>
    )},
    { key: 'shortcode', header: 'Shortcode', render: (r) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <code className="mt-code">[mt_form id="{r.id}"]</code>
        <Button
          variant="ghost"
          size="sm"
          icon={<CopyIcon />}
          onClick={() => copyToClipboard(`[mt_form id="${r.id}"]`)}
          aria-label="Copy shortcode"
        />
      </span>
    )},
  ]), []);

  const actions: RowAction<FormDef>[] = useMemo(() => ([
    { key: 'edit', label: 'Edit', icon: <EditIcon />, onAction: onEdit, intent: 'primary' },
    { key: 'preview', label: 'Preview', icon: <PreviewIcon />, onAction: onPreview },
    { key: 'duplicate', label: 'Duplicate', icon: <DuplicateIcon />, onAction: onDuplicate, disabled: (r) => busyActionId === r.id },
    { key: 'delete', label: 'Delete', icon: <DeleteIcon />, onAction: onDelete, intent: 'danger', disabled: (r) => busyActionId === r.id },
  ]), [busyActionId]);

  const editorNew = subroute === 'forms/new';
  const editMatch = subroute.match(/^forms\/edit\/(.+)$/);
  if (editorNew || editMatch) {
    const id = editMatch ? decodeURIComponent(editMatch[1]) : undefined;
    return <FormEditor id={id} onSaved={() => loadForms()} />;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader
        title="Forms"
        subtitle="Create and manage forms with shortcode embedding"
        actions={
          <Button variant="primary" size="sm" icon={<PlusIcon />} onClick={() => (location.hash = 'forms/new')}>
            Add Form
          </Button>
        }
      />

      <DataTable<FormDef>
        columns={columns}
        data={forms}
        rowKey={(r) => r.id}
        actions={actions}
        loading={loading}
        error={error}
        emptyMessage="No forms yet. Create your first form to get started."
      />

      <Card style={{ marginTop: 12 }}>
        <CardBody>
          <p style={{ fontSize: 11, color: 'var(--mt-text-muted)', margin: 0 }}>
            Embed forms using the shortcode in any post or page. Forms submit via AJAX and trigger configured email actions.
          </p>
        </CardBody>
      </Card>

      {/* Preview Modal */}
      <Modal open={!!previewForm} onClose={() => setPreviewForm(null)} title={previewForm?.name ? `Preview: ${previewForm.name}` : 'Preview'}>
        <ModalBody>
          {previewForm && (
            <div>
              {previewForm.fields?.map((field, i) => (
                <FormField key={i} label={field.label} required={field.required}>
                  {field.type === 'textarea' ? (
                    <Textarea placeholder={field.label} disabled />
                  ) : (
                    <Input type={field.type === 'email' ? 'email' : 'text'} placeholder={field.label} disabled />
                  )}
                </FormField>
              ))}
              {(!previewForm.fields || previewForm.fields.length === 0) && (
                <p style={{ fontSize: 11, color: 'var(--mt-text-muted)' }}>This form has no fields yet.</p>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="default" size="sm" onClick={() => setPreviewForm(null)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
