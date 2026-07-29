import {
  Star, Heart, Home, Search, User, Settings, LogOut, Bell, Check,
  ChevronRight, Camera, Mail, MapPin, ShoppingCart, Plus, PanelTop,
  PanelBottom, PanelLeft, Square, Rows, Columns, Layers2, CreditCard,
  List, LayoutGrid, GalleryHorizontal, Minus, CircleDashed, Type,
  TextCursorInput, MousePointer, Image, SquareCheck, Circle, CircleDot,
  Rows3, Video, AudioLines, ToggleRight, ListChecks, Calendar,
  ChevronDown, CircleUserRound, SlidersHorizontal, Sparkles, KeyRound,
  SquareStack, LoaderCircle, Tag, MessageSquare, X,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Star, Heart, Home, Search, User, Settings, LogOut, Bell, Check,
  ChevronRight, Camera, Mail, MapPin, ShoppingCart, Plus, PanelTop,
  PanelBottom, PanelLeft, Square, Rows, Columns, Layers2, CreditCard,
  List, LayoutGrid, GalleryHorizontal, Minus, CircleDashed, Type,
  TextCursorInput, MousePointer, Image, SquareCheck, Circle, CircleDot,
  Rows3, Video, AudioLines, ToggleRight, ListChecks, Calendar,
  ChevronDown, CircleUserRound, SlidersHorizontal, Sparkles, KeyRound,
  SquareStack, LoaderCircle, Tag, MessageSquare, X,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name: string): LucideIcon {
  return ICONS[name] || Star;
}
