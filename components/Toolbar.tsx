"use client";

import React, { useState } from "react";
import { useBuilder } from "@/lib/store";
import { Smartphone, Code2, Eye, Pencil } from "lucide-react";
import ExportModal from "./ExportModal";

export default function Toolbar() {
  const { mode, setMode } = useBuilder();
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2">
        <Smartphone size={18} className="text-violet-400" />
        <span className="text-sm font-semibold tracking-tight">MobxDev</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-zinc-800 rounded-md p-0.5">
          <button
            onClick={() => setMode("edit")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded ${mode === "edit" ? "bg-violet-600 text-white" : "text-zinc-400"}`}
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded ${mode === "preview" ? "bg-violet-600 text-white" : "text-zinc-400"}`}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-500 transition-colors px-3 py-1.5 rounded-md"
        >
          <Code2 size={14} /> Export code
        </button>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
