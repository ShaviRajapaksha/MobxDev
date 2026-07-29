"use client";

import React, { useState, useRef } from "react";
import { Widget } from "@/lib/types";
import { getIcon } from "./icons";

type Mode = "edit" | "preview";

export function WidgetRenderer({ w, isSelected, mode = "edit" }: { w: Widget; isSelected?: boolean; mode?: Mode }) {
  const p = w.props || {};

  switch (w.type) {
    case "text":
      return (
        <div style={{ fontSize: p.fontSize, fontWeight: p.fontWeight, color: p.color, textAlign: p.align, width: "100%", height: "100%", overflow: "hidden" }}>
          {p.text}
        </div>
      );

    case "textfield":
      return <InteractiveTextField p={p} mode={mode} />;

    case "searchbar": {
      const SearchIcon = getIcon("Search");
      return (
        <div style={{ background: p.bg, borderRadius: p.radius, width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
          <SearchIcon size={15} color="#71717a" />
          <input
            placeholder={p.placeholder}
            readOnly={mode !== "preview"}
            onPointerDown={(e) => mode === "preview" && e.stopPropagation()}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#27272a", flex: 1, cursor: mode === "preview" ? "text" : "inherit" }}
          />
        </div>
      );
    }

    case "textbutton":
      return (
        <button style={{ background: p.bg, color: p.color, borderRadius: p.radius, width: "100%", height: "100%", border: "none", fontSize: 14, fontWeight: 600, cursor: mode === "preview" ? "pointer" : "inherit" }}>
          {p.text}
        </button>
      );

    case "image":
      return (
        <img src={`https://picsum.photos/seed/${p.seed}/${Math.round(w.width)}/${Math.round(w.height)}`} alt="" draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: p.radius, display: "block" }} />
      );

    case "circleimage":
      return (
        <img src={`https://picsum.photos/seed/${p.seed}/100/100`} alt="" draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
      );

    case "checkbox":
      return <InteractiveCheckbox p={p} mode={mode} />;

    case "radio":
      return <InteractiveRadio p={p} mode={mode} />;

    case "icon": {
      const Icon = getIcon(p.icon);
      return <Icon size={p.size} color={p.color} style={{ width: "100%", height: "100%" }} />;
    }

    case "iconbutton": {
      const Icon = getIcon(p.icon);
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: mode === "preview" ? "pointer" : "inherit" }}>
          <Icon size={Math.min(w.width, w.height) * 0.5} color={p.color} />
        </div>
      );
    }

    case "listtile": {
      const Icon = getIcon(p.icon);
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", borderRadius: 8, cursor: mode === "preview" ? "pointer" : "inherit" }}>
          <Icon size={20} color="#6d5efc" />
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{p.title}</div>
            <div style={{ fontSize: 11, color: "#71717a" }}>{p.subtitle}</div>
          </div>
        </div>
      );
    }

    case "videoplayer":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "12px solid white", marginLeft: 3 }} />
          </div>
        </div>
      );

    case "audioplayer":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: 10, display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: p.accent }} />
          <div style={{ flex: 1, height: 4, background: "#d4d4d8", borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "35%", background: p.accent, borderRadius: 2 }} />
          </div>
        </div>
      );

    case "switch":
      return <InteractiveSwitch p={p} mode={mode} />;

    case "checkboxlist":
      return <InteractiveCheckboxList p={p} mode={mode} />;

    case "divider":
      return <div style={{ width: "100%", height: p.thickness, background: p.color }} />;

    case "calendar":
      return <InteractiveCalendar p={p} mode={mode} />;

    case "dropdown":
      return <InteractiveDropdown p={p} mode={mode} />;

    case "slider":
      return <InteractiveSlider p={p} mode={mode} />;

    case "lottie": {
      const Icon = getIcon("Sparkles");
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={28} className="text-violet-400" />
        </div>
      );
    }

    case "creditcardview":
      return (
        <div style={{ width: "100%", height: "100%", borderRadius: 16, padding: 16, background: `linear-gradient(135deg, ${p.bg1}, ${p.bg2})`, color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{p.number}</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{p.holder}</div>
        </div>
      );

    case "otptextfield":
      return <InteractiveOtp p={p} mode={mode} />;

    case "tabbar":
      return <InteractiveTabBar p={p} mode={mode} />;

    case "progressbar":
      return (
        <div style={{ width: "100%", height: "100%", background: p.track, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${p.value}%`, height: "100%", background: p.color }} />
        </div>
      );

    case "circularprogress": {
      const size = Math.min(w.width, w.height);
      const r = size / 2 - 4;
      const c = 2 * Math.PI * r;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#e4e4e7" strokeWidth={4} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={r} stroke={p.color} strokeWidth={4} fill="none"
            strokeDasharray={c} strokeDashoffset={c - (c * p.value) / 100} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        </svg>
      );
    }

    case "ratingbar":
      return <InteractiveRating p={p} mode={mode} />;

    case "badge":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, color: p.color, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
          {p.text}
        </div>
      );

    case "chip": {
      const XIcon = getIcon("X");
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, color: p.color, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 12, fontWeight: 600 }}>
          {p.text} <XIcon size={12} />
        </div>
      );
    }

    case "snackbar":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, color: p.color, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 12 }}>
          {p.text}
        </div>
      );

    case "sizedbox":
      return <div style={{ width: "100%", height: "100%", border: "1px dashed #d4d4d8", borderRadius: 4 }} />;

    case "opacity":
      return (
        <div style={{ width: "100%", height: "100%", opacity: p.opacity, background: p.bg, borderRadius: 10, display: "flex", flexDirection: "column", gap: 6, padding: 8, overflow: "hidden" }}>
          {(w.children || []).map((c) => <NestedNode key={c.id} w={c} mode={mode} />)}
        </div>
      );

    case "stack":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: 10, position: "relative", overflow: "hidden" }}>
          {(w.children || []).map((c, i) => (
            <div key={c.id} style={{ position: "absolute", left: i * 12, top: i * 12, width: "60%", height: "60%" }}>
              <NestedNode w={c} fill mode={mode} />
            </div>
          ))}
          {(w.children || []).length === 0 && <EmptyHint />}
        </div>
      );

    case "card":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, borderRadius: p.radius, padding: p.padding, boxShadow: `0 ${p.elevation}px ${p.elevation * 3}px rgba(0,0,0,0.12)`, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          {(w.children || []).map((c) => <NestedNode key={c.id} w={c} mode={mode} />)}
          {(w.children || []).length === 0 && <EmptyHint />}
        </div>
      );

    case "listview":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, padding: p.padding, display: "flex", flexDirection: "column", gap: p.gap, overflowY: "auto", borderRadius: 8 }}>
          {(w.children || []).length > 0
            ? w.children!.map((c) => <NestedNode key={c.id} w={c} mode={mode} />)
            : Array.from({ length: p.itemCount }).map((_, i) => (
                <div key={i} style={{ height: 40, background: "#f4f4f5", borderRadius: 8 }} />
              ))}
        </div>
      );

    case "gridview":
      return (
        <div style={{ width: "100%", height: "100%", background: p.bg, padding: p.padding, display: "grid", gridTemplateColumns: `repeat(${p.columns}, 1fr)`, gap: p.gap, overflowY: "auto", borderRadius: 8 }}>
          {(w.children || []).length > 0
            ? w.children!.map((c) => <NestedNode key={c.id} w={c} mode={mode} />)
            : Array.from({ length: p.itemCount }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1", background: "#f4f4f5", borderRadius: 8 }} />
              ))}
        </div>
      );

    case "pageview":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", gap: 6, overflow: "hidden", borderRadius: 10 }}>
          {Array.from({ length: p.pages }).map((_, i) => (
            <div key={i} style={{ minWidth: "85%", height: "100%", background: p.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#4338ca" }}>
              Page {i + 1}
            </div>
          ))}
        </div>
      );

    case "container":
      return (
        <div style={{ background: p.bg, borderRadius: p.radius, padding: p.padding, width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          {(w.children || []).map((c) => <NestedNode key={c.id} w={c} mode={mode} />)}
          {(w.children || []).length === 0 && <EmptyHint />}
        </div>
      );

    case "row":
    case "column":
      return (
        <div style={{ background: p.bg, padding: p.padding, width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: w.type === "row" ? "row" : "column", gap: p.gap, overflow: "hidden", alignItems: w.type === "row" ? "center" : "stretch" }}>
          {(w.children || []).map((c) => <NestedNode key={c.id} w={c} mode={mode} />)}
          {(w.children || []).length === 0 && <EmptyHint />}
        </div>
      );

    default:
      return <div style={{ width: "100%", height: "100%", background: "#e4e4e7", borderRadius: 6 }} />;
  }
}

function EmptyHint() {
  return (
    <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-400 border border-dashed border-zinc-300 rounded min-h-[28px] w-full">
      drop here
    </div>
  );
}

export function NestedNode({ w, fill, mode = "edit" }: { w: Widget; fill?: boolean; mode?: Mode }) {
  if (w.hidden) return null;
  return (
    <div data-widget-id={w.id} style={{ flexShrink: 0, width: fill ? "100%" : w.width, height: fill ? "100%" : w.height, minWidth: 0 }}>
      <WidgetRenderer w={w} mode={mode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive sub-widgets — static while editing (so drag/select keeps
// working), fully functional in Preview mode.
// ---------------------------------------------------------------------------

function InteractiveTextField({ p, mode }: { p: any; mode: Mode }) {
  const [val, setVal] = useState("");
  if (mode !== "preview") {
    return (
      <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: p.radius, width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, color: "#a1a1aa" }}>
        {p.placeholder}
      </div>
    );
  }
  return (
    <input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
      placeholder={p.placeholder}
      type={/password/i.test(p.placeholder) ? "password" : "text"}
      style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: p.radius, width: "100%", height: "100%", padding: "0 10px", fontSize: 13, color: "#18181b", outline: "none" }}
    />
  );
}

function InteractiveCheckbox({ p, mode }: { p: any; mode: Mode }) {
  const [checked, setChecked] = useState(!!p.checked);
  const CheckIcon = getIcon("Check");
  return (
    <div
      onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setChecked((c) => !c); } }}
      style={{ width: "100%", height: "100%", border: `2px solid ${p.color}`, borderRadius: 5, background: checked ? p.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: mode === "preview" ? "pointer" : "inherit" }}
    >
      {checked && <CheckIcon size={14} color="white" />}
    </div>
  );
}

function InteractiveRadio({ p, mode }: { p: any; mode: Mode }) {
  const [selected, setSelected] = useState(!!p.selected);
  return (
    <div
      onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setSelected((s) => !s); } }}
      style={{ width: "100%", height: "100%", border: `2px solid ${p.color}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: mode === "preview" ? "pointer" : "inherit" }}
    >
      {selected && <div style={{ width: "55%", height: "55%", borderRadius: "50%", background: p.color }} />}
    </div>
  );
}

function InteractiveSwitch({ p, mode }: { p: any; mode: Mode }) {
  const [on, setOn] = useState(!!p.on);
  return (
    <div
      onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setOn((o) => !o); } }}
      style={{ width: "100%", height: "100%", borderRadius: 999, background: on ? p.color : "#d4d4d8", display: "flex", alignItems: "center", padding: 3, justifyContent: on ? "flex-end" : "flex-start", cursor: mode === "preview" ? "pointer" : "inherit", transition: "background 0.15s" }}
    >
      <div style={{ width: "42%", aspectRatio: "1", borderRadius: "50%", background: "white" }} />
    </div>
  );
}

