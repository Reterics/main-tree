import {createRoot} from "react-dom/client";
import {useState} from "react";
import {NavigationComponent} from "./components/NavigationComponent";
import {DashboardComponent} from "./components/DashboardComponent";
import {SettingsComponent} from "./components/SettingsComponent";
import {AboutComponent} from "./components/AboutComponent";
import {MenuOption} from "./types/common";
import './admin.css';

function MainTreeApp() {
    const [page, setPage] = useState(location.hash.substring(1) || 'dashboard')

    const menuOptions: MenuOption[] = [
        {
            label: 'Dashboard',
            link: 'dashboard',
            component: <DashboardComponent />
        },
        {
            label: 'Settings',
            link: 'settings',
            component: <SettingsComponent />
        },
        {
            label: 'About',
            link: 'about',
            component: <AboutComponent />
        }
    ];

    const activeMenu = menuOptions.find(menu=>menu.link === page) || menuOptions[0];

    return (<div className={'mt-nav-outer'}>
        <NavigationComponent page={page} setPage={setPage} menuOptions={menuOptions}/>
        <div className={'mt-container'}>
            {activeMenu.component}
        </div>
    </div>);
}

window.addEventListener(
    'load',
    function () {
        const mainTreeNode = document.getElementById('main-tree');
        if (mainTreeNode) {
            const root = createRoot( mainTreeNode );

            root.render(
                <MainTreeApp />,
            );
        } else {
            throw Error('MainTree DOM is not found');
        }
    },
    false
);
