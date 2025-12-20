import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   MT BUTTON COMPONENTS - Scoped, conflict-free
   Uses mt-btn-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

type ButtonVariant = 'primary' | 'default' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  'aria-label'?: string;
  title?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'default',
  size = 'md',
  icon,
  iconOnly = false,
  'aria-label': ariaLabel,
  title,
}) => {
  const classes = [
    'mt-btn',
    `mt-btn-${variant}`,
    size === 'sm' ? 'mt-btn-sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={classes}
    >
      {icon}
      {!iconOnly && children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON GROUP
// ─────────────────────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '' }) => (
  <div className={`mt-header-actions ${className}`.trim()}>{children}</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ICON BUTTON (Convenience wrapper)
// ─────────────────────────────────────────────────────────────────────────────

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
  title?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'ghost',
  size = 'sm',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  title,
}) => (
  <Button
    onClick={onClick}
    variant={variant}
    size={size}
    disabled={disabled}
    className={className}
    icon={icon}
    iconOnly
    aria-label={ariaLabel}
    title={title || ariaLabel}
  />
);
