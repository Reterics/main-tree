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
  FaEnvelope,
  FaLink,
  FaArrowUpRightFromSquare,
  FaHouse,
  FaGlobe,
  FaChartLine,
  FaUsers,
  FaStar,
  FaHeart,
  FaBook,
  FaCalendar,
  FaFolder,
  FaImage,
  FaCartShopping,
  FaCreditCard,
  FaBell,
  FaLock,
  FaCloudArrowUp,
  FaDatabase,
  FaFileLines,
  FaCirclePlay,
  FaComments,
  FaBullhorn,
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

export const NewsletterIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaEnvelope className={className} aria-hidden="true" />
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

export const LinkIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaLink className={className} aria-hidden="true" />
);

export const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaArrowUpRightFromSquare className={className} aria-hidden="true" />
);

// Quick Links icon options
export const HomeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaHouse className={className} aria-hidden="true" />
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaGlobe className={className} aria-hidden="true" />
);

export const ChartIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaChartLine className={className} aria-hidden="true" />
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaUsers className={className} aria-hidden="true" />
);

export const StarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaStar className={className} aria-hidden="true" />
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaHeart className={className} aria-hidden="true" />
);

export const BookIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaBook className={className} aria-hidden="true" />
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCalendar className={className} aria-hidden="true" />
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaFolder className={className} aria-hidden="true" />
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaImage className={className} aria-hidden="true" />
);

export const CartIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCartShopping className={className} aria-hidden="true" />
);

export const CreditCardIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCreditCard className={className} aria-hidden="true" />
);

export const BellIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaBell className={className} aria-hidden="true" />
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaLock className={className} aria-hidden="true" />
);

export const CloudIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCloudArrowUp className={className} aria-hidden="true" />
);

export const DatabaseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaDatabase className={className} aria-hidden="true" />
);

export const FileIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaFileLines className={className} aria-hidden="true" />
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaCirclePlay className={className} aria-hidden="true" />
);

export const CommentsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaComments className={className} aria-hidden="true" />
);

export const MegaphoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <FaBullhorn className={className} aria-hidden="true" />
);

// Icon registry for Quick Links icon selector
export const QUICK_LINK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  link: LinkIcon,
  home: HomeIcon,
  globe: GlobeIcon,
  chart: ChartIcon,
  users: UsersIcon,
  star: StarIcon,
  heart: HeartIcon,
  book: BookIcon,
  calendar: CalendarIcon,
  folder: FolderIcon,
  image: ImageIcon,
  cart: CartIcon,
  card: CreditCardIcon,
  bell: BellIcon,
  lock: LockIcon,
  cloud: CloudIcon,
  database: DatabaseIcon,
  file: FileIcon,
  play: PlayIcon,
  comments: CommentsIcon,
  megaphone: MegaphoneIcon,
  settings: SettingsIcon,
  mail: NewsletterIcon,
  code: SnippetIcon,
  info: InfoIcon,
};
