"use client";
import React from "react";
import { GLASS_BG, GLASS_BORDER, IRIS, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, DANGER, FONT } from "@/lib/theme";
import type { LucideIcon } from "lucide-react";

export function GlassPanel({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: GLASS_BG,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${GLASS_BORDER}`,
        borderRadius: 18,
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type Variant = "primary" | "ghost" | "danger" | "subtle";

export function GlassButton({
  children, onClick, variant = "primary", icon: Icon, disabled, type = "button", style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  const styles: Record<Variant, React.CSSProperties> = {
    primary: { background: IRIS, color: "#fff", border: `1px solid ${IRIS}` },
    ghost: { background: "rgba(255,255,255,0.06)", color: TEXT_PRIMARY, border: `1px solid ${GLASS_BORDER}` },
    danger: { background: "rgba(248,113,113,0.12)", color: DANGER, border: "1px solid rgba(248,113,113,0.35)" },
    subtle: { background: "transparent", color: TEXT_SECONDARY, border: "1px solid transparent" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="obsidian-btn px-4 py-2.5 inline-flex items-center gap-2"
      style={{ ...styles[variant], fontFamily: FONT, fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", borderRadius: 12, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
    >
      {Icon && <Icon size={14} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function PillChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const empty = !value;
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(139,92,246,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={13} color={IRIS_LIGHT} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 10, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: empty ? TEXT_TERTIARY : TEXT_PRIMARY, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value || "Not set"}
        </div>
      </div>
    </div>
  );
}

export function CountChip({ n }: { n: number }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, background: IRIS, color: "#fff", borderRadius: 999, minWidth: 17, height: 17, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      {n}
    </span>
  );
}

export function SegmentedControl({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  return (
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, background: "rgba(255,255,255,0.05)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 14, padding: 3, width: "fit-content" }}>
      <div
        style={{
          position: "absolute", top: 3, bottom: 3,
          left: `calc(${idx} * (100% / ${options.length}) + 3px)`,
          width: `calc((100% / ${options.length}) - 6px)`,
          background: IRIS, borderRadius: 11, transition: "left 0.32s cubic-bezier(.2,.8,.2,1)",
          boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
        }}
      />
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{ position: "relative", zIndex: 1, padding: "8px 16px", fontFamily: FONT, fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", color: active ? "#fff" : TEXT_SECONDARY, whiteSpace: "nowrap", cursor: "pointer" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
