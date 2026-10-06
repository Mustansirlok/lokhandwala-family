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

  return (
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden" style={{ background: OBSIDIAN }}>
      <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col items-center" style={{ borderRight: `1px solid ${HAIRLINE}` }}>
        <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Editing</div>
        <select
          value={selectedId || ""}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ marginTop: 10, marginBottom: 22, fontFamily: FONT, fontSize: 13.5, padding: "9px 12px", background: SURFACE_2, color: TEXT_PRIMARY, border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, width: "100%", maxWidth: 320, cursor: "pointer" }}
        >
          {sorted.map((m) => <option key={m.id} value={m.id}>{m.name} — {genLabel(m.gen)}</option>)}
        </select>

        <GlassPanel style={{ padding: 16 }}>
          <AvatarPortrait avatar={draft} size={190} crop="full" id={member.id} />
        </GlassPanel>

        <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 16, color: TEXT_PRIMARY }}>{member.name}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, marginBottom: 18 }}>{member.relation}</div>

        {error && <div style={{ fontFamily: FONT, fontSize: 11.5, color: "#F87171", marginBottom: 10 }}>{error}</div>}

        <div className="flex gap-2 mt-auto flex-wrap justify-center">
          <GlassButton variant="ghost" onClick={() => { setDraft(member.avatar); setSaved(false); }} disabled={!dirty}>Discard</GlassButton>
          <GlassButton variant="primary" icon={BadgeCheck} onClick={handleSave} disabled={saving || (!dirty && !saved)}>
            {saving ? "Saving…" : saved ? "Saved" : "Save"}
          </GlassButton>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <AvatarBuilder avatar={draft} onChange={setField} />
      </div>
    </div>
  );
}
