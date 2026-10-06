"use client";
import { GLASS_BORDER, TEXT_SECONDARY, TEXT_PRIMARY, FONT } from "@/lib/theme";

export function TextField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label style={{ display: "block", fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ marginTop: 6, width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, fontFamily: FONT, fontSize: 14, color: TEXT_PRIMARY, outline: "none" }}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, children, style }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <label style={{ display: "block", fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, ...style }}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: 6, width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, fontFamily: FONT, fontSize: 14, color: TEXT_PRIMARY, cursor: "pointer" }}
      >
        {children}
      </select>
    </label>
  );
}
