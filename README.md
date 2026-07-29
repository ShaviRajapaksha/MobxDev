# SnappBuild

A visual, drag-and-drop mobile app builder for developers. Design real
screens on a phone-sized canvas, wire navigation between pages, and export
working Flutter (Dart) or React Native code — no UI code written by hand.

## Overview

Appwright is a Next.js application that reproduces the core workflow of
tools like FlutterFlow and Figma for mobile app design, with one focus:
getting a developer from a visual layout to compilable, production-shaped
code as directly as possible.

## Features

- **Canvas** — zoom in/out, drag widgets from the sidebar, move by dragging,
  resize from any corner handle, phone-frame preview.
- **Widget library**, grouped and searchable:
  - **Page widgets** — App Bar, Bottom Nav Bar, Left Drawer.
  - **Layout widgets** — Container, Row, Column, Stack, Card, List View,
    Grid View, Page View, Sized Box, Opacity.
  - **Base widgets** — Text, Text Field, Search Bar, Text Button, Image,
    Checkbox, Radio Button, Icon, Icon Button, List Tile, Video Player,
    Audio Player, Switch, Checkbox List, Divider, Calendar, Dropdown,
    Circle Avatar, Slider, Lottie Animation, Credit Card View, OTP Text
    Field, Tab Bar, Linear Progress, Circular Progress, Rating Bar, Badge,
    Chip, Snackbar.
  - Nesting — drop any widget onto a Container / Row / Column / Card /
    List View / Grid View / Stack to place it inside.
- **Layers panel** — full hierarchy, lock/hide/delete, click to select.
- **Properties panel** — editor for each widget's own properties (colors,
  numbers, text, lists), plus size and position for root-level widgets.
- **Multi-page projects** — create, rename, and delete pages. Any widget,
  not only buttons, can be wired with "On tap → navigate to page."
- **Bottom Nav Bar page linking** — each nav item links to its own page
  individually, with its own label and icon.
- **Preview mode** — a functional simulation, not just click-navigation:
  text fields and search bars are typeable, checkboxes/switches/radios/
  checkbox lists toggle, sliders and rating bars respond to drag or click,
  OTP fields auto-advance per digit, dropdowns open and select, calendar
  days are selectable, tab bars switch — and tapping any wired widget or
  bottom-nav item navigates to its linked page.
- **Library toggles** — flag the popular Flutter/React Native libraries
  (Material 3, Cupertino, GetWidget, NativeWind, React Navigation, etc.)
  your export should assume.
- **Code export**:
  - Flutter (Dart) and React Native tabs for the current page, with a
    working copy-to-clipboard button.
  - Full project export (.zip) for Flutter — every page as its own file
    under `lib/pages/`, with `main.dart` wiring named routes so
    `Navigator.pushNamed` calls between pages work, plus a generated
    `pubspec.yaml`.

## Architecture

```
app/                 Next.js App Router entry (single page shell)
components/          Toolbar, Sidebar, Canvas, LayersPanel, PropertiesPanel,
                      ExportModal, PageTabs, WidgetRenderer, icons
lib/
  types.ts           Widget / Page / Library type definitions
  widgetDefs.ts       Widget palette catalogue + factory
  tree.ts            Immutable tree helpers (find/update/remove/addChild)
  store.ts           Zustand global state (pages, selection, zoom, libraries)
  libraries.ts       Library toggle catalogue
  codegen/
    flutter.ts       Dart generator (per page + full project)
    reactNative.ts   React Native generator (per page)
    zipExport.ts     JSZip + file-saver full-project bundling
```

Widgets are defined in one place (`lib/widgetDefs.ts`) and rendered in one
place (`components/WidgetRenderer.tsx`). Adding a widget means: add its
type to `WidgetType` in `lib/types.ts`, its default in `widgetDefs.ts`, a
render case in `WidgetRenderer.tsx`, and a codegen case in
`lib/codegen/flutter.ts`.

## Roadmap

- SwiftUI export
- Undo/redo and multi-select
- Real asset uploads (images currently use placeholder photos)
- Full React Native project zip (multi-file, React Navigation wired)
- Visual logic/API builder

