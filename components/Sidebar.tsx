"use client";

import React, { useState } from "react";
import { WIDGET_DEFS } from "@/lib/widgetDefs";
import { LIBRARIES } from "@/lib/libraries";
import { useBuilder } from "@/lib/store";
import { getIcon } from "./icons";
import { Search, ChevronDown, ChevronRight, Blocks } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  page: "Page widgets",
  layout: "Layout widgets",
  base: "Base widgets",
};

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ page: true, layout: true, base: true });
  const [showLibs, setShowLibs] = useState(false);
  const { libraries, toggleLibrary } = useBuilder();

  const filtered = WIDGET_DEFS.filter((d) => d.label.toLowerCase().includes(query.toLowerCase()));
  const categories: Array<"page" | "layout" | "base"> = ["page", "layout", "base"];

  return (
    <div className="w-60 border-r border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="p-3 border-b border-zinc-800">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search widgets..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-7 pr-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {categories.map((cat) => {
          const items = filtered.filter((d) => d.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-3">
              <button
                onClick={() => setOpenCats((s) => ({ ...s, [cat]: !s[cat] }))}
                className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500 font-medium mb-2 w-full"
              >
                {openCats[cat] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {CATEGORY_LABEL[cat]}
                <span className="text-zinc-600 ml-auto">{items.length}</span>
              </button>
              {openCats[cat] && (
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map((d) => {
                    const Icon = getIcon(d.icon);
                    return (
                      <div
                        key={d.type}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("widget-type", d.type)}
                        title={d.label}
                        className="flex flex-col items-center justify-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg py-2.5 cursor-grab active:cursor-grabbing transition-colors select-none"
                      >
                        <Icon size={15} className="text-violet-300" />
                        <span className="text-[10px] text-zinc-300 text-center leading-tight px-0.5">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-zinc-800">
        <button onClick={() => setShowLibs((s) => !s)} className="w-full flex items-center gap-1.5 px-3 py-2.5 text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
          <Blocks size={12} /> Libraries {showLibs ? <ChevronDown size={12} className="ml-auto" /> : <ChevronRight size={12} className="ml-auto" />}
        </button>
        {showLibs && (
          <div className="px-3 pb-3 max-h-56 overflow-y-auto space-y-1.5">
            {LIBRARIES.map((lib) => (
              <label key={lib.id} className="flex items-start gap-2 text-[11px] text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={!!libraries[lib.id]} onChange={() => toggleLibrary(lib.id)} className="mt-0.5 accent-violet-600" />
                <span>
                  <span className="font-medium">{lib.label}</span>
                  <span className="block text-zinc-500">{lib.description}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