function InteractiveCheckboxList({ p, mode }: { p: any; mode: Mode }) {
  const items: string[] = p.items || [];
  const [checked, setChecked] = useState<boolean[]>(items.map((_, i) => i === 0));
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
      {items.map((item, i) => (
        <div
          key={i}
          onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setChecked((c) => c.map((v, idx) => (idx === i ? !v : v))); } }}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#27272a", cursor: mode === "preview" ? "pointer" : "inherit" }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${p.color}`, background: checked[i] ? p.color : "transparent" }} />
          {item}
        </div>
      ))}
    </div>
  );
}

function InteractiveCalendar({ p, mode }: { p: any; mode: Mode }) {
  const [selectedDay, setSelectedDay] = useState(14);
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff", borderRadius: 10, padding: 8, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, overflow: "hidden" }}>
      {days.map((d) => (
        <div
          key={d}
          onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setSelectedDay(d); } }}
          style={{ fontSize: 8, textAlign: "center", padding: 2, borderRadius: 4, background: d === selectedDay ? p.accent : "transparent", color: d === selectedDay ? "white" : "#3f3f46", cursor: mode === "preview" ? "pointer" : "inherit" }}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

function InteractiveDropdown({ p, mode }: { p: any; mode: Mode }) {
  const options: string[] = p.options || [];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[0] || "Select");
  const Chevron = getIcon("ChevronDown");
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setOpen((o) => !o); } }}
        style={{ width: "100%", height: "100%", background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 13, color: "#3f3f46", cursor: mode === "preview" ? "pointer" : "inherit" }}
      >
        {value} <Chevron size={14} />
      </div>
      {open && mode === "preview" && (
        <div style={{ position: "absolute", top: "105%", left: 0, right: 0, background: "white", border: "1px solid #e4e4e7", borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", zIndex: 20 }}>
          {options.map((o) => (
            <div key={o} onClick={(e) => { e.stopPropagation(); setValue(o); setOpen(false); }} style={{ padding: "8px 10px", fontSize: 12, color: "#27272a", cursor: "pointer" }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InteractiveSlider({ p, mode }: { p: any; mode: Mode }) {
  const [value, setValue] = useState(p.value);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setValue(Math.round(pct));
  };

  const onDown = (e: React.PointerEvent) => {
    if (mode !== "preview") return;
    e.stopPropagation();
    dragging.current = true;
    setFromClientX(e.clientX);
    const move = (ev: PointerEvent) => dragging.current && setFromClientX(ev.clientX);
    const up = () => { dragging.current = false; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
      <div ref={trackRef} onPointerDown={onDown} style={{ width: "100%", height: 4, background: "#e4e4e7", borderRadius: 2, position: "relative", cursor: mode === "preview" ? "pointer" : "inherit" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${value}%`, background: p.color, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: `${value}%`, top: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: p.color, border: "2px solid white" }} />
      </div>
    </div>
  );
}

function InteractiveOtp({ p, mode }: { p: any; mode: Mode }) {
  const digits = p.digits as number;
  const [vals, setVals] = useState<string[]>(Array.from({ length: digits }, () => ""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  if (mode !== "preview") {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", gap: 8 }}>
        {Array.from({ length: digits }).map((_, i) => (
          <div key={i} style={{ flex: 1, border: `1.5px solid ${p.color}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#18181b" }}>
            {i === 0 ? "•" : ""}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", gap: 8 }} onPointerDown={(e) => e.stopPropagation()}>
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={v}
          maxLength={1}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, "").slice(-1);
            setVals((prev) => prev.map((x, idx) => (idx === i ? digit : x)));
            if (digit && i < digits - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => { if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i - 1]?.focus(); }}
          style={{ flex: 1, border: `1.5px solid ${p.color}`, borderRadius: 8, textAlign: "center", fontSize: 16, color: "#18181b", outline: "none" }}
        />
      ))}
    </div>
  );
}

function InteractiveTabBar({ p, mode }: { p: any; mode: Mode }) {
  const tabs: string[] = p.tabs || [];
  const [active, setActive] = useState(0);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", borderBottom: "1px solid #e4e4e7" }}>
      {tabs.map((t, i) => (
        <div
          key={i}
          onClick={(e) => { if (mode === "preview") { e.stopPropagation(); setActive(i); } }}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: active === i ? p.activeColor : "#a1a1aa", borderBottom: active === i ? `2px solid ${p.activeColor}` : "2px solid transparent", cursor: mode === "preview" ? "pointer" : "inherit" }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

function InteractiveRating({ p, mode }: { p: any; mode: Mode }) {
  const [value, setValue] = useState(p.value);
  const StarIcon = getIcon("Star");
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: p.max }).map((_, i) => (
        <StarIcon
          key={i}
          size={18}
          color={p.color}
          fill={i < value ? p.color : "none"}
          style={{ cursor: mode === "preview" ? "pointer" : "inherit" }}
          onClick={(e: any) => { if (mode === "preview") { e.stopPropagation(); setValue(i + 1); } }}
        />
      ))}
    </div>
  );
}
