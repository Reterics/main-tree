import React from "react";
import './SettingsComponent.css';
import SettingsService from "../services/SettingsService";
import {useEffect, useState} from "react";
import {SettingType} from "../types/common";

export const SettingsComponent = () => {
    const [settings, setSettings] = useState<SettingType>({});
    const [saving, setSaving] = useState(false);
    const [saveResult, setSaveResult] = useState<null | 'ok' | 'fail'>(null);

    useEffect(() => {
        SettingsService
            .pull()
            .then((_settings)=>{
                if (_settings) {
                    setSettings(_settings);
                }
            });
    }, []);

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const next = { ...settings, [key]: value };
        setSettings(next);
        SettingsService.save(key, value);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveResult(null);
        // Send the current React state as the payload to ensure a non-empty JSON object is posted
        const success = await SettingsService.push(settings);
        setSaving(false);
        setSaveResult(success ? 'ok' : 'fail');
    };

    return (
        <div>
            <h3>Welcome to the Settings</h3>

            <form onSubmit={(e)=>{e.preventDefault();}}>
                <div className='form-row'>
                    <div className='form-col form-label'>
                        <label htmlFor='openai_api_key'>OpenAI API Key</label>
                    </div>
                    <div className='form-col form-value'>
                        <input id='openai_api_key' type='text' value={settings['openai_api_key'] || ''} onChange={handleChange('openai_api_key')} />
                    </div>
                </div>

                <div className='form-row form-footer'>
                    <div className='form-col'>
                        <button type='button' className={`button button-primary${saving ? ' disabled' : ''}`} onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        {saveResult === 'ok' && <span style={{marginLeft: 10, color: 'green'}}>Saved.</span>}
                        {saveResult === 'fail' && <span style={{marginLeft: 10, color: 'red'}}>Save failed.</span>}
                    </div>
                </div>
            </form>
        </div>
    )
}
