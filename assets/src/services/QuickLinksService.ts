export interface QuickLink {
  id: string;
  label: string;
  url: string;
  description?: string;
  icon?: string;
  openInNewTab?: boolean;
}

class QuickLinksService {
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

  async list(): Promise<QuickLink[]> {
    const res = await fetch(this.endpoint + '/quick-links', { headers: this.headers() });
    const data = await res.json();
    return Array.isArray(data) ? (data as QuickLink[]) : [];
  }

  async create(payload: Omit<QuickLink, 'id'>): Promise<QuickLink | null> {
    const res = await fetch(this.endpoint + '/quick-links', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.link as QuickLink) : null;
  }

  async update(id: string, payload: Omit<QuickLink, 'id'>): Promise<QuickLink | null> {
    const res = await fetch(`${this.endpoint}/quick-links/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data && data.success ? (data.link as QuickLink) : null;
  }

  async remove(id: string): Promise<boolean> {
    const res = await fetch(`${this.endpoint}/quick-links/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    const data = await res.json();
    return !!(data && data.success);
  }

  async reorder(ids: string[]): Promise<QuickLink[]> {
    const res = await fetch(this.endpoint + '/quick-links/reorder', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    return data && data.success ? (data.links as QuickLink[]) : [];
  }
}

const quickLinksService = new QuickLinksService();
export default quickLinksService;
