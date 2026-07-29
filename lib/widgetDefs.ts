import { WidgetType, WidgetCategory, Widget } from "./types";

export interface WidgetDef {
  type: WidgetType;
  label: string;
  category: WidgetCategory;
  icon: string; // lucide-react icon name, mapped in Sidebar
  /** Page-chrome widgets toggle page.appBar/bottomNav/drawer instead of creating a tree node */
  isChrome?: boolean;
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: Record<string, any>;
  canHaveChildren?: boolean;
  tappable?: boolean;
}

export const WIDGET_DEFS: WidgetDef[] = [
  // ---------------- Page widgets ----------------
  { type: "appbar", label: "App Bar", category: "page", icon: "PanelTop", isChrome: true, defaultWidth: 0, defaultHeight: 0, defaultProps: {} },
  { type: "bottomnav", label: "Bottom Nav Bar", category: "page", icon: "PanelBottom", isChrome: true, defaultWidth: 0, defaultHeight: 0, defaultProps: {} },
  { type: "drawer", label: "Left Drawer", category: "page", icon: "PanelLeft", isChrome: true, defaultWidth: 0, defaultHeight: 0, defaultProps: {} },

  // ---------------- Layout widgets ----------------
  { type: "container", label: "Container", category: "layout", icon: "Square", canHaveChildren: true, defaultWidth: 220, defaultHeight: 160, defaultProps: { bg: "#f4f4f5", radius: 14, padding: 12 } },
  { type: "row", label: "Row", category: "layout", icon: "Rows", canHaveChildren: true, defaultWidth: 260, defaultHeight: 90, defaultProps: { bg: "transparent", padding: 8, gap: 8 } },
  { type: "column", label: "Column", category: "layout", icon: "Columns", canHaveChildren: true, defaultWidth: 180, defaultHeight: 220, defaultProps: { bg: "transparent", padding: 8, gap: 8 } },
  { type: "stack", label: "Stack", category: "layout", icon: "Layers2", canHaveChildren: true, defaultWidth: 200, defaultHeight: 160, defaultProps: { bg: "#e4e4e7" } },
  { type: "card", label: "Card", category: "layout", icon: "CreditCard", canHaveChildren: true, defaultWidth: 240, defaultHeight: 140, defaultProps: { bg: "#ffffff", radius: 16, padding: 14, elevation: 4 } },
  { type: "listview", label: "List View", category: "layout", icon: "List", canHaveChildren: true, defaultWidth: 300, defaultHeight: 220, defaultProps: { bg: "#ffffff", gap: 6, padding: 8, itemCount: 4 } },
  { type: "gridview", label: "Grid View", category: "layout", icon: "LayoutGrid", canHaveChildren: true, defaultWidth: 300, defaultHeight: 220, defaultProps: { bg: "#ffffff", columns: 2, gap: 8, padding: 8, itemCount: 4 } },
  { type: "pageview", label: "Page View", category: "layout", icon: "GalleryHorizontal", canHaveChildren: true, defaultWidth: 300, defaultHeight: 160, defaultProps: { bg: "#e0e7ff", pages: 3 } },
  { type: "sizedbox", label: "Sized Box", category: "layout", icon: "Minus", defaultWidth: 100, defaultHeight: 40, defaultProps: {} },
  { type: "opacity", label: "Opacity", category: "layout", icon: "CircleDashed", canHaveChildren: true, defaultWidth: 160, defaultHeight: 100, defaultProps: { opacity: 0.6, bg: "#6d5efc" } },

  // ---------------- Base widgets ----------------
  { type: "text", label: "Text", category: "base", icon: "Type", defaultWidth: 140, defaultHeight: 28, defaultProps: { text: "Text", fontSize: 16, fontWeight: 400, color: "#18181b", align: "left" } },
  { type: "textfield", label: "Text Field", category: "base", icon: "TextCursorInput", defaultWidth: 220, defaultHeight: 44, defaultProps: { placeholder: "Enter text", bg: "#ffffff", border: "#d4d4d8", radius: 8 } },
  { type: "textbutton", label: "Text Button", category: "base", icon: "MousePointer", tappable: true, defaultWidth: 140, defaultHeight: 44, defaultProps: { text: "Button", bg: "#6d5efc", color: "#ffffff", radius: 10 } },
  { type: "image", label: "Image", category: "base", icon: "Image", defaultWidth: 160, defaultHeight: 120, defaultProps: { radius: 12, seed: Math.floor(Math.random() * 1000) } },
  { type: "checkbox", label: "Checkbox", category: "base", icon: "SquareCheck", defaultWidth: 24, defaultHeight: 24, defaultProps: { checked: true, color: "#6d5efc" } },
  { type: "radio", label: "Radio Button", category: "base", icon: "Circle", defaultWidth: 24, defaultHeight: 24, defaultProps: { selected: true, color: "#6d5efc" } },
  { type: "icon", label: "Icon", category: "base", icon: "Star", defaultWidth: 28, defaultHeight: 28, defaultProps: { icon: "Star", color: "#18181b", size: 22 } },
  { type: "iconbutton", label: "Icon Button", category: "base", icon: "CircleDot", tappable: true, defaultWidth: 44, defaultHeight: 44, defaultProps: { icon: "Heart", color: "#6d5efc", bg: "#f4f4f5" } },
  { type: "listtile", label: "List Tile", category: "base", icon: "Rows3", tappable: true, defaultWidth: 280, defaultHeight: 60, defaultProps: { title: "Title", subtitle: "Subtitle", icon: "User", bg: "#ffffff" } },
  { type: "videoplayer", label: "Video Player", category: "base", icon: "Video", defaultWidth: 260, defaultHeight: 150, defaultProps: { bg: "#18181b" } },
  { type: "audioplayer", label: "Audio Player", category: "base", icon: "AudioLines", defaultWidth: 260, defaultHeight: 56, defaultProps: { bg: "#f4f4f5", accent: "#6d5efc" } },
  { type: "switch", label: "Switch", category: "base", icon: "ToggleRight", defaultWidth: 46, defaultHeight: 26, defaultProps: { on: true, color: "#6d5efc" } },
  { type: "checkboxlist", label: "Checkbox List", category: "base", icon: "ListChecks", defaultWidth: 240, defaultHeight: 120, defaultProps: { items: ["Option A", "Option B", "Option C"], color: "#6d5efc" } },
  { type: "divider", label: "Divider", category: "base", icon: "Minus", defaultWidth: 260, defaultHeight: 1, defaultProps: { color: "#e4e4e7", thickness: 1 } },
  { type: "calendar", label: "Calendar", category: "base", icon: "Calendar", defaultWidth: 280, defaultHeight: 240, defaultProps: { accent: "#6d5efc" } },
  { type: "dropdown", label: "Dropdown", category: "base", icon: "ChevronDown", defaultWidth: 200, defaultHeight: 44, defaultProps: { options: ["Option 1", "Option 2"], bg: "#ffffff", border: "#d4d4d8" } },
  { type: "circleimage", label: "Circle Avatar", category: "base", icon: "CircleUserRound", defaultWidth: 64, defaultHeight: 64, defaultProps: { seed: Math.floor(Math.random() * 1000) } },
  { type: "slider", label: "Slider", category: "base", icon: "SlidersHorizontal", defaultWidth: 220, defaultHeight: 32, defaultProps: { value: 60, color: "#6d5efc" } },
  { type: "lottie", label: "Lottie Animation", category: "base", icon: "Sparkles", defaultWidth: 160, defaultHeight: 160, defaultProps: { bg: "#f4f4f5" } },
  { type: "creditcardview", label: "Credit Card View", category: "base", icon: "CreditCard", defaultWidth: 260, defaultHeight: 150, defaultProps: { bg1: "#6d5efc", bg2: "#18181b", holder: "Jane Doe", number: "•••• •••• •••• 4242" } },
  { type: "otptextfield", label: "OTP Text Field", category: "base", icon: "KeyRound", defaultWidth: 220, defaultHeight: 48, defaultProps: { digits: 4, color: "#6d5efc" } },
  { type: "searchbar", label: "Search Bar", category: "base", icon: "Search", defaultWidth: 260, defaultHeight: 44, defaultProps: { placeholder: "Search", bg: "#f4f4f5", radius: 22 } },
  { type: "tabbar", label: "Tab Bar", category: "base", icon: "SquareStack", defaultWidth: 280, defaultHeight: 40, defaultProps: { tabs: ["Tab 1", "Tab 2", "Tab 3"], activeColor: "#6d5efc" } },
  { type: "progressbar", label: "Linear Progress", category: "base", icon: "Minus", defaultWidth: 220, defaultHeight: 8, defaultProps: { value: 65, color: "#6d5efc", track: "#e4e4e7" } },
  { type: "circularprogress", label: "Circular Progress", category: "base", icon: "LoaderCircle", defaultWidth: 48, defaultHeight: 48, defaultProps: { value: 70, color: "#6d5efc" } },
  { type: "ratingbar", label: "Rating Bar", category: "base", icon: "Star", defaultWidth: 140, defaultHeight: 26, defaultProps: { value: 3, max: 5, color: "#f59e0b" } },
  { type: "badge", label: "Badge", category: "base", icon: "CircleDot", defaultWidth: 60, defaultHeight: 24, defaultProps: { text: "New", bg: "#ef4444", color: "#ffffff" } },
  { type: "chip", label: "Chip", category: "base", icon: "Tag", defaultWidth: 90, defaultHeight: 30, defaultProps: { text: "Chip", bg: "#ede9fe", color: "#6d28d9" } },
  { type: "snackbar", label: "Snackbar", category: "base", icon: "MessageSquare", defaultWidth: 280, defaultHeight: 46, defaultProps: { text: "This is a snackbar message", bg: "#27272a", color: "#ffffff" } },
];

let idCounter = 1;
export const nextId = () => `w${idCounter++}_${Math.random().toString(36).slice(2, 6)}`;

export function makeWidget(type: WidgetType): Widget {
  const def = WIDGET_DEFS.find((d) => d.type === type)!;
  const id = nextId();
  return {
    id,
    type,
    name: def.label,
    hidden: false,
    locked: false,
    width: def.defaultWidth,
    height: def.defaultHeight,
    props: { ...def.defaultProps },
    children: def.canHaveChildren ? [] : undefined,
    navigateTo: null,
  };
}

export function getDef(type: WidgetType): WidgetDef {
  return WIDGET_DEFS.find((d) => d.type === type)!;
}
