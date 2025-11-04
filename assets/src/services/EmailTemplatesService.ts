export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  preheader: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  source_type: 'html' | 'elementor';
  elementor_template_id: number;
  html: string;
  updated_at?: string;
}

export interface ElementorItem { id: number; title: string }

class EmailTemplatesService {
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

  async list(): Promise<EmailTemplate[]> {
    const res = await fetch(this.endpoint + '/email-templates', { headers: this.headers() });
    const data = await res.json();
    return Array.isArray(data) ? (data as EmailTemplate[]) : [];
    }

  async get(id: number): Promise<EmailTemplate | null> {
    const res = await fetch(`${this.endpoint}/email-templates/${id}`, { headers: this.headers() });
    const data = await res.json();
    return data && data.success ? (data.template as EmailTemplate) : null;
  }

  async create(payload: Partial<EmailTemplate> & { name: string }): Promise<EmailTemplate | null> {
    const res = await fetch(this.endpoint + '/email-templates', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.template as EmailTemplate) : null;
  }

  async update(id: number, payload: Partial<EmailTemplate> & { name: string }): Promise<EmailTemplate | null> {
    const res = await fetch(`${this.endpoint}/email-templates/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.template as EmailTemplate) : null;
  }

  async remove(id: number): Promise<boolean> {
    const res = await fetch(`${this.endpoint}/email-templates/${id}`, { method: 'DELETE', headers: this.headers() });
    const data = await res.json();
    return !!(data && data.success);
  }

  async duplicate(id: number): Promise<EmailTemplate | null> {
    const res = await fetch(`${this.endpoint}/email-templates/${id}/duplicate`, { method: 'POST', headers: this.headers() });
    const data = await res.json();
    return data && data.success ? (data.template as EmailTemplate) : null;
  }

  async listElementorTemplates(): Promise<ElementorItem[]> {
    const res = await fetch(this.endpoint + '/elementor-templates', { headers: this.headers() });
    const data = await res.json();
    return Array.isArray(data) ? (data as ElementorItem[]) : [];
  }

  async createElementorTemplate(title: string): Promise<{ id: number; title: string; edit_url: string } | null> {
    const res = await fetch(this.endpoint + '/elementor-templates', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    if (data && data.success && data.template) {
      return data.template as { id: number; title: string; edit_url: string };
    }
    return null;
  }

  async render(id: number): Promise<string> {
    const res = await fetch(`${this.endpoint}/email-templates/${id}/render`, { headers: this.headers() });
    const data = await res.json();
    if (data && data.success && typeof data.html === 'string') {
      return data.html as string;
    }
    throw new Error(data && data.error ? data.error : 'Failed to render template');
  }
}

const emailTemplatesService = new EmailTemplatesService();
export default emailTemplatesService;
