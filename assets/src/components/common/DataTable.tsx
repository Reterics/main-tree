import React from 'react';
import { Spinner } from './Form';

/* ═══════════════════════════════════════════════════════════════════════════
   MT DATA TABLE - Scoped, conflict-free
   Uses mt-table-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

export type Column<T> = {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  intent?: 'default' | 'primary' | 'danger';
  tooltip?: string;
  disabled?: (row: T) => boolean;
  onAction: (row: T) => void;
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  actions?: RowAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  error?: string | null;
}

export function DataTable<T extends {}>({
  columns,
  data,
  rowKey,
  actions = [],
  loading = false,
  emptyMessage = 'No items to display.',
  error = null,
}: DataTableProps<T>) {
  const alignStyle = (align?: 'left'|'center'|'right'): React.CSSProperties => ({
    textAlign: align || 'left',
  });

  const getActionClass = (intent?: 'default' | 'primary' | 'danger') => {
    if (intent === 'danger') return 'mt-btn mt-btn-danger mt-btn-sm';
    if (intent === 'primary') return 'mt-btn mt-btn-primary mt-btn-sm';
    return 'mt-btn mt-btn-ghost mt-btn-sm';
  };

  return (
    <div className="mt-card" style={{ overflow: 'hidden' }}>
      <table className="mt-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width, ...alignStyle(col.align) }} scope="col">
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th style={{ textAlign: 'right' }} scope="col">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td colSpan={columns.length + (actions.length ? 1 : 0)} style={{ color: 'var(--mt-danger)' }}>
                {error}
              </td>
            </tr>
          )}
          {loading && !error && (
            <tr>
              <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Spinner /> Loading...
                </span>
              </td>
            </tr>
          )}
          {!loading && !error && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions.length ? 1 : 0)}
                style={{ textAlign: 'center', padding: '16px 10px', color: 'var(--mt-text-muted)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading && !error && data.map(row => (
            <tr key={rowKey(row)}>
              {columns.map(col => (
                <td key={col.key} style={alignStyle(col.align)}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td>
                  <div className="mt-table-actions">
                    {actions.map(action => {
                      const disabled = action.disabled ? action.disabled(row) : false;
                      return (
                        <button
                          key={action.key}
                          type="button"
                          className={getActionClass(action.intent)}
                          onClick={() => !disabled && action.onAction(row)}
                          aria-label={action.label}
                          title={action.tooltip || action.label}
                          disabled={disabled}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
