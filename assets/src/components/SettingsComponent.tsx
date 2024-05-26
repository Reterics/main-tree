import './SettingsComponent.css';
import SettingsService from "../services/SettingsService";
import {useEffect, useState} from "react";
import {SettingType} from "../types/common";

export const SettingsComponent = () => {
    const [settings, setSettings] = useState<SettingType>({});
    useEffect(() => {
        SettingsService
            .pull()
            .then((_settings)=>{
                if (_settings) {
                    setSettings(_settings);
                }
            });
    }, []);

    return (
        <div>
            <h3>Welcome to the Settings</h3>

            <form>
                <div className='form-row'>
                    <div className='form-col form-label'>
                        <label>OpenAI API Key</label>
                    </div>
                    <div className='form-col form-value'>
                        <input type='text'/>
                    </div>
                </div>

                <div className='form-row form-footer'>
                    <div className='form-col'>
                        <input type={"button"} className="button button-primary" value={'Save Changes'}/>
                    </div>
                </div>
            </form>
        </div>
    )
}
