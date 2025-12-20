export interface MenuOption {
    label: string
    link: string
    component: JSX.Element
    alignRight?: boolean
    /** If set, this menu can be toggled via settings. The value is the settings key. */
    devMenuKey?: string
}

export interface NavigationArguments {
    menuOptions: MenuOption[]
    page: string
    setPage: (target: string) => void
}

export interface SettingType {
    [key: string]: string|null;
}

export interface WPUser {
    restUrl: string
    nonce: string
    public?: boolean
    adminUrl?: string
}
