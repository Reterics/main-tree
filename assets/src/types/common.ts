import React from "react";


export interface MenuOption {
    label: string
    link: string
    component: React.ComponentElement<any, any>
    alignRight?: boolean
}

export interface NavigationArguments {
    menuOptions: MenuOption[]
    page: string
    setPage: (target: string) => void
}
