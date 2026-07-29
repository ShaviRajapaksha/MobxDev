"use client";

import { create } from "zustand";
import { Page, Widget } from "./types";
import { updateWidget, updateWidgetProps, removeWidget, addChild, findWidget } from "./tree";
import { defaultLibraryState, LibraryState } from "./libraries";
import { makeWidget, nextId } from "./widgetDefs";

function makePage(name: string): Page {
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    name,
    widgets: [],
    appBar: { enabled: false, title: name, bg: "#6d5efc", color: "#ffffff" },
    bottomNav: {
      enabled: false,
      bg: "#ffffff",
      activeColor: "#6d5efc",
      items: [
        { label: "Home", icon: "Home" },
        { label: "Search", icon: "Search" },
        { label: "Profile", icon: "User" },
      ],
    },
    drawer: { enabled: false, bg: "#ffffff", items: ["Home", "Settings", "Logout"] },
  };
}

interface BuilderState {
  pages: Page[];
  currentPageId: string;
  selectedId: string | null;
  zoom: number;
  mode: "edit" | "preview";
  libraries: LibraryState;
  drawerOpen: boolean;

  currentPage: () => Page;

  setZoom: (z: number) => void;
  setMode: (m: "edit" | "preview") => void;
  toggleLibrary: (id: string) => void;
  setDrawerOpen: (v: boolean) => void;

  addPage: () => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setCurrentPage: (id: string) => void;

  setSelected: (id: string | null) => void;
  addRootWidget: (w: Widget) => void;
  addChildWidget: (parentId: string, w: Widget) => void;
  patchWidget: (id: string, patch: Partial<Widget>) => void;
  patchProps: (id: string, props: Record<string, any>) => void;
  removeWidgetById: (id: string) => void;
  toggleChrome: (kind: "appbar" | "bottomnav" | "drawer") => void;
  updateAppBar: (patch: Partial<Page["appBar"]>) => void;
  updateBottomNav: (patch: Partial<Page["bottomNav"]>) => void;
  updateDrawer: (patch: Partial<Page["drawer"]>) => void;
}

export const useBuilder = create<BuilderState>((set, get) => {
  const firstPage = makePage("Home");
  return {
    pages: [firstPage],
    currentPageId: firstPage.id,
    selectedId: null,
    zoom: 1,
    mode: "edit",
    libraries: defaultLibraryState(),
    drawerOpen: false,

    currentPage: () => get().pages.find((p) => p.id === get().currentPageId)!,

    setZoom: (z) => set({ zoom: Math.max(0.4, Math.min(2, z)) }),
    setMode: (m) => set({ mode: m, drawerOpen: false }),
    toggleLibrary: (id) => set((s) => ({ libraries: { ...s.libraries, [id]: !s.libraries[id] } })),
    setDrawerOpen: (v) => set({ drawerOpen: v }),

    addPage: () =>
      set((s) => {
        const p = makePage(`Page ${s.pages.length + 1}`);
        return { pages: [...s.pages, p], currentPageId: p.id, selectedId: null };
      }),
    deletePage: (id) =>
      set((s) => {
        if (s.pages.length === 1) return s;
        const pages = s.pages.filter((p) => p.id !== id);
        const currentPageId = s.currentPageId === id ? pages[0].id : s.currentPageId;
        return { pages, currentPageId, selectedId: null };
      }),
    renamePage: (id, name) =>
      set((s) => ({ pages: s.pages.map((p) => (p.id === id ? { ...p, name } : p)) })),
    setCurrentPage: (id) => set({ currentPageId: id, selectedId: null }),

    setSelected: (id) => set({ selectedId: id }),

    addRootWidget: (w) =>
      set((s) => ({
        pages: s.pages.map((p) => (p.id === s.currentPageId ? { ...p, widgets: [...p.widgets, w] } : p)),
        selectedId: w.id,
      })),
    addChildWidget: (parentId, w) =>
      set((s) => ({
        pages: s.pages.map((p) =>
          p.id === s.currentPageId ? { ...p, widgets: addChild(p.widgets, parentId, w) } : p
        ),
        selectedId: w.id,
      })),
    patchWidget: (id, patch) =>
      set((s) => ({
        pages: s.pages.map((p) =>
          p.id === s.currentPageId ? { ...p, widgets: updateWidget(p.widgets, id, patch) } : p
        ),
      })),
    patchProps: (id, props) =>
      set((s) => ({
        pages: s.pages.map((p) =>
          p.id === s.currentPageId ? { ...p, widgets: updateWidgetProps(p.widgets, id, props) } : p
        ),
      })),
    removeWidgetById: (id) =>
      set((s) => ({
        pages: s.pages.map((p) =>
          p.id === s.currentPageId ? { ...p, widgets: removeWidget(p.widgets, id) } : p
        ),
        selectedId: s.selectedId === id ? null : s.selectedId,
      })),
    toggleChrome: (kind) =>
      set((s) => ({
        pages: s.pages.map((p) => {
          if (p.id !== s.currentPageId) return p;
          if (kind === "appbar") return { ...p, appBar: { ...p.appBar, enabled: !p.appBar.enabled } };
          if (kind === "bottomnav") return { ...p, bottomNav: { ...p.bottomNav, enabled: !p.bottomNav.enabled } };
          return { ...p, drawer: { ...p.drawer, enabled: !p.drawer.enabled } };
        }),
      })),
    updateAppBar: (patch) =>
      set((s) => ({
        pages: s.pages.map((p) => (p.id === s.currentPageId ? { ...p, appBar: { ...p.appBar, ...patch } } : p)),
      })),
    updateBottomNav: (patch) =>
      set((s) => ({
        pages: s.pages.map((p) => (p.id === s.currentPageId ? { ...p, bottomNav: { ...p.bottomNav, ...patch } } : p)),
      })),
    updateDrawer: (patch) =>
      set((s) => ({
        pages: s.pages.map((p) => (p.id === s.currentPageId ? { ...p, drawer: { ...p.drawer, ...patch } } : p)),
      })),
  };
});

export function findSelectedWidget(page: Page, selectedId: string | null): Widget | null {
  if (!selectedId) return null;
  return findWidget(page.widgets, selectedId);
}
