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
  const navWidthClass = collapsed ? 'w-[36px]' : 'w-40';
  return (
    <nav className={navWidthClass} aria-label="Primary Navigation">
      <div className="py-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`mx-2 mb-2 w-[calc(100%-1rem)] inline-flex items-center justify-center rounded border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-50 ${collapsed ? 'h-9 px-0' : 'h-8 px-2'}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <span aria-hidden>»</span>
          ) : (
            '‹ Collapse'
          )}
          {collapsed && <span className="sr-only">Expand</span>}
        </button>
        <ul className="space-y-0">
          {menuOptions.map(opt => {
            const Icon = iconFor(opt.link);
            const active = page === opt.link;
            return (
              <li key={opt.link}>
                <button
                  className={`w-full inline-flex ${collapsed ? 'justify-center gap-0 px-0 h-9' : 'items-center gap-2 px-3 h-9'} rounded text-[13px] ${active ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setPage(opt.link)}
                  aria-label={opt.label}
                  title={opt.label}
                >
                  <Icon className="h-5 w-5" />
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