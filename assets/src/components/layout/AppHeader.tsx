import React from 'react';
import logo from '../../../images/logo.svg';
import { SearchIcon, ClearCacheIcon, SaveIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { Toggle } from '../common/Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT HEADER - Scoped, conflict-free
   Uses mt-header-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

type Props = {
  onSave?: () => void;
  onSearch?: () => void;
  onClearCache?: () => void;
  maintenanceOn?: boolean;
  onToggleMaintenance?: () => void;
};

export const AppHeader: React.FC<Props> = ({ onSave, onSearch, onClearCache, maintenanceOn, onToggleMaintenance }) => {
  return (
    <header className="mt-header">
      <div className="mt-header-brand">
        <img src={logo} alt="Logo" />
        <span className="mt-header-title">Main Tree</span>
      </div>

      <div className="mt-header-actions">
        <Button variant="ghost" size="sm" icon={<SearchIcon />} onClick={onSearch}>Search</Button>
        <Button variant="ghost" size="sm" icon={<ClearCacheIcon />} onClick={onClearCache}>Clear Cache</Button>
        <Button variant="primary" size="sm" icon={<SaveIcon />} onClick={onSave}>Save</Button>
        <span style={{ marginLeft: 4, paddingLeft: 8, borderLeft: '1px solid var(--mt-border)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--mt-text-muted)' }}>Maintenance</span>
          <Toggle checked={!!maintenanceOn} onChange={() => onToggleMaintenance?.()} />
        </span>
      </div>
    </header>
  );
};
