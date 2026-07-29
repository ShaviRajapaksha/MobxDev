"use client";

import React from "react";
import Toolbar from "@/components/Toolbar";
import PageTabs from "@/components/PageTabs";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
import LayersPanel from "@/components/LayersPanel";
import PropertiesPanel from "@/components/PropertiesPanel";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <Toolbar />
      <PageTabs />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <Canvas />
        <div className="w-72 border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
          <LayersPanel />
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium mb-2">Properties</div>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
