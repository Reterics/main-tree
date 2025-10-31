import React, { useEffect, useState } from 'react';

export type AppShellProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

// Persist a simple boolean in localStorage
const LS_KEY = 'mt.sidebar.collapsed';

export const useSidebarCollapsed = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      return v === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, collapsed ? '1' : '0');
    } catch {}
  }, [collapsed]);

  return { collapsed, setCollapsed } as const;
};

export const AppShell: React.FC<AppShellProps> = ({ header, sidebar, children }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-32px-65px)]">
      {/* Header */}
      <header className="shrink-0">{header}</header>
      {/* Main area */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          {sidebar}
        </aside>
        {/* Content */}
        <main className="flex-1 min-w-0 overflow-auto bg-[var(--surface)] p-3">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
};