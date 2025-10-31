import {SettingType, WPUser} from "../types/common";

export const DEFAULT_ENDPOINT = 'main-tree/v1';

class SettingsService {
    private _endpoint: string;
    private _settings: SettingType;
    private _nonce: string;
    private _public: boolean;

    constructor(wpUser: WPUser) {
        // Normalize endpoint to avoid trailing slashes leading to double slashes when concatenating paths
        const ep = wpUser.restUrl || DEFAULT_ENDPOINT;
        this._endpoint = typeof ep === 'string' ? ep.replace(/\/+$/, '') : DEFAULT_ENDPOINT;
        this._nonce = wpUser.nonce;
        this._public = wpUser.public || false;
        this._settings = {};
    }

    save (key: string, value: string|null) {
        this._settings[key] = value;
    }

    get (key: string) {
        return this._settings[key];
    }

    async push(payload?: SettingType) {
        try {
            const dataToSend: SettingType = (payload && typeof payload === 'object') ? payload : (this._settings || {});
            // Ensure we always send a valid JSON object string. If stringify yields undefined, fall back to '{}'.
            const bodyString = JSON.stringify(dataToSend);
            const safeBody = typeof bodyString === 'string' ? bodyString : '{}';

            const response = await fetch(this._endpoint + '/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this._nonce
                },
                body: safeBody
            });
            const data = await response.json();
            return !!data.success;
        } catch (e) {
            return false;
        }
    }

    async pull() {
        try {
            const response = await fetch(this._endpoint + '/settings' + (this._public ? '-public' : ''), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this._nonce
                }
            });
            const data = await response.json();
            if (data && typeof data === 'object') {
                // Normalize empty array (from PHP json_encode on empty array) to object
                const normalized = Array.isArray(data) ? {} : data;
                this._settings = normalized as SettingType;
                return this._settings;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async delete(key: string) {
        try {
            const response = await fetch(this._endpoint + '/settings/' + encodeURIComponent(key), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this._nonce
                }
            });
            const data = await response.json();
            if (data && data.success) {
                delete this._settings[key];
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}

// @ts-ignore
export default new SettingsService(window["wpUser"] as WPUser);
