"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, BadgeCheck } from "lucide-react";
import type { AvatarConfig, FamilyMemberDTO } from "@/lib/avatarOptions";
import { genLabel } from "@/lib/avatarOptions";
import { GlassPanel, GlassButton } from "./Glass";
import AvatarPortrait from "./avatar/AvatarPortrait";
import AvatarBuilder from "./avatar/AvatarBuilder";
import { OBSIDIAN, SURFACE_2, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, GLASS_BORDER, HAIRLINE, FONT } from "@/lib/theme";

export default function AvatarAtelierClient({
  members, onSave,
}: {
  members: FamilyMemberDTO[];
  onSave: (id: string, avatar: AvatarConfig) => Promise<void>;
}) {
  const sorted = useMemo(() => [...members].sort((a, b) => a.gen - b.gen || a.order - b.order), [members]);
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id || null);
  const member = members.find((m) => m.id === selectedId);
  const [draft, setDraft] = useState<AvatarConfig | null>(member?.avatar || null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vp, setVp] = useState({ w: 1024, h: 800 });
  useEffect(() => {
    const u = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    u();
    window.addEventListener("resize", u);
    window.addEventListener("orientationchange", u);
    return () => { window.removeEventListener("resize", u); window.removeEventListener("orientationchange", u); };
  }, []);
  const narrow = vp.w < 768;
  const short = vp.h < 560;

  useEffect(() => {
    const m = members.find((mm) => mm.id === selectedId);
    if (m) setDraft(m.avatar);
    setSaved(false);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  if (!member || !draft) {
    return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>No members yet.</div>;
  }

  const setField = <K extends keyof AvatarConfig>(field: K, value: AvatarConfig[K]) => {
    setDraft((d) => (d ? { ...d, [field]: value } : d));
    setSaved(false);
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(member.avatar);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(member.id, draft);
      setSaved(true);
    } catch (e: any) {
      setError(e.message || "Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 16, padding: "9px 12px", background: SURFACE_2, color: TEXT_PRIMARY, border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, width: "100%", cursor: "pointer", minWidth: 0 };
  const options = sorted.map((m) => <option key={m.id} value={m.id}>{m.name} — {genLabel(m.gen)}</option>);
  const actions = (
    <>
      <GlassButton variant="ghost" onClick={() => { setDraft(member.avatar); setSaved(false); }} disabled={!dirty}>Discard</GlassButton>
      <GlassButton variant="primary" icon={BadgeCheck} onClick={handleSave} disabled={saving || (!dirty && !saved)}>
        {saving ? "Saving…" : saved ? "Saved" : "Save"}
      </GlassButton>
    </>
  );

  // ---------- Phone / small tablet portrait: preview strip on top, options fill the rest ----------
  if (narrow) {
    return (
      <div className="flex flex-col h-full" style={{ background: OBSIDIAN, minHeight: 0 }}>
        <div style={{ flexShrink: 0, padding: "12px 14px", borderBottom: `1px solid ${HAIRLINE}`, display: "flex", gap: 12, alignItems: "center" }}>
          <GlassPanel style={{ padding: 6, flexShrink: 0 }}>
            <AvatarPortrait avatar={draft} size={104} crop="full" id={member.id} />
          </GlassPanel>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <select value={selectedId || ""} onChange={(e) => setSelectedId(e.target.value)} style={selectStyle} aria-label="Member to edit">{options}</select>
            <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.relation}</div>
            {error && <div style={{ fontFamily: FONT, fontSize: 11.5, color: "#F87171" }}>{error}</div>}
            <div style={{ display: "flex", gap: 8 }}>{actions}</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: "12px 14px 0" }}>
          <AvatarBuilder avatar={draft} onChange={setField} mobile />
        </div>
      </div>
    );
  }

  // ---------- Desktop / landscape ----------
  const avSize = short ? 100 : 190;
  return (
    <div className="flex flex-row h-full overflow-hidden" style={{ background: OBSIDIAN }}>
      <div className={`w-2/5 shrink-0 ${short ? "p-3" : "p-6"} flex flex-col items-center overflow-y-auto`} style={{ borderRight: `1px solid ${HAIRLINE}` }}>
        {!short && <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Editing</div>}
        <select value={selectedId || ""} onChange={(e) => setSelectedId(e.target.value)} style={{ ...selectStyle, marginTop: short ? 0 : 10, marginBottom: short ? 10 : 22, maxWidth: 320, fontSize: 13.5 }}>{options}</select>
        <GlassPanel style={{ padding: short ? 10 : 16 }}>
          <AvatarPortrait avatar={draft} size={avSize} crop="full" id={member.id} />
        </GlassPanel>
        <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginTop: short ? 6 : 12, color: TEXT_PRIMARY }}>{member.name}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, marginBottom: short ? 8 : 14 }}>{member.relation}</div>
        {error && <div style={{ fontFamily: FONT, fontSize: 11.5, color: "#F87171", marginBottom: 10 }}>{error}</div>}
        <div className="flex gap-2 mt-auto flex-wrap justify-center">{actions}</div>
      </div>
      <div className="flex-1 min-w-0 p-6 sm:p-8 min-h-0">
        <AvatarBuilder avatar={draft} onChange={setField} />
      </div>
    </div>
  );
}
