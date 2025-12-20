import React from 'react';
import { Card, CardBody, Badge, PageHeader } from './common/Form';
import { FormsIcon, NewsletterIcon, SettingsIcon } from './common/Icons';

/* ═══════════════════════════════════════════════════════════════════════════
   MT DASHBOARD - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

const stats = [
    { label: 'Forms', value: '—', icon: FormsIcon, link: 'forms' },
    { label: 'Templates', value: '—', icon: NewsletterIcon, link: 'newsletters' },
];

const quickLinks = [
    { label: 'Settings', description: 'Configure API keys and preferences', icon: SettingsIcon, link: 'settings' },
    { label: 'Forms', description: 'Create and manage forms', icon: FormsIcon, link: 'forms' },
    { label: 'Newsletters', description: 'Email templates and campaigns', icon: NewsletterIcon, link: 'newsletters' },
];

export const DashboardComponent = () => {
    return (
        <div>
            <PageHeader title="Dashboard" subtitle="Welcome to Main Tree Admin Console" />

            {/* Stats */}
            <div className="mt-grid mt-grid-2" style={{ marginBottom: 12 }}>
                {stats.map(({ label, value, icon: Icon, link }) => (
                    <Card key={label}>
                        <button
                            className="mt-stat"
                            onClick={() => (location.hash = link)}
                            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            <div className="mt-stat-icon"><Icon /></div>
                            <div>
                                <div className="mt-stat-value">{value}</div>
                                <div className="mt-stat-label">{label}</div>
                            </div>
                        </button>
                    </Card>
                ))}
            </div>

            {/* Quick Links */}
            <Card style={{ marginBottom: 12 }}>
                <CardBody>
                    <h4 className="mt-card-title" style={{ marginBottom: 10 }}>Quick Links</h4>
                    <div className="mt-grid mt-grid-3">
                        {quickLinks.map(({ label, description, icon: Icon, link }) => (
                            <button
                                key={label}
                                onClick={() => (location.hash = link)}
                                className="mt-nav-item"
                                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 10, height: 'auto' }}
                            >
                                <Icon />
                                <div style={{ marginTop: 6 }}>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--mt-text)' }}>{label}</div>
                                    <div style={{ fontSize: 10, color: 'var(--mt-text-muted)' }}>{description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* System Info */}
            <Card>
                <CardBody>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Badge variant="success">Active</Badge>
                        <span style={{ fontSize: 11, color: 'var(--mt-text-muted)' }}>
                            Main Tree is running normally. All services operational.
                        </span>
                    </span>
                </CardBody>
            </Card>
        </div>
    );
}
