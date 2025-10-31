import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const base = 'inline-flex items-center rounded-md font-medium focus:outline-none focus:ring-2';
  const sizeCls = size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-4 py-2';
  const primary = 'text-white bg-[var(--primary)] hover:opacity-90 focus:ring-[var(--primary)]';
  const secondary = 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300';
  const variantCls = variant === 'primary' ? primary : secondary;
  const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const classes = `${base} ${sizeCls} ${variantCls} ${disabledCls} ${className}`.trim();

  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-disabled={disabled} className={classes}>
      {children}
    </button>
  );
};
