import React, { useEffect, useMemo, useState } from 'react';
import formService, { FieldType, FormDef, FormField, ConditionOperator, EmailAction } from '../../services/FormService';
import { SaveIcon, CloseIcon, PlusIcon, DeleteIcon } from '../common/Icons';

interface FormEditorProps {
  id?: string; // if provided, edit mode; otherwise create mode
  onBack?: () => void;
  onSaved?: (form: FormDef) => void;
}

function emptyField(nextIndex: number): FormField {
  return { type: 'text', label: 'Field Label', name: `field_${nextIndex}`, required: false };
}

export const FormEditor: React.FC<FormEditorProps> = ({ id, onBack, onSaved }) => {
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [fields, setFields] = useState<FormField[]>([ emptyField(1) ]);
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

  const canSave = name.trim().length > 0 && fields.length > 0 && fields.every(f => (f.label||'').trim() && (f.name||'').trim());

  const addField = () => setFields(prev => ([...prev, emptyField(prev.length + 1)]));
  const updateField = (idx: number, patch: Partial<FormField>) => setFields(prev => prev.map((f, i) => i === idx ? { ...f, ...patch } : f));
  const removeField = (idx: number) => setFields(prev => prev.filter((_, i) => i !== idx));

  // Email actions helpers
  const addEmailAction = () => setEmailActions(prev => ([...prev, { to: '', subject: 'New form submission', template: 'You have a new submission\n\n{{all}}' }]));
  const updateEmailAction = (idx: number, patch: Partial<EmailAction>) => setEmailActions(prev => prev.map((ea, i) => i === idx ? { ...ea, ...patch } : ea));
  const removeEmailAction = (idx: number) => setEmailActions(prev => prev.filter((_, i) => i !== idx));

  const availableFieldNames = useMemo(() => fields.map(f => f.name).filter(Boolean), [fields]);
  const operators: ConditionOperator[] = ['equals','notEquals','contains','>','<'];

  const save = async () => {
    if (!canSave) return;
    try {
      setSaving(true);
      setError(null);
      // Normalize email actions: trim and drop empty ones
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
          // navigate to edit after create
          location.hash = `forms/edit/${encodeURIComponent(result.id)}`;
        }
      }
    } catch {
      setError('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-gray-600">Loading...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Form' : 'Add New Form'}</h3>
          <p className="text-sm text-gray-600">{isEdit ? 'Update fields and actions' : 'Create a new form with fields, conditions and email action.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack || (() => (location.hash = 'forms'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-gray-300 text-gray-700 hover:bg-gray-50">
            <CloseIcon className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button onClick={save} disabled={!canSave || saving} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs ${canSave ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500'}`}>
            <SaveIcon className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {error && <div className="mb-3 text-xs text-red-600">{error}</div>}

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm text-gray-700">
            <span className="block mb-1">Form Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </label>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-900">Fields</div>
              <button onClick={addField} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                <PlusIcon className="h-4 w-4" />
                <span>Add Field</span>
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((f, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start border rounded p-2">
                  <label className="col-span-2 text-xs text-gray-700">
                    <span className="block mb-1">Type</span>
                    <select value={f.type} onChange={(e) => updateField(idx, { type: e.target.value as FieldType })} className="w-full border rounded px-2 py-1 text-sm">
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </label>
                  <label className="col-span-4 text-xs text-gray-700">
                    <span className="block mb-1">Label</span>
                    <input type="text" value={f.label} onChange={(e) => updateField(idx, { label: e.target.value })} className="w-full border rounded px-2 py-1 text-sm" />
                  </label>
                  <label className="col-span-3 text-xs text-gray-700">
                    <span className="block mb-1">Name</span>
                    <input type="text" value={f.name} onChange={(e) => updateField(idx, { name: e.target.value })} className="w-full border rounded px-2 py-1 text-sm" />
                  </label>
                  <label className="col-span-1 flex items-center gap-2 text-xs text-gray-700">
                    <input type="checkbox" checked={!!f.required} onChange={(e) => updateField(idx, { required: e.target.checked })} />
                    <span>Req</span>
                  </label>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => removeField(idx)} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-gray-300 text-red-600 hover:bg-red-50">
                      <DeleteIcon className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                  {/* Conditional visibility editor */}
                  <div className="col-span-12 grid grid-cols-12 gap-2 mt-2">
                    <div className="col-span-12 text-xs text-gray-700">Condition (optional)</div>
                    <label className="col-span-4 text-xs text-gray-700">
                      <span className="block mb-1">When field</span>
                      <select value={f.showIf?.field || ''} onChange={(e) => updateField(idx, { showIf: { field: e.target.value, operator: f.showIf?.operator || 'equals', value: f.showIf?.value || '' } })} className="w-full border rounded px-2 py-1 text-sm">
                        <option value="">(Always visible)</option>
                        {availableFieldNames.filter(n => n && n !== f.name).map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                    <label className="col-span-3 text-xs text-gray-700">
                      <span className="block mb-1">Operator</span>
                      <select value={f.showIf?.operator || 'equals'} onChange={(e) => updateField(idx, { showIf: { field: f.showIf?.field || '', operator: e.target.value as ConditionOperator, value: f.showIf?.value || '' } })} className="w-full border rounded px-2 py-1 text-sm" disabled={!f.showIf?.field}>
                        {operators.map(op => <option key={op} value={op}>{op}</option>)}
                      </select>
                    </label>
                    <label className="col-span-5 text-xs text-gray-700">
                      <span className="block mb-1">Value</span>
                      <input type="text" value={f.showIf?.value || ''} onChange={(e) => updateField(idx, { showIf: { field: f.showIf?.field || '', operator: f.showIf?.operator || 'equals', value: e.target.value } })} className="w-full border rounded px-2 py-1 text-sm" disabled={!f.showIf?.field} />
                    </label>
                  </div>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="text-xs text-gray-500">No fields added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-900">Email Actions</div>
          <button onClick={addEmailAction} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
            <PlusIcon className="h-4 w-4" />
            <span>Add Email</span>
          </button>
        </div>
        <div className="space-y-3">
          {emailActions.map((ea, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded p-3">
              <div className="sm:col-span-2 flex items-center justify-between">
                <div className="text-xs font-medium text-gray-800">Email #{idx + 1}</div>
                <button onClick={() => removeEmailAction(idx)} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-gray-300 text-red-600 hover:bg-red-50">
                  <DeleteIcon className="h-4 w-4" />
                  <span>Remove</span>
                </button>
              </div>
              <label className="text-xs text-gray-700">
                <span className="block mb-1">Send to</span>
                <input type="email" placeholder="you@example.com, other@example.com" value={ea.to} onChange={(e) => updateEmailAction(idx, { to: e.target.value })} className="w-full border rounded px-2 py-1 text-sm" />
              </label>
              <label className="text-xs text-gray-700">
                <span className="block mb-1">Subject</span>
                <input type="text" value={ea.subject || ''} onChange={(e) => updateEmailAction(idx, { subject: e.target.value })} className="w-full border rounded px-2 py-1 text-sm" />
              </label>
              <label className="sm:col-span-2 text-xs text-gray-700">
                <span className="block mb-1">Template</span>
                <textarea value={ea.template || ''} onChange={(e) => updateEmailAction(idx, { template: e.target.value })} className="w-full border rounded px-2 py-1 text-sm min-h-[100px]" />
                <span className="block mt-1 text-[11px] text-gray-500">Use {'{{'}fieldName{'}'}{'}'} placeholders; {'{{'}all{'}'}{'}'} inserts all fields.</span>
              </label>
            </div>
          ))}
          {emailActions.length === 0 && (
            <div className="text-xs text-gray-500">No email actions yet. Click "Add Email" to create one.</div>
          )}
        </div>
      </div>
    </div>
  );
};
