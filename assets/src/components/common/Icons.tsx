import React from 'react';

export const DashboardIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z"/>
  </svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14,12.94a7.43,7.43,0,0,0,.05-.94,7.43,7.43,0,0,0-.05-.94l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.37,7.37,0,0,0-1.63-.94l-.38-2.65A.5.5,0,0,0,13.7,2H10.3a.5.5,0,0,0-.49.42L9.43,5.07a7.37,7.37,0,0,0-1.63.94l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L4.94,11.06a7.43,7.43,0,0,0-.05.94,7.43,7.43,0,0,0,.05.94L2.83,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.37,7.37,0,0,0,1.63.94l.38,2.65a.5.5,0,0,0,.49.42h3.4a.5.5,0,0,0,.49-.42l.38-2.65a7.37,7.37,0,0,0,1.63-.94l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
  </svg>
);

export const ToolsIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.71 20.29l-6.4-6.4a5.5 5.5 0 1 0-1.41 1.41l6.4 6.4a1 1 0 0 0 1.41-1.41zM5 10.5A5.5 5.5 0 1 1 10.5 16 5.51 5.51 0 0 1 5 10.5z"/>
  </svg>
);

export const UpdateIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 0 1-9.9 1h-2.02A7 7 0 0 0 19 13c0-3.87-3.13-7-7-7z"/>
  </svg>
);

export const MaintenanceIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 19.59 19.59 22 14 16.41V14h2.41L22 19.59zM7 14a5 5 0 1 1 5-5H9v2h5a5 5 0 0 1-7 3z"/>
  </svg>
);

export const SnippetIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 17l-5-5 5-5 1.41 1.41L5.83 12l3.58 3.59L8 17zm8 0l-1.41-1.41L18.17 12l-3.58-3.59L16 7l5 5-5 5z"/>
  </svg>
);

export const InfoIcon: React.FC<{className?: string}> = ({className=''}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
);
