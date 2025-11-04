import React, { useEffect, useRef, useState } from 'react';
import emailTemplatesService, { EmailTemplate, ElementorItem } from '../../services/EmailTemplatesService';
import { SaveIcon, PlusIcon } from '../common/Icons';
import NameDialog from '../common/NameDialog';
import { adminUrl } from '../../utils/wp';

interface Props { id?: number | null; initialSourceType?: 'html' | 'elementor'; initialName?: string }

export const EmailTemplateEditor: React.FC<Props> = ({ id = null, initialSourceType, initialName }) => {
  const [model, setModel] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    preheader: '',
    from_name: '',
    from_email: '',
    reply_to: '',
    source_type: initialSourceType || 'html',
    elementor_template_id: 0,
    html: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [elementor, setElementor] = useState<ElementorItem[]>([]);
  const [creatingEl, setCreatingEl] = useState(false);
  const [elDialogOpen, setElDialogOpen] = useState(false);
  const [elName, setElName] = useState('');
  const [elError, setElError] = useState<string | null>(null);
  // Preview state for Elementor rendering
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    emailTemplatesService.listElementorTemplates().then(setElementor).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!id && initialName) {
      setModel(prev => ({ ...prev, name: prev.name || initialName }));
    }
  }, [id, initialName]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    emailTemplatesService.get(id)
      .then(tpl => {
        if (tpl) setModel(tpl);
      })
      .catch(()=> setError('Failed to load template'))
      .finally(()=> setLoading(false));
  }, [id]);

  const onChange = (patch: Partial<EmailTemplate>) => setModel(prev => ({ ...prev, ...patch }));

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload: any = {
        name: model.name || '',
        subject: model.subject || '',
        preheader: model.preheader || '',
        from_name: model.from_name || '',
        from_email: model.from_email || '',
        reply_to: model.reply_to || '',
        source_type: model.source_type || 'html',
        elementor_template_id: Number(model.elementor_template_id || 0),
        html: model.html || '',
      };
      let saved: EmailTemplate | null = null;
      if (id) saved = await emailTemplatesService.update(id, payload);
      else saved = await emailTemplatesService.create(payload);
      if (saved) {
        location.hash = 'newsletters/templates';
      }
    } catch(e) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const elementorEditUrl = model.elementor_template_id ? `${adminUrl('post.php')}?post=${model.elementor_template_id}&action=elementor${id ? `&mt_email_template_id=${id}` : ''}` : '';

  const onCreateElementorTemplate = async () => {
    if (creatingEl) return;
    const defaultName = (model.name && model.name.trim()) ? model.name.trim() : 'Email Template';
    setElName(defaultName);
    setElError(null);
    setElDialogOpen(true);
  };

  const onConfirmCreateElementor = async () => {
    const title = (elName && elName.trim()) ? elName.trim() : (model.name && model.name.trim()) ? model.name.trim() : 'Email Template';
    if (!title) { setElError('Please enter a name.'); return; }
    try {
      setCreatingEl(true);
      setElError(null);
      const created = await emailTemplatesService.createElementorTemplate(title);
      if (created) {
        try { const list = await emailTemplatesService.listElementorTemplates(); setElementor(list); } catch {}
        setModel(prev => ({ ...prev, source_type: 'elementor', elementor_template_id: created.id }));
        window.open(created.edit_url, '_blank', 'noopener,noreferrer');
        setElDialogOpen(false);
      } else {
        setElError('Failed to create Elementor template');
      }
    } catch (e) {
      setElError('Failed to create Elementor template');
    } finally {
      setCreatingEl(false);
    }
  };

  const refreshPreview = async () => {
    if (!id) {
      setPreviewError('Save the template first to preview.');
      return;
    }
    if ((model.source_type||'html') !== 'elementor') return;
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const html = await emailTemplatesService.render(id);
      setPreviewHtml(html);
    } catch (e:any) {
      setPreviewError(e?.message || 'Failed to render preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Auto-clear preview when switching modes or template selection changes
  useEffect(() => {
    setPreviewHtml('');
    setPreviewError(null);
  }, [model.source_type, model.elementor_template_id]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{id ? 'Edit template' : 'New template'}</h2>
        <button type="button" onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
          <SaveIcon className="h-4 w-4" />
          Save
        </button>
      </div>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/80 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-gray-700">Name</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.name||''} onChange={e=>onChange({name: e.target.value})} />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700">Subject</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.subject||''} onChange={e=>onChange({subject: e.target.value})} />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700">Preheader</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.preheader||''} onChange={e=>onChange({preheader: e.target.value})} />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700">From name</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.from_name||''} onChange={e=>onChange({from_name: e.target.value})} />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700">From email</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.from_email||''} onChange={e=>onChange({from_email: e.target.value})} />
              </label>
              <label className="block text-sm">
                <span className="text-gray-700">Reply-To</span>
                <input className="mt-1 w-full border rounded px-2 py-1" value={model.reply_to||''} onChange={e=>onChange({reply_to: e.target.value})} />
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-1 text-gray-700">Content source</label>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-block px-2 py-0.5 rounded border bg-gray-50 text-gray-700">
                  {(model.source_type||'html')==='elementor' ? 'Elementor' : 'HTML'}
                </span>
                {!id && !initialSourceType && (
                  <span className="text-gray-500">(Set on creation)</span>
                )}
              </div>
            </div>

            {(model.source_type||'html') === 'html' ? (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-700">HTML</label>
                  <div className="flex items-center gap-2 text-xs">
                    <select id="mt-token-select" className="border rounded px-1 py-0.5">
                      <option value="">Insert field…</option>
                      <option value="[mt_email_subject]">Subject</option>
                      <option value="[mt_email_preheader]">Preheader</option>
                      <option value="[mt_email_from_name]">From name</option>
                      <option value="[mt_email_from_email]">From email</option>
                      <option value="[mt_email_reply_to]">Reply-To</option>
                    </select>
                    <button type="button" className="px-2 py-0.5 rounded border" onClick={()=>{
                      const sel = (document.getElementById('mt-token-select') as HTMLSelectElement);
                      const val = sel?.value || '';
                      if (!val) return;
                      const ta = document.getElementById('mt-html-ta') as HTMLTextAreaElement | null;
                      if (ta) {
                        const start = ta.selectionStart || 0; const end = ta.selectionEnd || 0;
                        const newVal = (model.html||'').slice(0, start) + val + (model.html||'').slice(end);
                        onChange({ html: newVal });
                        setTimeout(()=>{ ta.focus(); ta.selectionStart = ta.selectionEnd = start + val.length; }, 0);
                      } else {
                        onChange({ html: (model.html||'') + val });
                      }
                    }}>Insert</button>
                    <div className="flex items-center gap-1">
                      <span>Custom key:</span>
                      <input id="mt-custom-key" placeholder="e.g. name" className="border rounded px-1 py-0.5 w-28" />
                      <button type="button" className="px-2 py-0.5 rounded border" onClick={()=>{
                        const inp = document.getElementById('mt-custom-key') as HTMLInputElement | null;
                        const key = (inp?.value || '').trim();
                        if (!key) return;
                        const token = `[mt_email_var key="${key}"]`;
                        const ta = document.getElementById('mt-html-ta') as HTMLTextAreaElement | null;
                        if (ta) {
                          const start = ta.selectionStart || 0; const end = ta.selectionEnd || 0;
                          const newVal = (model.html||'').slice(0, start) + token + (model.html||'').slice(end);
                          onChange({ html: newVal });
                          setTimeout(()=>{ ta.focus(); ta.selectionStart = ta.selectionEnd = start + token.length; }, 0);
                        } else {
                          onChange({ html: (model.html||'') + token });
                        }
                      }}>Add field</button>
                    </div>
                  </div>
                </div>
                <textarea id="mt-html-ta" className="w-full min-h-[280px] border rounded px-2 py-1 font-mono text-xs" value={model.html||''} onChange={e=>onChange({html: e.target.value})} />
              </div>
            ) : (
              <div className="mt-3">
                <label className="block text-sm">
                  <span className="text-gray-700">Linked Elementor template</span>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-sm text-gray-800">
                      {model.elementor_template_id ? (
                        <span>
                          {(elementor.find(it => it.id === Number(model.elementor_template_id))?.title) || 'Template'} (ID: {String(model.elementor_template_id)})
                        </span>
                      ) : (
                        <span className="text-gray-500">No template linked</span>
                      )}
                    </div>
                    {model.elementor_template_id ? (
                      <a className="inline-flex justify-center items-center h-9 px-3 rounded border border-gray-300 text-sm text-indigo-700 hover:bg-indigo-50" href={elementorEditUrl} target="_blank" rel="noreferrer">Open in Elementor</a>
                    ) : (
                      <button type="button" onClick={onCreateElementorTemplate} disabled={creatingEl} className="inline-flex items-center gap-2 h-9 px-3 rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                        <PlusIcon className="h-4 w-4" />
                        {creatingEl ? 'Creating…' : 'Create Elementor template'}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Editing happens 100% in Elementor. The association is {model.elementor_template_id ? 'locked.' : 'created upon linking.'}</p>
                </label>
              </div>
            )}
          </div>
          <div className="bg-white/80 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{(model.source_type||'html')==='elementor' ? 'Elementor' : 'Preview'}</h3>
            </div>
            {(model.source_type||'html')==='html' ? (
              <iframe title="preview" className="w-full h-[480px] border rounded" srcDoc={model.html||''} />
            ) : (
              <div className="text-sm text-gray-700">
                <p>Editing happens 100% in Elementor. Use the button above to open the linked template.</p>
              </div>
            )}
          </div>
        </div>
      )}
      <NameDialog
        open={elDialogOpen}
        title="Create Elementor template"
        description="We’ll create a new Elementor Template and link it to this email."
        name={elName}
        setName={setElName}
        error={elError}
        creating={creatingEl}
        onCancel={()=>{ setElDialogOpen(false); }}
        onConfirm={onConfirmCreateElementor}
        confirmLabel="Create & Open in Elementor"
      />
    </div>
  );
};
