import React from 'react';

type Props = {
    href: string;
    children: React.ReactNode;
    className?: string;
    newTab?: boolean;
};

export const ExternalLinkButton: React.FC<Props> = ({ href, children, className = '', newTab = true }) => (
    <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
        {children}
    </a>
);
