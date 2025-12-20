import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   MT FORM COMPONENTS - Scoped, conflict-free
   Uses mt-* CSS classes defined in admin.css
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input className={`mt-input ${className}`} {...props} />
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => (
  <select className={`mt-select ${className}`} {...props}>{children}</select>
);

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => (
  <textarea className={`mt-textarea ${className}`} {...props} />
);

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE / SWITCH
// ─────────────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className="mt-toggle"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// CHECKBOX
// ─────────────────────────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled }) => (
  <label className="mt-checkbox-wrap">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    {label && <span>{label}</span>}
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// FORM FIELD
// ─────────────────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, hint, error, children }) => (
  <div className="mt-field">
    <label className={`mt-label ${required ? 'mt-label-required' : ''}`}>{label}</label>
    {children}
    {hint && !error && <div className="mt-hint">{hint}</div>}
    {error && <div className="mt-error">{error}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// INLINE FIELD (for settings rows)
// ─────────────────────────────────────────────────────────────────────────────

interface InlineFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const InlineField: React.FC<InlineFieldProps> = ({ label, description, children }) => (
  <div className="mt-inline-field">
    <div>
      <div className="mt-inline-field-label">{label}</div>
      {description && <div className="mt-inline-field-desc">{description}</div>}
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement>{
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`mt-card ${className}`} {...props}>{children}</div>
);

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="mt-card-header">
    <div>
      <h4 className="mt-card-title">{title}</h4>
      {subtitle && <p className="mt-card-subtitle">{subtitle}</p>}
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-card-body ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-card-footer">{children}</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="mt-page-header">
    <div>
      <h2 className="mt-page-title">{title}</h2>
      {subtitle && <p className="mt-page-subtitle">{subtitle}</p>}
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => (
  <span className={`mt-badge ${variant !== 'default' ? `mt-badge-${variant}` : ''}`}>{children}</span>
);

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="mt-empty">
    {title && <h4 className="mt-empty-title">{title}</h4>}
    {description && <p className="mt-empty-text">{description}</p>}
    {action && <div style={{ marginTop: 12 }}>{action}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────────────────────────

export const Spinner: React.FC = () => <span className="mt-spinner" />;

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const Divider: React.FC = () => <hr className="mt-divider" />;

// ─────────────────────────────────────────────────────────────────────────────
// ALERT
// ─────────────────────────────────────────────────────────────────────────────

interface AlertProps {
  children: React.ReactNode;
  variant?: 'danger' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'danger' }) => (
  <div className={`mt-alert mt-alert-${variant}`}>{children}</div>
);
