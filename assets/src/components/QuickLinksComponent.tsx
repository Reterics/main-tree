import React, { useEffect, useMemo, useState } from 'react';
import DataTable, { Column, RowAction } from './common/DataTable';
import Modal, { ModalBody, ModalFooter } from './common/Modal';
import quickLinksService, { QuickLink } from '../services/QuickLinksService';
import { EditIcon, DeleteIcon, PlusIcon, ExternalLinkIcon, QUICK_LINK_ICONS } from './common/Icons';
import { Button } from './common/Button';
import { Card, CardBody, Input, FormField, PageHeader, Checkbox } from './common/Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT QUICK LINKS - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

interface QuickLinkFormData {
  label: string;
  url: string;
  description: string;
  icon: string;
  openInNewTab: boolean;
}

const emptyForm: QuickLinkFormData = {
  label: '',
  url: '',
  description: '',
  icon: 'link',
  openInNewTab: false,
};

// Icon selector component
const IconSelector: React.FC<{
  value: string;
  onChange: (icon: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="mt-icon-grid">
      {Object.entries(QUICK_LINK_ICONS).map(([key, IconComponent]) => (
        <button
          key={key}
          type="button"
          className={`mt-icon-option ${value === key ? 'mt-icon-option-selected' : ''}`}
          onClick={() => onChange(key)}
          title={key}
        >
          <IconComponent />
        </button>
      ))}
    </div>
  );
};

// Render icon by key
const RenderIcon: React.FC<{ iconKey: string; className?: string }> = ({ iconKey, className }) => {
  const IconComponent = QUICK_LINK_ICONS[iconKey] || QUICK_LINK_ICONS.link;
  return <IconComponent className={className} />;
};

export const QuickLinksComponent: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [formData, setFormData] = useState<QuickLinkFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quickLinksService.list();
      setLinks(data);
    } catch (e) {
      setError('Failed to load quick links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const openAddModal = () => {
    setEditingLink(null);
    setFormData(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (link: QuickLink) => {
    setEditingLink(link);
    setFormData({
      label: link.label,
      url: link.url,
      description: link.description || '',
      icon: link.icon || 'link',
      openInNewTab: link.openInNewTab || false,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLink(null);
    setFormData(emptyForm);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!formData.label.trim()) {
      setFormError('Label is required');
      return;
    }
    if (!formData.url.trim()) {
      setFormError('URL is required');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const payload = {
        label: formData.label.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        openInNewTab: formData.openInNewTab,
      };

      if (editingLink) {
        const updated = await quickLinksService.update(editingLink.id, payload);
        if (updated) {
          setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
          closeModal();
        } else {
          setFormError('Failed to update quick link');
        }
      } else {
        const created = await quickLinksService.create(payload);
        if (created) {
          setLinks(prev => [...prev, created]);
          closeModal();
        } else {
          setFormError('Failed to create quick link');
        }
      }
    } catch (e) {
      setFormError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (row: QuickLink) => openEditModal(row);

  const onDelete = async (row: QuickLink) => {
    if (!confirm(`Delete quick link "${row.label}"?`)) return;
    try {
      setBusyActionId(row.id);
      const ok = await quickLinksService.remove(row.id);
      if (ok) setLinks(prev => prev.filter(l => l.id !== row.id));
    } finally {
      setBusyActionId(null);
    }
  };

  const columns: Column<QuickLink>[] = useMemo(() => ([
    {
      key: 'label',
      header: 'Label',
      align: 'left',
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RenderIcon iconKey={r.icon || 'link'} />
          <span style={{ fontWeight: 500, color: 'var(--mt-text)' }}>{r.label}</span>
        </span>
      ),
    },
    {
      key: 'url',
      header: 'URL',
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--mt-primary)', textDecoration: 'none', fontSize: 12 }}
          >
            {r.url.length > 40 ? r.url.substring(0, 40) + '...' : r.url}
          </a>
          {r.openInNewTab && (
            <ExternalLinkIcon className="mt-icon-muted" />
          )}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (r) => (
        <span style={{ fontSize: 11, color: 'var(--mt-text-muted)' }}>
          {r.description || '-'}
        </span>
      ),
    },
  ]), []);

  const actions: RowAction<QuickLink>[] = useMemo(() => ([
    { key: 'edit', label: 'Edit', icon: <EditIcon />, onAction: onEdit, intent: 'primary' },
    { key: 'delete', label: 'Delete', icon: <DeleteIcon />, onAction: onDelete, intent: 'danger', disabled: (r) => busyActionId === r.id },
  ]), [busyActionId]);

  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader
        title="Quick Links"
        subtitle="Manage quick links displayed on the WordPress Dashboard"
        actions={
          <Button variant="primary" size="sm" icon={<PlusIcon />} onClick={openAddModal}>
            Add Quick Link
          </Button>
        }
      />

      <DataTable<QuickLink>
        columns={columns}
        data={links}
        rowKey={(r) => r.id}
        actions={actions}
        loading={loading}
        error={error}
        emptyMessage="No quick links yet. Add your first quick link to display on the WordPress Dashboard."
      />

      <Card style={{ marginTop: 12 }}>
        <CardBody>
          <p style={{ fontSize: 11, color: 'var(--mt-text-muted)', margin: 0 }}>
            Quick links appear as a widget on the WordPress admin dashboard. Users can quickly navigate to frequently used pages or external resources.
          </p>
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingLink ? 'Edit Quick Link' : 'Add Quick Link'}
      >
        <ModalBody>
          <FormField label="Label" required error={formError && !formData.label.trim() ? 'Label is required' : undefined}>
            <Input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Google Analytics"
            />
          </FormField>

          <FormField label="URL" required error={formError && !formData.url.trim() ? 'URL is required' : undefined}>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </FormField>

          <FormField label="Description" hint="Optional short description shown below the label">
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., View website analytics"
            />
          </FormField>

          <FormField label="Icon">
            <IconSelector
              value={formData.icon}
              onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
            />
          </FormField>

          <div style={{ marginTop: 12 }}>
            <Checkbox
              checked={formData.openInNewTab}
              onChange={(checked) => setFormData(prev => ({ ...prev, openInNewTab: checked }))}
              label="Open in new tab"
            />
          </div>

          {formError && formData.label.trim() && formData.url.trim() && (
            <div className="mt-alert mt-alert-danger" style={{ marginTop: 12 }}>
              {formError}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="default" size="sm" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (editingLink ? 'Update' : 'Add')}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
