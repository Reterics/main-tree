import {SettingType, WPUser} from "../types/common";

export const DEFAULT_ENDPOINT = 'main-tree/v1';

class SettingsService {
    private _endpoint: string;
    private _settings: SettingType;
    private _nonce: string;
    private _public: boolean;

    constructor(wpUser: WPUser) {
        this._endpoint = wpUser.restUrl || DEFAULT_ENDPOINT;
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

    async push() {
        try {
            const response = await fetch(this._endpoint + '/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this._nonce
                },
                body: JSON.stringify(this._settings)
            });
            const data = await response.json();
            return !!data.success;
        } catch (e) {
            return false;
        }
    }

    async pull() {
        try {
            console.error('Getting data from ', this._endpoint + '/settings' + (this._public ? '-public' : ''))
            const response = await fetch(this._endpoint + '/settings' + (this._public ? '-public' : ''), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this._nonce
                }
            });
            const data = await response.json();
            if (data) {
                this._settings = data;
                return this._settings;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
}

// @ts-ignore
export default new SettingsService(window["wpUser"] as WPUser);
