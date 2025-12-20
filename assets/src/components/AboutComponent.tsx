import React from "react";
import { Card, CardBody, Badge, PageHeader } from './common/Form';
import { InfoIcon } from './common/Icons';

/* ═══════════════════════════════════════════════════════════════════════════
   MT ABOUT - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

export const AboutComponent = () => {
    return (
        <div style={{ maxWidth: 640 }}>
            <PageHeader title="About" subtitle="Information about Main Tree" />

            <Card style={{ marginBottom: 12 }}>
                <CardBody>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div className="mt-stat-icon"><InfoIcon /></div>
                        <div>
                            <h4 className="mt-card-title">Main Tree</h4>
                            <p style={{ fontSize: 11, color: 'var(--mt-text-muted)', marginTop: 4 }}>
                                A comprehensive WordPress admin toolkit for managing forms, newsletters, and custom functionality.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                                <Badge variant="primary">v1.0.0</Badge>
                                <Badge variant="success">Stable</Badge>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card style={{ marginBottom: 12 }}>
                <CardBody>
                    <h4 className="mt-card-title" style={{ marginBottom: 8 }}>Features</h4>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {[
                            'Form builder with conditional fields and email actions',
                            'Email template editor with Elementor integration',
                            'Settings management with REST API',
                            'Modular development menu system',
                        ].map((feature, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12, color: 'var(--mt-text-sub)' }}>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mt-primary)' }} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <p style={{ fontSize: 11, color: 'var(--mt-text-muted)', margin: 0 }}>
                        Built with React, TypeScript, and a custom design system. Designed for WordPress administrators.
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
