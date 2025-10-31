import React from 'react';

type Props = {
    href: string;
    children: React.ReactNode;
    className?: string;
    newTab?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md';
};

export const ExternalLinkButton: React.FC<Props> = ({ href, children, className = '', newTab = true, variant = 'primary', size = 'md' }) => {
    const base = 'inline-flex items-center rounded-md font-medium focus:outline-none focus:ring-2';
    const sizeCls = size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-4 py-2';
    const primary = 'text-white bg-[var(--primary)] hover:opacity-90 focus:ring-[var(--primary)]';
    const secondary = 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300';
    const styles = `${base} ${sizeCls} ${variant === 'primary' ? primary : secondary}`;
    return (
        <div
            onClick={() => {
                window.open(href, newTab ? '_blank' : undefined);
            }}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className={`${styles} ${className}`}
        >
            {children}
        </div>
    );
};
