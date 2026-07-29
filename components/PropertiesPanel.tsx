"use client";

import React from "react";
import { useBuilder, findSelectedWidget } from "@/lib/store";
import { getDef } from "@/lib/widgetDefs";

const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-violet-500";
const colorCls = "w-full h-7 bg-zinc-800 border border-zinc-700 rounded-md";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-2.5">
      <span className="block text-[11px] text-zinc-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

const isColorKey = (k: string) => /color|bg|border|accent/i.test(k);
const isTextArea = (k: string) => /^(text|title|subtitle|placeholder)$/i.test(k);

export default function PropertiesPanel() {
  const { pages, currentPageId, selectedId, patchWidget, patchProps } = useBuilder();
  const page = pages.find((p) => p.id === currentPageId)!;
  const selected = findSelectedWidget(page, selectedId);

  if (!selected) return <PageSettings />;

  const def = getDef(selected.type);
  const isRoot = selected.x !== undefined;
  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div>
      <div className="text-[11px] text-zinc-500 mb-2">{def.label}</div>

      <Field label="Name">
        <input className={inputCls} value={selected.name} onChange={(e) => patchWidget(selected.id, { name: e.target.value })} />
      </Field>

      {isRoot && (
        <div className="grid grid-cols-2 gap-2">
          <Field label="X"><input type="number" className={inputCls} value={Math.round(selected.x!)} onChange={(e) => patchWidget(selected.id, { x: num(e.target.value) })} /></Field>
          <Field label="Y"><input type="number" className={inputCls} value={Math.round(selected.y!)} onChange={(e) => patchWidget(selected.id, { y: num(e.target.value) })} /></Field>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Width"><input type="number" className={inputCls} value={Math.round(selected.width)} onChange={(e) => patchWidget(selected.id, { width: num(e.target.value) })} /></Field>
        <Field label="Height"><input type="number" className={inputCls} value={Math.round(selected.height)} onChange={(e) => patchWidget(selected.id, { height: num(e.target.value) })} /></Field>
      </div>

      {/* generic prop fields driven by whatever this widget type carries */}
      {Object.entries(selected.props).map(([key, val]) => {
        if (Array.isArray(val)) {
          return (
            <Field key={key} label={key}>
              <textarea
                className={inputCls}
                rows={2}
                value={(val as any[]).join("\n")}
                onChange={(e) => patchProps(selected.id, { [key]: e.target.value.split("\n") })}
              />
            </Field>
          );
        }
        if (typeof val === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2 mb-2.5 text-xs text-zinc-300">
              <input type="checkbox" checked={val} onChange={(e) => patchProps(selected.id, { [key]: e.target.checked })} className="accent-violet-600" />
              {key}
            </label>
          );
        }
        if (typeof val === "number") {
          return (
            <Field key={key} label={key}>
              <input type="number" className={inputCls} value={val} onChange={(e) => patchProps(selected.id, { [key]: num(e.target.value) })} />
            </Field>
          );
        }
        // string
        if (isColorKey(key)) {
          return (
            <Field key={key} label={key}>
              <input type="color" className={colorCls} value={val === "transparent" ? "#ffffff" : (val as string)} onChange={(e) => patchProps(selected.id, { [key]: e.target.value })} />
            </Field>
          );
        }
        return (
          <Field key={key} label={key}>
            {isTextArea(key) ? (
              <textarea className={inputCls} rows={2} value={val as string} onChange={(e) => patchProps(selected.id, { [key]: e.target.value })} />
            ) : (
              <input className={inputCls} value={val as string} onChange={(e) => patchProps(selected.id, { [key]: e.target.value })} />
            )}
          </Field>
        );
      })}

      <Field label="On tap → navigate to page (optional)">
        <select
          className={inputCls}
          value={selected.navigateTo || ""}
          onChange={(e) => patchWidget(selected.id, { navigateTo: e.target.value || null })}
        >
          <option value="">None</option>
          {pages.filter((p) => p.id !== currentPageId).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function PageSettings() {
  const { pages, currentPageId, toggleChrome, updateAppBar, updateBottomNav, updateDrawer } = useBuilder();
  const page = pages.find((p) => p.id === currentPageId)!;

  return (
    <div>
      <div className="text-[11px] text-zinc-500 mb-3">No widget selected — page settings for <span className="text-zinc-300 font-medium">{page.name}</span></div>

      <div className="mb-4 border border-zinc-800 rounded-lg p-2.5">
        <label className="flex items-center gap-2 text-xs text-zinc-200 mb-2">
          <input type="checkbox" checked={page.appBar.enabled} onChange={() => toggleChrome("appbar")} className="accent-violet-600" /> App Bar
        </label>
        {page.appBar.enabled && (
          <>
            <Field label="Title"><input className={inputCls} value={page.appBar.title} onChange={(e) => updateAppBar({ title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Background"><input type="color" className={colorCls} value={page.appBar.bg} onChange={(e) => updateAppBar({ bg: e.target.value })} /></Field>
              <Field label="Text color"><input type="color" className={colorCls} value={page.appBar.color} onChange={(e) => updateAppBar({ color: e.target.value })} /></Field>
            </div>
          </>
        )}
      </div>

      <div className="mb-4 border border-zinc-800 rounded-lg p-2.5">
        <label className="flex items-center gap-2 text-xs text-zinc-200 mb-2">
          <input type="checkbox" checked={page.bottomNav.enabled} onChange={() => toggleChrome("bottomnav")} className="accent-violet-600" /> Bottom Nav Bar
        </label>
        {page.bottomNav.enabled && (
          <>
            <div className="space-y-2 mb-2.5">
              {page.bottomNav.items.map((item, i) => (
                <div key={i} className="border border-zinc-800 rounded-md p-2 space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      className={inputCls}
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => {
                        const items = page.bottomNav.items.map((it, idx) => (idx === i ? { ...it, label: e.target.value } : it));
                        updateBottomNav({ items });
                      }}
                    />
                    <input
                      className={inputCls}
                      placeholder="Icon (e.g. Home)"
                      value={item.icon}
                      onChange={(e) => {
                        const items = page.bottomNav.items.map((it, idx) => (idx === i ? { ...it, icon: e.target.value } : it));
                        updateBottomNav({ items });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      className={inputCls}
                      value={item.pageId || ""}
                      onChange={(e) => {
                        const items = page.bottomNav.items.map((it, idx) => (idx === i ? { ...it, pageId: e.target.value || null } : it));
                        updateBottomNav({ items });
                      }}
                    >
                      <option value="">Link to page…</option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateBottomNav({ items: page.bottomNav.items.filter((_, idx) => idx !== i) })}
                      className="text-zinc-500 hover:text-red-400 text-[11px] px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => updateBottomNav({ items: [...page.bottomNav.items, { label: "Item", icon: "Circle", pageId: null }] })}
                className="text-[11px] text-violet-400 hover:text-violet-300"
              >
                + Add nav item
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Background"><input type="color" className={colorCls} value={page.bottomNav.bg} onChange={(e) => updateBottomNav({ bg: e.target.value })} /></Field>
              <Field label="Active color"><input type="color" className={colorCls} value={page.bottomNav.activeColor} onChange={(e) => updateBottomNav({ activeColor: e.target.value })} /></Field>
            </div>
          </>
        )}
      </div>

      <div className="mb-2 border border-zinc-800 rounded-lg p-2.5">
        <label className="flex items-center gap-2 text-xs text-zinc-200 mb-2">
          <input type="checkbox" checked={page.drawer.enabled} onChange={() => toggleChrome("drawer")} className="accent-violet-600" /> Left Drawer
        </label>
        {page.drawer.enabled && (
          <>
            <Field label="Items (one per line)">
              <textarea className={inputCls} rows={3} value={page.drawer.items.join("\n")} onChange={(e) => updateDrawer({ items: e.target.value.split("\n") })} />
            </Field>
            <Field label="Background"><input type="color" className={colorCls} value={page.drawer.bg} onChange={(e) => updateDrawer({ bg: e.target.value })} /></Field>
          </>
        )}
      </div>

      <p className="text-[10px] text-zinc-600 leading-relaxed mt-3">
        Any widget can navigate — select it and set "On tap → navigate to page" in its Properties, not just buttons. Bottom Nav items link to pages individually above. Switch to Preview mode to click through navigation and type into fields for real.
      </p>
    </div>
  );
}
