import React, { useEffect, useMemo, useState } from 'react';
import formService, { FieldType, FormDef, FormField as FormFieldType, ConditionOperator, EmailAction } from '../../services/FormService';
import { SaveIcon, CloseIcon, PlusIcon, DeleteIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { Card, CardHeader, CardBody, FormField, Input, Select, Textarea, Checkbox, Badge, EmptyState, Divider, PageHeader, Spinner } from '../common/Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT FORM EDITOR - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

interface FormEditorProps {
  id?: string;
  onBack?: () => void;
  onSaved?: (form: FormDef) => void;
}

function emptyField(nextIndex: number): FormFieldType {
  return { type: 'text', label: 'Field Label', name: `field_${nextIndex}`, required: false };
}

export const FormEditor: React.FC<FormEditorProps> = ({ id, onBack, onSaved }) => {
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [fields, setFields] = useState<FormFieldType[]>([emptyField(1)]);
  const [emailActions, setEmailActions] = useState<EmailAction[]>([{ to: '', subject: 'New form submission', template: 'You have a new submission\n\n{{all}}' }]);

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await formService.get(id);
        if (data) {
          setName(data.name || '');
          setFields(Array.isArray(data.fields) ? data.fields : []);
          const email = data.actions?.email as any;
          if (Array.isArray(email)) {
            setEmailActions(email);
          } else if (email) {
            setEmailActions([email]);
          } else {
            setEmailActions([{ to: '', subject: 'New form submission', template: 'You have a new submission\n\n{{all}}' }]);
          }
        } else {
          setError('Form not found');
        }
      } catch {
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const canSave = name.trim().length > 0 && fields.length > 0 && fields.every(f => (f.label || '').trim() && (f.name || '').trim());

  const addField = () => setFields(prev => ([...prev, emptyField(prev.length + 1)]));
  const updateField = (idx: number, patch: Partial<FormFieldType>) => setFields(prev => prev.map((f, i) => i === idx ? { ...f, ...patch } : f));
  const removeField = (idx: number) => setFields(prev => prev.filter((_, i) => i !== idx));

  const addEmailAction = () => setEmailActions(prev => ([...prev, { to: '', subject: 'New form submission', template: 'You have a new submission\n\n{{all}}' }]));
  const updateEmailAction = (idx: number, patch: Partial<EmailAction>) => setEmailActions(prev => prev.map((ea, i) => i === idx ? { ...ea, ...patch } : ea));
  const removeEmailAction = (idx: number) => setEmailActions(prev => prev.filter((_, i) => i !== idx));

  const availableFieldNames = useMemo(() => fields.map(f => f.name).filter(Boolean), [fields]);
  const operators: ConditionOperator[] = ['equals', 'notEquals', 'contains', '>', '<'];

  const save = async () => {
    if (!canSave) return;
    try {
      setSaving(true);
      setError(null);
      const cleanedEmails = (emailActions || []).map(ea => ({
        to: (ea.to || '').trim(),
        subject: (ea.subject || 'New form submission'),
        template: (ea.template || 'You have a new submission\n\n{{all}}'),
      })).filter(ea => ea.to.length > 0);

      const payload = {
        name,
        fields,
        actions: {
          email: cleanedEmails.length === 0 ? null : (cleanedEmails.length === 1 ? cleanedEmails[0] : cleanedEmails),
        },
      } as any;

      let result: FormDef | null = null;
      if (isEdit && id) {
        result = await formService.update(id, payload);
      } else {
        result = await formService.create(payload);
      }
      if (!result) {
        setError('Failed to save form');
      } else {
        onSaved?.(result);
        if (!isEdit) {
          location.hash = `forms/edit/${encodeURIComponent(result.id)}`;
        }
      }
    } catch {
      setError('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 0', color: 'var(--mt-text-muted)' }}>
        <Spinner /> Loading form...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader
        title={isEdit ? 'Edit Form' : 'New Form'}
        subtitle={isEdit ? 'Update form fields and email actions' : 'Create a new form with fields and conditions'}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button variant="default" size="sm" icon={<CloseIcon />} onClick={onBack || (() => (location.hash = 'forms'))}>
              Back
            </Button>
            <Button variant="primary" size="sm" icon={<SaveIcon />} onClick={save} disabled={!canSave || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mt-alert mt-alert-danger" style={{ marginBottom: 12 }}>{error}</div>
      )}

      {/* Form Details */}
      <Card style={{ marginBottom: 12 }}>
        <CardHeader title="Form Details" />
        <CardBody>
          <FormField label="Form Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Contact Form" />
          </FormField>
        </CardBody>
      </Card>

      {/* Fields */}
      <Card style={{ marginBottom: 12 }}>
        <CardHeader
          title="Fields"
          subtitle={`${fields.length} field${fields.length !== 1 ? 's' : ''}`}
          actions={<Button variant="default" size="sm" icon={<PlusIcon />} onClick={addField}>Add Field</Button>}
        />
        <CardBody>
          {fields.length === 0 ? (
            <EmptyState title="No fields" description="Add your first field to get started" />
          ) : (
            fields.map((f, idx) => (
              <div key={idx} className="mt-field-row" style={{ display: 'block', padding: 10, marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px auto auto', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label className="mt-label">Type</label>
                    <Select value={f.type} onChange={(e) => updateField(idx, { type: e.target.value as FieldType })}>
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="textarea">Textarea</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mt-label">Label</label>
                    <Input value={f.label} onChange={(e) => updateField(idx, { label: e.target.value })} placeholder="Field label" />
                  </div>
                  <div>
                    <label className="mt-label">Name</label>
                    <Input value={f.name} onChange={(e) => updateField(idx, { name: e.target.value })} placeholder="field_name" />
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <Checkbox checked={!!f.required} onChange={(c) => updateField(idx, { required: c })} label="Req" />
                  </div>
                  <div>
                    <Button variant="danger" size="sm" icon={<DeleteIcon />} onClick={() => removeField(idx)}>Remove</Button>
                  </div>
                </div>

                <Divider />
                <div style={{ fontSize: 10, color: 'var(--mt-text-muted)', marginBottom: 6 }}>Conditional visibility (optional)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label className="mt-label">When field</label>
                    <Select value={f.showIf?.field || ''} onChange={(e) => updateField(idx, { showIf: { field: e.target.value, operator: f.showIf?.operator || 'equals', value: f.showIf?.value || '' } })}>
                      <option value="">(Always visible)</option>
                      {availableFieldNames.filter(n => n && n !== f.name).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mt-label">Operator</label>
                    <Select value={f.showIf?.operator || 'equals'} onChange={(e) => updateField(idx, { showIf: { field: f.showIf?.field || '', operator: e.target.value as ConditionOperator, value: f.showIf?.value || '' } })} disabled={!f.showIf?.field}>
                      {operators.map(op => <option key={op} value={op}>{op}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="mt-label">Value</label>
                    <Input value={f.showIf?.value || ''} onChange={(e) => updateField(idx, { showIf: { field: f.showIf?.field || '', operator: f.showIf?.operator || 'equals', value: e.target.value } })} disabled={!f.showIf?.field} placeholder="Match value" />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Email Actions */}
      <Card>
        <CardHeader
          title="Email Actions"
          subtitle="Send notifications on form submission"
          actions={<Button variant="default" size="sm" icon={<PlusIcon />} onClick={addEmailAction}>Add Email</Button>}
        />
        <CardBody>
          {emailActions.length === 0 ? (
            <EmptyState title="No email actions" description="Add an email action to receive notifications" />
          ) : (
            emailActions.map((ea, idx) => (
              <div key={idx} style={{ border: '1px solid var(--mt-border-light)', borderRadius: 4, padding: 10, marginBottom: 8, background: 'var(--mt-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Badge>Email #{idx + 1}</Badge>
                  <Button variant="danger" size="sm" icon={<DeleteIcon />} onClick={() => removeEmailAction(idx)}>Remove</Button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FormField label="Send to">
                    <Input type="email" placeholder="you@example.com" value={ea.to} onChange={(e) => updateEmailAction(idx, { to: e.target.value })} />
                  </FormField>
                  <FormField label="Subject">
                    <Input value={ea.subject || ''} onChange={(e) => updateEmailAction(idx, { subject: e.target.value })} />
                  </FormField>
                  <div style={{ gridColumn: 'span 2' }}>
                    <FormField label="Template" hint="Use {{fieldName}} placeholders; {{all}} inserts all fields.">
                      <Textarea value={ea.template || ''} onChange={(e) => updateEmailAction(idx, { template: e.target.value })} style={{ minHeight: 80 }} />
                    </FormField>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};
