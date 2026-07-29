import { Widget } from "./types";

export function findWidget(list: Widget[], id: string): Widget | null {
  for (const w of list) {
    if (w.id === id) return w;
    if (w.children) {
      const found = findWidget(w.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateWidget(list: Widget[], id: string, patch: Partial<Widget>): Widget[] {
  return list.map((w) => {
    if (w.id === id) return { ...w, ...patch };
    if (w.children) return { ...w, children: updateWidget(w.children, id, patch) };
    return w;
  });
}

export function updateWidgetProps(list: Widget[], id: string, propsPatch: Record<string, any>): Widget[] {
  return list.map((w) => {
    if (w.id === id) return { ...w, props: { ...w.props, ...propsPatch } };
    if (w.children) return { ...w, children: updateWidgetProps(w.children, id, propsPatch) };
    return w;
  });
}

export function removeWidget(list: Widget[], id: string): Widget[] {
  return list
    .filter((w) => w.id !== id)
    .map((w) => (w.children ? { ...w, children: removeWidget(w.children, id) } : w));
}

export function addChild(list: Widget[], parentId: string, child: Widget): Widget[] {
  return list.map((w) => {
    if (w.id === parentId && w.children) {
      return { ...w, children: [...w.children, child] };
    }
    if (w.children) {
      return { ...w, children: addChild(w.children, parentId, child) };
    }
    return w;
  });
}
