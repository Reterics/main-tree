import React, { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   MT SHELL LAYOUT - Scoped, conflict-free
   Uses mt-shell, mt-body, mt-sidebar, mt-content classes from admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

export type AppShellProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

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
    <div className="mt-shell">
      {header}
      <div className="mt-body">
        {sidebar}
        <main className="mt-content">
          <div className="mt-content-inner">{children}</div>
        </main>
      </div>
    </div>
  );
};
