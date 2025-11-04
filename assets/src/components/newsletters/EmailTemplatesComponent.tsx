import React, { useEffect, useMemo, useState } from 'react';
import DataTable, { Column, RowAction } from '../common/DataTable';
import emailTemplatesService, { EmailTemplate } from '../../services/EmailTemplatesService';
import { EditIcon, DuplicateIcon, DeleteIcon, PlusIcon } from '../common/Icons';
import NameDialog from '../common/NameDialog';
import { EmailTemplateEditor } from './EmailTemplateEditor';
import { adminUrl } from '../../utils/wp';

export const EmailTemplatesComponent: React.FC = () => {
  const [subroute, setSubroute] = useState<string>(() => (location.hash.substring(1) || 'newsletters/templates'));
  useEffect(() => {
    const onHash = () => setSubroute(location.hash.substring(1) || 'newsletters/templates');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // New-template creation state
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorNew, setErrorNew] = useState<string | null>(null);
  const [showElDialog, setShowElDialog] = useState(false);

  // Reset creation state when leaving the /new route
  useEffect(() => {
    if (!subroute.startsWith('newsletters/templates/new')) {
      setNewName('');
      setErrorNew(null);
      setCreating(false);
    }
  }, [subroute]);

  const createElementorAndEmail = async (): Promise<boolean> => {
    if (!newName.trim()) { setErrorNew('Please enter a name.'); return false; }
    try {
      setCreating(true); setErrorNew(null);
      const createdEl = await emailTemplatesService.createElementorTemplate(newName.trim());
      if (!createdEl) { setErrorNew('Failed to create Elementor template'); setCreating(false); return false; }
      await emailTemplatesService.create({
        name: newName.trim(),
        source_type: 'elementor' as any,
        elementor_template_id: createdEl.id,
        subject: '', preheader: '', from_name: '', from_email: '', reply_to: '', html: ''
      });
      if (createdEl.edit_url) {
        window.open(createdEl.edit_url, '_blank', 'noopener,noreferrer');
      }
      // Return to list route
      location.hash = 'newsletters/templates';
      return true;
    } catch (e) {
      setErrorNew('Failed to create');
      return false;
    } finally {
      setCreating(false);
    }
  };

  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailTemplatesService.list();
      setItems(data);
    } catch(e) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onEdit = (row: EmailTemplate) => {
    if (row.source_type === 'elementor' && row.elementor_template_id) {
      const url = adminUrl(`post.php?post=${row.elementor_template_id}&action=elementor`);
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    location.hash = `newsletters/templates/edit/${row.id}`;
  };
  const onDuplicate = async (row: EmailTemplate) => {
    try {
      setBusyId(row.id);
      const dup = await emailTemplatesService.duplicate(row.id);
      if (dup) setItems(prev => [dup, ...prev]);
    } finally {
      setBusyId(null);
    }
  };
  const onDelete = async (row: EmailTemplate) => {
    if (!confirm(`Delete template "${row.name}"?`)) return;
    try {
      setBusyId(row.id);
      const ok = await emailTemplatesService.remove(row.id);
      if (ok) setItems(prev => prev.filter(f => f.id !== row.id));
    } finally {
      setBusyId(null);
    }
  };

  const columns: Column<EmailTemplate>[] = useMemo(() => ([
    { key: 'name', header: 'Name', render: (r) => <div className="font-medium text-gray-900">{r.name}</div> },
    { key: 'subject', header: 'Subject', render: (r) => <span className="text-gray-700">{r.subject}</span> },
    { key: 'source', header: 'Source', width: '120px', align: 'center', render: (r) => (
      <span className="inline-block text-xs px-2 py-0.5 rounded border" title={r.source_type}>
        {r.source_type === 'elementor' ? 'Elementor' : 'HTML'}
      </span>
    )},
    { key: 'updated', header: 'Updated', width: '160px', align: 'center', render: (r) => (
      <span className="text-gray-500 text-xs">{r.updated_at || '-'}</span>
    )},
  ]), []);

  const actions: RowAction<EmailTemplate>[] = useMemo(() => ([
    { key: 'edit', label: 'Edit', icon: <EditIcon className="h-4 w-4" />, onAction: onEdit },
    { key: 'duplicate', label: 'Duplicate', icon: <DuplicateIcon className="h-4 w-4" />, onAction: onDuplicate, disabled: (r)=>busyId===r.id },
    { key: 'delete', label: 'Delete', icon: <DeleteIcon className="h-4 w-4" />, intent: 'danger', onAction: onDelete, disabled: (r)=>busyId===r.id },
  ]), [busyId]);

  // Routing: create/edit
  // New route: open HTML editor directly unless explicitly '/new/elementor'
  const newMatch = subroute.match(/^newsletters\/templates\/new(?:\/(elementor|html))?$/);
  if (newMatch) {
    const mode = (newMatch[1] as 'elementor' | 'html' | undefined) || 'html';
    if (mode === 'elementor') {
      return (
        <div className="p-4">
          <div className="max-w-2xl bg-white/80 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">New email template (Elementor)</h2>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">
                <span className="text-gray-700">Name</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Welcome Email" />
              </label>
            </div>
            {errorNew && <div className="text-red-600 mt-2 text-sm">{errorNew}</div>}
            <div className="mt-4 flex items-center gap-2">
              <button type="button" onClick={createElementorAndEmail} disabled={creating} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                <PlusIcon className="h-4 w-4" />
                {creating ? 'Creating…' : 'Create & Open in Elementor'}
              </button>
              <button type="button" onClick={()=>{ location.hash = 'newsletters/templates'; }} className="px-3 py-1.5 rounded border">Back</button>
            </div>
            <p className="mt-3 text-xs text-gray-600">An Elementor Template will be created and linked 1:1 to this Email Template. Editing happens 100% in Elementor.</p>
          </div>
        </div>
      );
    }
    return <EmailTemplateEditor initialSourceType="html" initialName={newName || ''} />;
  }

  const m = subroute.match(/^newsletters\/templates\/edit\/(\d+)$/);
  if (m) {
    return <EmailTemplateEditor id={Number(m[1])} />;
  }

  const onCreateHtml = () => {
    // Go directly to HTML editor create screen
    location.hash = 'newsletters/templates/new/html';
  };

  const onCreateElementorInline = async () => {
    // Open styled dialog instead of native prompt
    setErrorNew(null);
    setNewName('');
    setShowElDialog(true);
  };

  const onConfirmElementor = async () => {
    const ok = await createElementorAndEmail();
    if (ok) {
      setShowElDialog(false);
      setNewName('');
      setErrorNew(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Email templates</h2>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={onCreateHtml}>
            <PlusIcon className="h-4 w-4" />
            Create
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50" onClick={onCreateElementorInline}>
            <PlusIcon className="h-4 w-4" />
            Create with Elementor
          </button>
        </div>
      </div>
      <DataTable<EmailTemplate>
        columns={columns}
        data={items}
        rowKey={(r)=>String(r.id)}
        actions={actions}
        loading={loading}
        error={error}
        emptyMessage="No email templates yet. Create the first one."
      />
      <NameDialog
        open={showElDialog}
        title="Create email template with Elementor"
        description="We’ll create an Elementor Template and link it 1:1 to this email."
        name={newName}
        setName={setNewName}
        error={errorNew}
        creating={creating}
        onCancel={() => { setShowElDialog(false); }}
        onConfirm={onConfirmElementor}
        confirmLabel="Create & Open in Elementor"
      />
    </div>
  );
};
