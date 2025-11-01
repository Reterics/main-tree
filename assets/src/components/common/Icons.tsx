import React from 'react';
import {
  FaGauge,
  FaGear,
  FaScrewdriverWrench,
  FaRotateRight,
  FaWrench,
  FaCode,
  FaCircleInfo,
  FaWpforms,
  FaFloppyDisk,
  FaMagnifyingGlass,
  FaBroom,
  FaPen,
  FaEye,
  FaCopy,
  FaTrashCan,
  FaPlus,
  FaXmark,
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

export const FormsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaWpforms className={className} aria-hidden="true" />
);

// Action/utility icons for buttons
export const SaveIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaFloppyDisk className={className} aria-hidden="true" />
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaMagnifyingGlass className={className} aria-hidden="true" />
);

export const ClearCacheIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaBroom className={className} aria-hidden="true" />
);

export const EditIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaPen className={className} aria-hidden="true" />
);

export const PreviewIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaEye className={className} aria-hidden="true" />
);

export const DuplicateIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCopy className={className} aria-hidden="true" />
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCopy className={className} aria-hidden="true" />
);

export const DeleteIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaTrashCan className={className} aria-hidden="true" />
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaPlus className={className} aria-hidden="true" />
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaXmark className={className} aria-hidden="true" />
);
