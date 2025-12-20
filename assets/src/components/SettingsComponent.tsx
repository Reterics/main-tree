import React from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "./common/Button";
import { Card, CardHeader, CardBody, PageHeader, InlineField, Toggle, Input, FormField } from "./common/Form";
import { SaveIcon } from "./common/Icons";

/* ═══════════════════════════════════════════════════════════════════════════
   MT SETTINGS - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

/** Development menu configuration - defines which menus can be toggled */
export const DEV_MENU_CONFIG = [
    { key: 'dev_menu_acf', label: 'ACF', description: 'Advanced Custom Fields tools' },
    { key: 'dev_menu_cptui', label: 'CPT UI', description: 'Custom Post Types & Taxonomies' },
    { key: 'dev_menu_updates', label: 'Updates', description: 'Updates manager' },
    { key: 'dev_menu_maintenance', label: 'Maintenance', description: 'Maintenance mode' },
    { key: 'dev_menu_snippets', label: 'Snippets', description: 'Code snippets manager' },
] as const;

export const SettingsComponent = () => {
    const { settings, setField, saveAll, saving, saveResult, loading } = useSettings();

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setField(key, e.target.value);
    };

    const handleToggle = (key: string) => (checked: boolean) => {
        setField(key, checked ? '1' : '');
    };

    const handleSave = async () => {
        await saveAll();
    };

    return (
        <div style={{ maxWidth: 640 }}>
            <PageHeader title="Settings" subtitle="Configure your integration preferences." />

            <form onSubmit={(e) => e.preventDefault()}>
                {/* API Keys Section */}
                <Card style={{ marginBottom: 12 }}>
                    <CardHeader title="API Keys" subtitle="External service credentials" />
                    <CardBody>
                        <FormField label="OpenAI API Key">
                            <Input
                                type="password"
                                value={settings['openai_api_key'] || ''}
                                onChange={handleChange('openai_api_key')}
                                placeholder="sk-..."
                                disabled={loading || saving}
                            />
                        </FormField>
                    </CardBody>
                </Card>

                {/* Development Menus Section */}
                <Card style={{ marginBottom: 12 }}>
                    <CardHeader title="Development Menus" subtitle="Enable or disable menus that are under development" />
                    <CardBody>
                        {DEV_MENU_CONFIG.map(({ key, label, description }) => (
                            <InlineField key={key} label={label} description={description}>
                                <Toggle
                                    checked={settings[key] === '1'}
                                    onChange={handleToggle(key)}
                                    disabled={loading || saving}
                                />
                            </InlineField>
                        ))}
                    </CardBody>
                </Card>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        disabled={saving || loading}
                        icon={<SaveIcon />}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {saveResult === 'ok' && (
                        <span style={{ fontSize: 11, color: 'var(--mt-success)' }}>Changes saved successfully.</span>
                    )}
                    {saveResult === 'fail' && (
                        <span style={{ fontSize: 11, color: 'var(--mt-danger)' }}>Failed to save changes.</span>
                    )}
                    {loading && (
                        <span style={{ fontSize: 11, color: 'var(--mt-text-muted)' }}>Loading...</span>
                    )}
                </div>
            </form>
        </div>
    );
}
