import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export const PageContainer: React.FC<Props> = ({ title, subtitle, actions, children }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (<p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>)}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};