import React from 'react';
import { Card, CardHeader, CardBody, Badge, PageHeader } from './common/Form';
import { Button } from './common/Button';
import { PlusIcon } from './common/Icons';

/* ═══════════════════════════════════════════════════════════════════════════
   MT ACF TOOLS - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

export const ACFToolsComponent: React.FC = () => {
    return (
        <div style={{ maxWidth: 900 }}>
            <PageHeader title="Advanced Custom Fields" subtitle="Native in-SPA tools are coming soon" />

            <div className="mt-grid mt-grid-2">
                <Card>
                    <CardHeader
                        title="Field Groups"
                        subtitle="List, search, create, and edit"
                        actions={<Button variant="default" size="sm" icon={<PlusIcon />} disabled>New</Button>}
                    />
                    <CardBody>
                        <div className="mt-skeleton" style={{ height: 28, marginBottom: 6 }} />
                        <div className="mt-skeleton" style={{ height: 28, marginBottom: 6 }} />
                        <div className="mt-skeleton" style={{ height: 28 }} />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Fields Explorer" subtitle="Browse by post type/taxonomy" />
                    <CardBody>
                        <div className="mt-skeleton" style={{ height: 20, marginBottom: 6 }} />
                        <div className="mt-skeleton" style={{ height: 20, marginBottom: 6 }} />
                        <div className="mt-skeleton" style={{ height: 20 }} />
                    </CardBody>
                </Card>
            </div>

            <Card style={{ marginTop: 12 }}>
                <CardBody>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Badge variant="warning">Preview</Badge>
                        <span style={{ fontSize: 11, color: 'var(--mt-text-muted)' }}>
                            This feature is under development. Full CRUD will be implemented inside the SPA.
                        </span>
                    </span>
                </CardBody>
            </Card>
        </div>
    );
};
