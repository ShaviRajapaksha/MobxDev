"use client";

import React, { useRef, useState } from "react";
import { useBuilder } from "@/lib/store";
import { generateFlutterPage } from "@/lib/codegen/flutter";
import { generateReactNativePage } from "@/lib/codegen/reactNative";
import { exportFlutterProjectZip } from "@/lib/codegen/zipExport";
import { Code2, Copy, X, Download, Check } from "lucide-react";

export default function ExportModal({ onClose }: { onClose: () => void }) {
  const { pages, currentPageId } = useBuilder();
  const page = pages.find((p) => p.id === currentPageId)!;
  const [tab, setTab] = useState<"flutter" | "reactnative">("flutter");
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const code = tab === "flutter" ? generateFlutterPage(page, pages) : generateReactNativePage(page);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      textRef.current?.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      await exportFlutterProjectZip(pages);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-[720px] max-h-[82vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium flex items-center gap-2"><Code2 size={14} /> Export — {page.name}</span>
            <div className="flex bg-zinc-800 rounded-md p-0.5">
              <button onClick={() => setTab("flutter")} className={`text-[11px] px-2.5 py-1 rounded ${tab === "flutter" ? "bg-violet-600 text-white" : "text-zinc-400"}`}>Flutter (Dart)</button>
              <button onClick={() => setTab("reactnative")} className={`text-[11px] px-2.5 py-1 rounded ${tab === "reactnative" ? "bg-violet-600 text-white" : "text-zinc-400"}`}>React Native</button>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={16} /></button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/50">
          <span className="text-[11px] text-zinc-500">
            {tab === "flutter" ? "This page only. Full project bundles every page with working named-route navigation." : "This page only — single React Native screen component."}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
            {tab === "flutter" && (
              <button onClick={downloadZip} disabled={zipping} className="flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-500 px-2.5 py-1 rounded-md disabled:opacity-60">
                <Download size={12} /> {zipping ? "Zipping…" : "Full project (.zip)"}
              </button>
            )}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <pre className="p-4 text-[11px] leading-relaxed overflow-auto text-zinc-300 font-mono h-full max-h-[52vh]">{code}</pre>
          <textarea ref={textRef} value={code} readOnly className="sr-only" />
        </div>
      </div>
    </div>
  );
}
