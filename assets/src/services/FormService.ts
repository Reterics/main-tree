export type FieldType = 'text' | 'email' | 'textarea';

export type ConditionOperator = 'equals' | 'notEquals' | 'contains' | '>' | '<';
export interface FieldCondition {
  field: string; // depends on another field's name
  operator: ConditionOperator;
  value: string;
}

export interface FormField {
  type: FieldType;
  label: string;
  name: string;
  required?: boolean;
  showIf?: FieldCondition | null; // optional conditional visibility
}

export interface EmailAction {
  to: string; // recipient email(s), comma separated
  subject?: string;
  template?: string; // supports {{fieldName}} replacements
}

export interface FormDef {
  id: string;
  name: string;
  fields: FormField[];
  actions?: {
    // Backward compatible: single email action or multiple
    email?: EmailAction | EmailAction[] | null;
  };
}

class FormService {
  private endpoint: string;
  private nonce: string;

  constructor() {
    // @ts-ignore
    const wpUser = (window as any)?.wpUser || {};
    const base: string = typeof wpUser.restUrl === 'string' ? wpUser.restUrl : 'main-tree/v1';
    this.endpoint = base.replace(/\/+$/, '');
    this.nonce = wpUser.nonce || '';
  }

  private headers() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.nonce) headers['X-WP-Nonce'] = this.nonce;
    return headers;
  }

  async list(): Promise<FormDef[]> {
    const res = await fetch(this.endpoint + '/forms', { headers: this.headers() });
    const data = await res.json();
    return Array.isArray(data) ? (data as FormDef[]) : [];
  }

  async get(id: string): Promise<FormDef | null> {
    const res = await fetch(`${this.endpoint}/forms/${encodeURIComponent(id)}` , { headers: this.headers() });
    const data = await res.json();
    return data && data.success ? (data.form as FormDef) : null;
  }

  async create(payload: { name: string; fields: FormField[]; actions?: FormDef['actions'] }): Promise<FormDef | null> {
    const res = await fetch(this.endpoint + '/forms', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.form as FormDef) : null;
  }

  async update(id: string, payload: { name: string; fields: FormField[]; actions?: FormDef['actions'] }): Promise<FormDef | null> {
    const res = await fetch(`${this.endpoint}/forms/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.form as FormDef) : null;
  }

  async remove(id: string): Promise<boolean> {
    const res = await fetch(`${this.endpoint}/forms/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    const data = await res.json();
    return !!(data && data.success);
  }

  async duplicate(id: string): Promise<FormDef | null> {
    const res = await fetch(`${this.endpoint}/forms/${encodeURIComponent(id)}/duplicate`, {
      method: 'POST',
      headers: this.headers(),
    });
    const data = await res.json();
    return data && data.success ? (data.form as FormDef) : null;
  }
}

const formService = new FormService();
export default formService;
