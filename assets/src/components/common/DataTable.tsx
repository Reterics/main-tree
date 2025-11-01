import React from 'react';

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
  const alignClass = (align?: 'left'|'center'|'right') => align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-3 py-2 font-medium text-gray-700 ${alignClass(col.align)}`}
                style={{ width: col.width }}
                scope="col"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-3 py-2 font-medium text-gray-700 text-right" scope="col">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td className="px-3 py-3 text-red-600" colSpan={columns.length + (actions.length ? 1 : 0)}>
                {error}
              </td>
            </tr>
          )}
          {loading && !error && (
            <tr>
              <td className="px-3 py-3 text-gray-500" colSpan={columns.length + (actions.length ? 1 : 0)}>
                Loading...
              </td>
            </tr>
          )}
          {!loading && !error && data.length === 0 && (
            <tr>
              <td className="px-3 py-3 text-gray-500" colSpan={columns.length + (actions.length ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading && !error && data.map(row => (
            <tr key={rowKey(row)} className="border-t border-gray-100 hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className={`px-3 py-2 align-middle ${alignClass(col.align)}`}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    {actions.map(action => {
                      const disabled = action.disabled ? action.disabled(row) : false;
                      const base = action.intent === 'danger'
                        ? 'text-red-600 hover:bg-red-50 border-red-300'
                        : action.intent === 'primary'
                          ? 'text-indigo-700 hover:bg-indigo-50 border-indigo-200'
                          : 'text-gray-700 hover:bg-gray-100 border-gray-300';
                      return (
                        <button
                          key={action.key}
                          type="button"
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs ${disabled ? 'opacity-50 cursor-not-allowed' : base}`}
                          onClick={() => !disabled && action.onAction(row)}
                          aria-label={action.label}
                          title={action.tooltip || action.label}
                          disabled={disabled}
                        >
                          {action.icon}
                          <span className="hidden sm:inline">{action.label}</span>
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
