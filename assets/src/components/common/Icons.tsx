import React from 'react';
import {
  FaGauge,
  FaGear,
  FaScrewdriverWrench,
  FaRotateRight,
  FaWrench,
  FaCode,
  FaCircleInfo,
} from 'react-icons/fa6';

// Each icon component accepts an optional `className` so size/color can be controlled
// by Tailwind (e.g., `h-5 w-5 text-gray-600`). Icons inherit `currentColor`.

export const DashboardIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaGauge className={className} aria-hidden="true" />
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaGear className={className} aria-hidden="true" />
);

export const ToolsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaScrewdriverWrench className={className} aria-hidden="true" />
);

export const UpdateIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaRotateRight className={className} aria-hidden="true" />
);

export const MaintenanceIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaWrench className={className} aria-hidden="true" />
);

export const SnippetIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCode className={className} aria-hidden="true" />
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCircleInfo className={className} aria-hidden="true" />
);
