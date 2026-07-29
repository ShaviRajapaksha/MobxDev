"use client";

import React, { useRef, useCallback } from "react";
import { useBuilder } from "@/lib/store";
import { makeWidget, getDef } from "@/lib/widgetDefs";
import { WidgetType } from "@/lib/types";
import { WidgetRenderer } from "./WidgetRenderer";
import { getIcon } from "./icons";
import { ZoomIn, ZoomOut, Maximize2, Menu } from "lucide-react";

const PHONE_W = 360;
const PHONE_H = 720;
const APPBAR_H = 56;
const BOTTOMNAV_H = 64;

export default function Canvas() {
  const {
    pages, currentPageId, zoom, setZoom, selectedId, setSelected,
    addRootWidget, addChildWidget, patchWidget, mode, drawerOpen, setDrawerOpen,
    setCurrentPage,
  } = useBuilder();
  const page = pages.find((p) => p.id === currentPageId)!;
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<any>(null);

  const contentTop = page.appBar.enabled ? APPBAR_H : 0;
  const contentBottom = page.bottomNav.enabled ? BOTTOMNAV_H : 0;

  // ---------- selection delegation ----------
  const onCanvasClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("[data-widget-id]");
    if (!target) {
      setSelected(null);
      return;
    }
    const id = target.getAttribute("data-widget-id")!;
    if (mode === "preview") {
      const w = findInPage(page.widgets, id);
      if (w?.navigateTo) setCurrentPage(w.navigateTo);
      return;
    }
    setSelected(id);
  };

  // ---------- drop from sidebar ----------
  const onCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("widget-type") as WidgetType;
    if (!type) return;
    const def = getDef(type);
    if (def.isChrome) {
      useBuilder.getState().toggleChrome(type as any);
      return;
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    const w = makeWidget(type);
    const x = Math.max(0, Math.min(PHONE_W - w.width, (e.clientX - rect.left) / zoom - w.width / 2));
    const y = Math.max(contentTop, Math.min(PHONE_H - contentBottom - w.height, (e.clientY - rect.top) / zoom - w.height / 2));
    addRootWidget({ ...w, x, y });
  };

  const onContainerDrop = (e: React.DragEvent, parentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData("widget-type") as WidgetType;
    if (!type) return;
    const def = getDef(type);
    if (def.isChrome) return;
    const w = makeWidget(type);
    delete (w as any).x;
    delete (w as any).y;
    addChildWidget(parentId, w);
  };

  // ---------- move / resize ----------
  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / zoom;
    const dy = (e.clientY - d.startY) / zoom;
    if (d.mode === "move") {
      const nx = Math.max(0, Math.min(PHONE_W - 20, d.origX + dx));
      const ny = Math.max(contentTop, Math.min(PHONE_H - contentBottom - 20, d.origY + dy));
      patchWidget(d.id, { x: nx, y: ny });
    } else if (d.mode === "resize") {
      let { origX, origY, origW, origH, corner } = d;
      let nx = origX, ny = origY, nw = origW, nh = origH;
      const min = 20;
      if (corner.includes("e")) nw = Math.max(min, origW + dx);
      if (corner.includes("s")) nh = Math.max(min, origH + dy);
      if (corner.includes("w")) { nw = Math.max(min, origW - dx); nx = origX + (origW - nw); }
      if (corner.includes("n")) { nh = Math.max(min, origH - dy); ny = origY + (origH - nh); }
      patchWidget(d.id, { x: nx, y: ny, width: nw, height: nh });
    }
  }, [zoom, contentTop, contentBottom, patchWidget]);

  const onPointerUp = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  const startMove = (e: React.PointerEvent, w: any) => {
    if (w.locked || mode === "preview") return;
    e.stopPropagation();
    setSelected(w.id);
    dragState.current = { mode: "move", id: w.id, startX: e.clientX, startY: e.clientY, origX: w.x, origY: w.y };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const startResize = (e: React.PointerEvent, w: any, corner: string) => {
    if (w.locked || mode === "preview") return;
    e.stopPropagation();
    e.preventDefault();
    setSelected(w.id);
    dragState.current = { mode: "resize", id: w.id, corner, startX: e.clientX, startY: e.clientY, origX: w.x, origY: w.y, origW: w.width, origH: w.height };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(zoom - e.deltaY * 0.001);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      {/* zoom controls */}
      <div className="flex items-center justify-center gap-2 py-2 border-b border-zinc-800 bg-zinc-950">
        <button onClick={() => setZoom(zoom - 0.1)} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400"><ZoomOut size={14} /></button>
        <span className="text-xs text-zinc-400 w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400"><ZoomIn size={14} /></button>
        <button onClick={() => setZoom(1)} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400" title="Reset zoom"><Maximize2 size={13} /></button>
        <span className="text-[10px] text-zinc-600 ml-2">ctrl/cmd + scroll to zoom</span>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-8" onWheel={onWheel}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.08s ease-out" }}>
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onCanvasDrop}
            onClick={onCanvasClick}
            style={{
              width: PHONE_W, height: PHONE_H, position: "relative",
              background: "#ffffff", borderRadius: 32, border: "8px solid #27272a",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)", overflow: "hidden",
            }}
          >
            {/* App Bar */}
            {page.appBar.enabled && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: APPBAR_H, background: page.appBar.bg, color: page.appBar.color, display: "flex", alignItems: "center", padding: "0 14px", fontWeight: 700, fontSize: 16, zIndex: 5 }}>
                {page.drawer.enabled && <Menu size={18} className="mr-3" onClick={(e) => { e.stopPropagation(); setDrawerOpen(!drawerOpen); }} style={{ cursor: "pointer" }} />}
                {page.appBar.title}
              </div>
            )}

            {/* Root widgets */}
            {page.widgets.map((w) => (
              <RootNode key={w.id} w={w} selectedId={selectedId} startMove={startMove} startResize={startResize} onContainerDrop={onContainerDrop} mode={mode} />
            ))}

            {/* Bottom Nav */}
            {page.bottomNav.enabled && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: BOTTOMNAV_H, background: page.bottomNav.bg, display: "flex", alignItems: "center", justifyContent: "space-around", borderTop: "1px solid #e4e4e7", zIndex: 5 }}>
                {page.bottomNav.items.map((it, i) => {
                  const Icon = getIcon(it.icon);
                  const isActive = it.pageId ? it.pageId === currentPageId : i === 0;
                  return (
                    <div
                      key={i}
                      onClick={(e) => { e.stopPropagation(); if (mode === "preview" && it.pageId) setCurrentPage(it.pageId); }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: isActive ? page.bottomNav.activeColor : "#a1a1aa", cursor: mode === "preview" && it.pageId ? "pointer" : "inherit" }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: 9 }}>{it.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Drawer overlay */}
            {page.drawer.enabled && drawerOpen && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 10 }} onClick={(e) => { e.stopPropagation(); setDrawerOpen(false); }}>
                <div style={{ width: "72%", height: "100%", background: page.drawer.bg, padding: 20, display: "flex", flexDirection: "column", gap: 16 }} onClick={(e) => e.stopPropagation()}>
                  {page.drawer.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 14, fontWeight: 600, color: "#27272a" }}>{item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function findInPage(list: any[], id: string): any {
  for (const w of list) {
    if (w.id === id) return w;
    if (w.children) {
      const f = findInPage(w.children, id);
      if (f) return f;
    }
  }
  return null;
}

function RootNode({ w, selectedId, startMove, startResize, onContainerDrop, mode }: any) {
  if (w.hidden) return null;
  const isSelected = selectedId === w.id;
  const canDrop = ["container", "row", "column", "card", "listview", "gridview", "stack", "opacity"].includes(w.type);
  return (
    <div
      data-widget-id={w.id}
      onPointerDown={(e: any) => startMove(e, w)}
      onDragOver={canDrop ? (e: any) => e.preventDefault() : undefined}
      onDrop={canDrop ? (e: any) => onContainerDrop(e, w.id) : undefined}
      style={{
        position: "absolute",
        left: w.x, top: w.y, width: w.width, height: w.height,
        outline: isSelected ? "2px solid #6d5efc" : "1px solid transparent",
        outlineOffset: 2,
        cursor: mode === "preview" ? (w.navigateTo ? "pointer" : "default") : w.locked ? "default" : "move",
        zIndex: isSelected ? 3 : 1,
      }}
    >
      <WidgetRenderer w={w} isSelected={isSelected} mode={mode} />
      {isSelected && mode === "edit" && !w.locked && (
        <>
          {["nw", "ne", "sw", "se"].map((c) => (
            <div
              key={c}
              onPointerDown={(e: any) => startResize(e, w, c)}
              style={{
                position: "absolute", width: 10, height: 10, background: "#6d5efc", border: "2px solid white", borderRadius: 2,
                top: c.includes("n") ? -6 : undefined, bottom: c.includes("s") ? -6 : undefined,
                left: c.includes("w") ? -6 : undefined, right: c.includes("e") ? -6 : undefined,
                cursor: c === "nw" || c === "se" ? "nwse-resize" : "nesw-resize", zIndex: 6,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
