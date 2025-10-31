import React from 'react';
import { NavigationArguments } from '../../types/common';
import {
  DashboardIcon,
  SettingsIcon,
  ToolsIcon,
  UpdateIcon,
  MaintenanceIcon,
  SnippetIcon,
  InfoIcon,
} from '../common/Icons';

const iconFor = (link: string) => {
  switch (link) {
    case 'dashboard':
      return DashboardIcon;
    case 'settings':
      return SettingsIcon;
    case 'acf':
    case 'cptui':
      return ToolsIcon;
    case 'updates':
      return UpdateIcon;
    case 'maintenance':
      return MaintenanceIcon;
    case 'snippets':
      return SnippetIcon;
    case 'about':
      return InfoIcon;
    default:
      return InfoIcon;
  }
};

type Props = NavigationArguments & {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export const SidebarNav: React.FC<Props> = ({ menuOptions, page, setPage, collapsed = false, onToggleCollapse }) => {
  return (
    <nav className="w-56" aria-label="Primary Navigation" style={collapsed ? {width: '56px'} : undefined}>
      <div className="py-2">
        <button type="button" onClick={onToggleCollapse} className="mx-2 mb-2 w-[calc(100%-1rem)] inline-flex items-center justify-center rounded border border-gray-300 text-xs text-gray-700 py-1 hover:bg-gray-50">
          {collapsed ? '›' : '‹ Collapse'}
        </button>
        <ul className="space-y-1">
          {menuOptions.map(opt => {
            const Icon = iconFor(opt.link);
            const active = page === opt.link;
            return (
              <li key={opt.link}>
                <button
                  className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded text-sm ${active ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setPage(opt.link)}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span className="truncate">{opt.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};