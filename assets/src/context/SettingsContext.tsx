import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import SettingsService from "../services/SettingsService";
import {SettingType} from "../types/common";

export type SaveResult = null | 'ok' | 'fail';

interface SettingsContextValue {
    settings: SettingType;
    loading: boolean;
    saving: boolean;
    saveResult: SaveResult;
    setField: (key: string, value: string | null) => void;
    saveAll: () => Promise<boolean>;
    reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingType>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saveResult, setSaveResult] = useState<SaveResult>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const pulled = await SettingsService.pull();
            if (pulled) setSettings(pulled);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // initial load
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setField = useCallback((key: string, value: string | null) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value };
            return next;
        });
        // keep service cache in sync
        SettingsService.save(key, value);
    }, []);

    const saveAll = useCallback(async () => {
        setSaving(true);
        setSaveResult(null);
        try {
            const ok = await SettingsService.push(settings);
            setSaveResult(ok ? 'ok' : 'fail');
            return ok;
        } catch (e) {
            setSaveResult('fail');
            return false;
        } finally {
            setSaving(false);
        }
    }, [settings]);

    const reload = useCallback(async () => {
        await load();
    }, [load]);

    const value = useMemo<SettingsContextValue>(() => ({
        settings,
        loading,
        saving,
        saveResult,
        setField,
        saveAll,
        reload,
    }), [settings, loading, saving, saveResult, setField, saveAll, reload]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
}
