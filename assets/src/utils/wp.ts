export function adminUrl(path: string = ''): string {
    // @ts-ignore
    const baseRaw: string = (window as any)?.wpUser?.adminUrl || '/wp-admin/';
    const base = typeof baseRaw === 'string' ? baseRaw : '/wp-admin/';
    const cleanBase = base.replace(/\/+$/, '/');
    const cleanPath = (path || '').replace(/^\/+/, '');
    return cleanBase + cleanPath;
}
