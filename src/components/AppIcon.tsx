import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  Bell,
  Bold,
  Brain,
  BriefcaseBusiness,
  Camera,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  Globe,
  Grid2x2,
  Home,
  Italic,
  ImageIcon,
  LayoutGrid,
  Link2,
  List,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  MapPin,
  Menu,
  Network,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  Quote,
  RefreshCw,
  Rocket,
  RotateCcw,
  Rss,
  Search,
  Send,
  Settings,
  SquarePen,
  StickyNote,
  Terminal,
  Trash2,
  TriangleAlert,
  Upload,
  UploadCloud,
  User,
  X,
} from "lucide-react";

export type AppIconName =
  | "terminal"
  | "menu"
  | "close"
  | "arrow_right_alt"
  | "location_on"
  | "call"
  | "alternate_email"
  | "progress_activity"
  | "open_in_new"
  | "add"
  | "search"
  | "edit"
  | "delete"
  | "image"
  | "link"
  | "psychology"
  | "person"
  | "check_circle"
  | "upload"
  | "settings"
  | "home"
  | "web"
  | "dns"
  | "integration_instructions"
  | "mail"
  | "dashboard"
  | "work"
  | "rss_feed"
  | "add_circle"
  | "edit_square"
  | "cloud_upload"
  | "download"
  | "folder"
  | "visibility"
  | "visibility_off"
  | "notifications"
  | "rocket_launch"
  | "edit_note"
  | "warning"
  | "lock"
  | "sync"
  | "send"
  | "mark_email_read"
  | "photo_camera"
  | "deployed_code"
  | "edit_document"
  | "public"
  | "code"
  | "link_off"
  | "restart_alt"
  | "done_all"
  | "sort"
  | "chevron_left"
  | "chevron_right"
  | "save"
  | "rebase_edit"
  | "grid_view"
  | "article"
  | "publish"
  | "unpublish"
  | "arrow_back"
  | "schedule"
  | "swap_horiz"
  | "expand_more"
  | "content_copy"
  | "format_bold"
  | "format_italic"
  | "format_quote"
  | "format_list_bulleted"
  | "code_blocks";

const APP_ICONS: Record<AppIconName, LucideIcon> = {
  terminal: Terminal,
  menu: Menu,
  close: X,
  arrow_right_alt: ArrowRight,
  location_on: MapPin,
  call: Phone,
  alternate_email: Mail,
  progress_activity: LoaderCircle,
  open_in_new: ExternalLink,
  add: Plus,
  search: Search,
  edit: Pencil,
  delete: Trash2,
  image: ImageIcon,
  link: Link2,
  psychology: Brain,
  person: User,
  check_circle: CheckCircle2,
  upload: Upload,
  settings: Settings,
  home: Home,
  web: Globe,
  dns: Network,
  integration_instructions: GitBranch,
  mail: Mail,
  dashboard: LayoutGrid,
  work: BriefcaseBusiness,
  rss_feed: Rss,
  add_circle: PlusCircle,
  edit_square: SquarePen,
  cloud_upload: UploadCloud,
  download: Download,
  folder: Folder,
  visibility: Eye,
  visibility_off: EyeOff,
  notifications: Bell,
  rocket_launch: Rocket,
  edit_note: FileText,
  warning: TriangleAlert,
  lock: Lock,
  sync: RefreshCw,
  send: Send,
  mark_email_read: MailCheck,
  photo_camera: Camera,
  deployed_code: Code2,
  edit_document: FileText,
  public: Globe,
  code: Code2,
  link_off: Link2,
  restart_alt: RotateCcw,
  done_all: CheckCheck,
  sort: ArrowUpDown,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  save: CheckCircle2,
  rebase_edit: Pencil,
  grid_view: LayoutGrid,
  article: FileText,
  publish: Rocket,
  unpublish: RotateCcw,
  arrow_back: ArrowLeft,
  schedule: Clock3,
  swap_horiz: ArrowLeftRight,
  expand_more: ChevronDown,
  content_copy: Copy,
  format_bold: Bold,
  format_italic: Italic,
  format_quote: Quote,
  format_list_bulleted: List,
  code_blocks: Code2,
};

export function AppIcon({
  name,
  className = "",
  strokeWidth = 2,
}: {
  name: AppIconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = APP_ICONS[name];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
