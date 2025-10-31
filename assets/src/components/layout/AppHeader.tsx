import React from 'react';
import logo from '../../../images/logo.svg';

type Props = {
  onSave?: () => void;
  onSearch?: () => void;
  onClearCache?: () => void;
  maintenanceOn?: boolean;
  onToggleMaintenance?: () => void;
};

export const AppHeader: React.FC<Props> = ({ onSave, onSearch, onClearCache, maintenanceOn, onToggleMaintenance }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2 min-w-0">
        <img src={logo} alt="Logo" className="h-7 w-auto" />
        <div className="ml-1">
          <div className="text-sm font-semibold text-gray-900 leading-5">Main Tree</div>
          <div className="text-xs text-gray-500 leading-4">Admin Console</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={onSearch} className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50">
          Search
        </button>
        <button type="button" onClick={onClearCache} className="inline-flex items-center px-2.5 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50">
          Clear Cache
        </button>
        <button type="button" onClick={onSave} className="inline-flex items-center px-2.5 py-1.5 rounded bg-[var(--primary)] text-white text-xs font-medium hover:opacity-90">
          Save
        </button>
        <label className="inline-flex items-center gap-1 text-xs text-gray-700 ml-2">
          <input type="checkbox" checked={!!maintenanceOn} onChange={onToggleMaintenance} className="mr-1" />
          Maintenance
        </label>
      </div>
    </div>
  );
};