import './SettingsComponent.css';

export const SettingsComponent = () => {
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
