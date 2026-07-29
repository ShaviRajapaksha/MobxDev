"use client";

import React, { useState } from "react";
import { Widget } from "@/lib/types";
import { useBuilder } from "@/lib/store";
import { getDef } from "@/lib/widgetDefs";
import { getIcon } from "./icons";
import { Eye, EyeOff, Trash2, Lock, Unlock, ChevronRight, ChevronDown, Layers, Square } from "lucide-react";

export default function LayersPanel() {
  const { pages, currentPageId, selectedId, setSelected, patchWidget, removeWidgetById } = useBuilder();
  const page = pages.find((p) => p.id === currentPageId)!;

  return (
    <div className="p-3 border-b border-zinc-800">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-500 font-medium mb-2">
        <Layers size={12} /> Layers
      </div>
      <div className="max-h-52 overflow-y-auto space-y-0.5">
        {page.widgets.length === 0 && <div className="text-xs text-zinc-600 italic">No widgets yet — drag one onto the canvas</div>}
        {page.widgets.map((w) => (
          <LayerRow key={w.id} w={w} depth={0} selectedId={selectedId} setSelected={setSelected} patchWidget={patchWidget} removeWidgetById={removeWidgetById} />
        ))}
      </div>
    </div>
  );
}

function LayerRow({ w, depth, selectedId, setSelected, patchWidget, removeWidgetById }: {
  w: Widget; depth: number; selectedId: string | null;
  setSelected: (id: string | null) => void; patchWidget: (id: string, p: Partial<Widget>) => void; removeWidgetById: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const def = getDef(w.type);
  const Icon = getIcon(def?.icon || "Square");
  const hasChildren = Array.isArray(w.children) && w.children.length > 0;

  return (
    <div>
      <div
        onClick={() => setSelected(w.id)}
        style={{ paddingLeft: 8 + depth * 14 }}
        className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer text-xs group ${selectedId === w.id ? "bg-violet-600/20 text-violet-200" : "hover:bg-zinc-800 text-zinc-300"}`}
      >
        {hasChildren ? (
          <span onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} className="text-zinc-500">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : <span style={{ width: 12 }} />}
        <Icon size={12} className="text-zinc-400 shrink-0" />
        <span className="truncate flex-1">{w.name}</span>
        <button onClick={(e) => { e.stopPropagation(); patchWidget(w.id, { locked: !w.locked }); }} className="text-zinc-500 hover:text-zinc-200">
          {w.locked ? <Lock size={11} /> : <Unlock size={11} className="opacity-0 group-hover:opacity-100" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); patchWidget(w.id, { hidden: !w.hidden }); }} className="text-zinc-500 hover:text-zinc-200">
          {w.hidden ? <EyeOff size={11} /> : <Eye size={11} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); removeWidgetById(w.id); }} className="text-zinc-500 hover:text-red-400">
          <Trash2 size={11} />
        </button>
      </div>
      {hasChildren && open && w.children!.map((c) => (
        <LayerRow key={c.id} w={c} depth={depth + 1} selectedId={selectedId} setSelected={setSelected} patchWidget={patchWidget} removeWidgetById={removeWidgetById} />
      ))}
    </div>
  );
}
