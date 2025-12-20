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
  FormsIcon,
  NewsletterIcon,
} from '../common/Icons';

/* ═══════════════════════════════════════════════════════════════════════════
   MT SIDEBAR NAV - Scoped, conflict-free
   Uses mt-sidebar, mt-nav-item classes from admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

const iconFor = (link: string) => {
  switch (link) {
    case 'dashboard': return DashboardIcon;
    case 'settings': return SettingsIcon;
    case 'acf':
    case 'cptui': return ToolsIcon;
    case 'updates': return UpdateIcon;
    case 'maintenance': return MaintenanceIcon;
    case 'snippets': return SnippetIcon;
    case 'forms': return FormsIcon;
    case 'newsletters': return NewsletterIcon;
    case 'about': return InfoIcon;
    default: return InfoIcon;
  }
};

type Props = NavigationArguments & {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export const SidebarNav: React.FC<Props> = ({ menuOptions, page, setPage, collapsed = false, onToggleCollapse }) => {
  return (
    <aside className={`mt-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="mt-sidebar-nav" aria-label="Primary Navigation">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="mt-collapse-btn"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '« Collapse'}
        </button>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {menuOptions.map(opt => {
            const Icon = iconFor(opt.link);
            const active = page === opt.link || page.startsWith(opt.link + '/');
            return (
              <li key={opt.link}>
                <button
                  className={`mt-nav-item ${active ? 'active' : ''}`}
                  onClick={() => setPage(opt.link)}
                  aria-label={opt.label}
                  title={opt.label}
                  style={collapsed ? { justifyContent: 'center', padding: '6px' } : undefined}
                >
                  <Icon />
                  {!collapsed && <span>{opt.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
