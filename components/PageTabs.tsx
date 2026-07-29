"use client";

import React, { useState } from "react";
import { useBuilder } from "@/lib/store";
import { Plus, X, Pencil, Check } from "lucide-react";

export default function PageTabs() {
  const { pages, currentPageId, setCurrentPage, addPage, deletePage, renamePage } = useBuilder();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-800 bg-zinc-900 overflow-x-auto">
      {pages.map((p) => (
        <div
          key={p.id}
          onClick={() => setCurrentPage(p.id)}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer whitespace-nowrap ${
            p.id === currentPageId ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {editingId === p.id ? (
            <>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (renamePage(p.id, draft || p.name), setEditingId(null))}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b border-white/40 outline-none w-20"
              />
              <Check size={11} onClick={(e) => { e.stopPropagation(); renamePage(p.id, draft || p.name); setEditingId(null); }} />
            </>
          ) : (
            <>
              <span>{p.name}</span>
              <Pencil
                size={10}
                className="opacity-0 group-hover:opacity-70"
                onClick={(e) => { e.stopPropagation(); setEditingId(p.id); setDraft(p.name); }}
              />
              {pages.length > 1 && (
                <X size={11} className="opacity-0 group-hover:opacity-70" onClick={(e) => { e.stopPropagation(); deletePage(p.id); }} />
              )}
            </>
          )}
        </div>
      ))}
      <button onClick={addPage} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-md hover:bg-zinc-800">
        <Plus size={12} /> Page
      </button>
    </div>
  );
}
