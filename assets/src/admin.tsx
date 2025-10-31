import React, { useEffect, useMemo, useState } from "react";
import {createRoot} from "react-dom/client";
import {DashboardComponent} from "./components/DashboardComponent";
import {SettingsComponent} from "./components/SettingsComponent";
import {AboutComponent} from "./components/AboutComponent";
import {MenuOption} from "./types/common";
import './admin.css';
import {SettingsProvider, useSettings} from "./context/SettingsContext";
import { ACFToolsComponent } from "./components/ACFToolsComponent";
import { CPTUIComponent } from "./components/CPTUIComponent";
import { UpdatesManagerComponent } from "./components/UpdatesManagerComponent";
import { MaintenanceModeComponent } from "./components/MaintenanceModeComponent";
import { CodeSnippetsComponent } from "./components/CodeSnippetsComponent";
import { AppShell, useSidebarCollapsed } from "./components/layout/AppShell";
import { AppHeader } from "./components/layout/AppHeader";
import { SidebarNav } from "./components/layout/SidebarNav";

function MainTreeApp() {
    const [page, setPage] = useState(location.hash.substring(1) || 'dashboard');
    const { collapsed, setCollapsed } = useSidebarCollapsed();
    const [maintenanceOn, setMaintenanceOn] = useState(false);

    useEffect(() => {
        const onHashChange = () => setPage(location.hash.substring(1) || 'dashboard');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        // reflect page to hash
        if (location.hash.substring(1) !== page) {
            location.hash = page;
        }
    }, [page]);

    const menuOptions: MenuOption[] = useMemo(() => ([
        { label: 'Dashboard', link: 'dashboard', component: <DashboardComponent /> },
        { label: 'Settings', link: 'settings', component: <SettingsComponent /> },
        { label: 'ACF', link: 'acf', component: <ACFToolsComponent /> },
        { label: 'CPT UI', link: 'cptui', component: <CPTUIComponent /> },
        { label: 'Updates', link: 'updates', component: <UpdatesManagerComponent /> },
        { label: 'Maintenance', link: 'maintenance', component: <MaintenanceModeComponent /> },
        { label: 'Snippets', link: 'snippets', component: <CodeSnippetsComponent /> },
        { label: 'About', link: 'about', component: <AboutComponent /> },
    ]), []);

    const activeMenu = menuOptions.find(menu=>menu.link === page) || menuOptions[0];

    return (
        <AppShell
            header={<HeaderBridge maintenanceOn={maintenanceOn} setMaintenanceOn={setMaintenanceOn} />}
            sidebar={<SidebarNav page={page} setPage={setPage} menuOptions={menuOptions} collapsed={collapsed} onToggleCollapse={()=>setCollapsed(!collapsed)} />}
        >
            {activeMenu.component}
        </AppShell>
    );
}

const HeaderBridge: React.FC<{maintenanceOn: boolean; setMaintenanceOn: (v:boolean)=>void;}> = ({maintenanceOn, setMaintenanceOn}) => {
    const { saveAll } = useSettings();

    const handleSave = async () => {
        await saveAll();
    };

    const handleSearch = () => {
        // placeholder for command palette
        alert('Search coming soon');
    };

    const handleClearCache = () => {
        // placeholder
        alert('Cache cleared (placeholder)');
    };

    return (
        <AppHeader
            onSave={handleSave}
            onSearch={handleSearch}
            onClearCache={handleClearCache}
            maintenanceOn={maintenanceOn}
            onToggleMaintenance={() => setMaintenanceOn(!maintenanceOn)}
        />
    );
};

window.addEventListener(
    'load',
    function () {
        const mainTreeNode = document.getElementById('main-tree');
        if (mainTreeNode) {
            const root = createRoot( mainTreeNode );

            root.render(
                <SettingsProvider>
                    <MainTreeApp />
                </SettingsProvider>,
            );
        } else {
            throw Error('MainTree DOM is not found');
        }
    },
    false
);
