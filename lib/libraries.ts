import { LibraryDef } from "./types";

export const LIBRARIES: LibraryDef[] = [
  { id: "material3", label: "Material 3", framework: "flutter", description: "Google's latest Material Design widget set" },
  { id: "cupertino", label: "Cupertino", framework: "flutter", description: "iOS-style widgets" },
  { id: "getwidget", label: "GetWidget", framework: "flutter", description: "Pre-built Flutter component library" },
  { id: "syncfusion", label: "Syncfusion", framework: "flutter", description: "Charts, calendars, data grids" },
  { id: "flutter_animate", label: "Flutter Animate", framework: "flutter", description: "Declarative animation helpers" },
  { id: "google_fonts", label: "Google Fonts", framework: "flutter", description: "Custom typography" },
  { id: "nativewind", label: "NativeWind", framework: "reactnative", description: "Tailwind for React Native" },
  { id: "rn_paper", label: "React Native Paper", framework: "reactnative", description: "Material Design components for RN" },
  { id: "rn_navigation", label: "React Navigation", framework: "reactnative", description: "Routing & navigation" },
  { id: "reanimated", label: "Reanimated", framework: "reactnative", description: "Smooth native-thread animations" },
];

export type LibraryState = Record<string, boolean>;

export const defaultLibraryState = (): LibraryState => {
  const state: LibraryState = {};
  LIBRARIES.forEach((l) => (state[l.id] = l.id === "material3" || l.id === "google_fonts"));
  return state;
};
