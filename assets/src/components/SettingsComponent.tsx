import React from "react";
import './SettingsComponent.css';
import {useSettings} from "../context/SettingsContext";
import { Button } from "./common/Button";

export const SettingsComponent = () => {
    const { settings, setField, saveAll, saving, saveResult, loading } = useSettings();

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setField(key, value);
    };

    const handleSave = async () => {
        await saveAll();
    };

    return (
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Configure your integration preferences.</p>
            </div>

            <form onSubmit={(e)=>{e.preventDefault();}} className="max-w-3xl">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                        <label htmlFor='openai_api_key' className="sm:col-span-1 text-sm font-medium text-gray-700">OpenAI API Key</label>
                        <div className="sm:col-span-3">
                            <input id='openai_api_key' type='text' value={settings['openai_api_key'] || ''} onChange={handleChange('openai_api_key')}
                                   className="w-full rounded-md border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] text-sm disabled:bg-gray-50"
                                   placeholder="sk-..." disabled={loading || saving} />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </Button>
                        {saveResult === 'ok' && <span className="text-sm text-green-600">Saved.</span>}
                        {saveResult === 'fail' && <span className="text-sm text-red-600">Save failed.</span>}
                        {loading && <span className="text-sm text-gray-500">Loading…</span>}
                    </div>
                </div>
            </form>
        </div>
    )
}
