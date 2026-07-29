export type WidgetCategory = "page" | "layout" | "base";

export type WidgetType =
  // page (chrome toggles, not tree nodes)
  | "appbar"
  | "bottomnav"
  | "drawer"
  // layout
  | "container"
  | "row"
  | "column"
  | "stack"
  | "card"
  | "listview"
  | "gridview"
  | "pageview"
  | "sizedbox"
  | "opacity"
  // base
  | "text"
  | "textfield"
  | "textbutton"
  | "image"
  | "checkbox"
  | "radio"
  | "icon"
  | "iconbutton"
  | "listtile"
  | "videoplayer"
  | "audioplayer"
  | "switch"
  | "checkboxlist"
  | "divider"
  | "calendar"
  | "dropdown"
  | "circleimage"
  | "slider"
  | "lottie"
  | "creditcardview"
  | "otptextfield"
  | "tabbar"
  | "progressbar"
  | "circularprogress"
  | "ratingbar"
  | "searchbar"
  | "badge"
  | "chip"
  | "snackbar";

export interface Widget {
  id: string;
  type: WidgetType;
  name: string;
  hidden?: boolean;
  locked?: boolean;
  x?: number;
  y?: number;
  width: number;
  height: number;
  props: Record<string, any>;
  children?: Widget[];
  /** id of another Page this widget navigates to when tapped (buttons, list tiles, icon buttons) */
  navigateTo?: string | null;
}

export interface AppBarConfig {
  enabled: boolean;
  title: string;
  bg: string;
  color: string;
}

export interface BottomNavConfig {
  enabled: boolean;
  bg: string;
  activeColor: string;
  items: { label: string; icon: string; pageId?: string | null }[];
}

export interface DrawerConfig {
  enabled: boolean;
  bg: string;
  items: string[];
}

export interface Page {
  id: string;
  name: string;
  widgets: Widget[];
  appBar: AppBarConfig;
  bottomNav: BottomNavConfig;
  drawer: DrawerConfig;
}

export interface LibraryDef {
  id: string;
  label: string;
  framework: "flutter" | "reactnative";
  description: string;
}
