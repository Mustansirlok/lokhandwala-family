"use client";
import { useCallback, useEffect, useState } from "react";
import { Inbox, BadgeCheck, Ban, Lock } from "lucide-react";
import type { ClaimDTO, FamilyMemberDTO } from "@/lib/avatarOptions";
import { GlassPanel, GlassButton } from "./Glass";
import AvatarPortrait from "./avatar/AvatarPortrait";
import { OBSIDIAN, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, HAIRLINE, FONT } from "@/lib/theme";

export default function AdminQueue({ members, onApproved }: { members: FamilyMemberDTO[]; onApproved: () => void }) {
  const [claims, setClaims] = useState<ClaimDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/claims");
      if (!res.ok) throw new Error("Couldn't load the queue");
      const data = await res.json();
      setClaims(data.claims);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/claims/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Approval failed");
      await refetch();
      onApproved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const decline = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/claims/${id}/decline`, { method: "POST" });
      if (!res.ok) throw new Error("Decline failed");
      await refetch();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: OBSIDIAN }}>
      <div className="px-4 sm:px-6 pt-5 pb-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <Lock size={12} color={IRIS_LIGHT} />
        <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Admin Only</span>
      </div>

      {error && <div className="px-6 pt-4" style={{ fontFamily: FONT, fontSize: 12.5, color: "#F87171" }}>{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-24" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>Loading…</div>
      ) : claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 py-24">
          <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Inbox size={26} color={TEXT_TERTIARY} />
          </div>
          <h2 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: TEXT_PRIMARY, marginTop: 16 }}>Queue is clear</h2>
          <p style={{ fontFamily: FONT, fontSize: 13, color: TEXT_SECONDARY, marginTop: 6 }}>Every claim has been reviewed.</p>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: TEXT_TERTIARY, textTransform: "uppercase", marginBottom: 12 }}>
            {claims.length} pending claim{claims.length === 1 ? "" : "s"}
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
            {claims.map((c) => {
              const parents = [c.parent1Id, c.parent2Id].filter(Boolean).map((id) => members.find((m) => m.id === id)).filter(Boolean) as FamilyMemberDTO[];
              const relationPreview = parents.length ? `Child of ${parents.map((p) => p.name).join(" & ")}` : "Unlinked";
              return (
                <GlassPanel key={c.id} style={{ padding: 0 }}>
                  <div className="p-4 flex gap-3">
                    <AvatarPortrait avatar={c.avatar} size={72} crop="bust" id={c.id} />
                    <div>
                      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: TEXT_PRIMARY }}>{c.name}</div>
                      <div style={{ fontFamily: FONT, fontSize: 12, color: IRIS_LIGHT, marginTop: 2 }}>{relationPreview}</div>
                      {c.photoUrls?.length > 0 && <div style={{ fontFamily: FONT, fontSize: 11, color: TEXT_TERTIARY, marginTop: 3 }}>{c.photoUrls.length} photo{c.photoUrls.length === 1 ? "" : "s"} attached</div>}
                    </div>
                  </div>
                  {c.bio && <div className="px-4 pb-3" style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT_SECONDARY, fontStyle: "italic" }}>&quot;{c.bio}&quot;</div>}
                  <div className="px-4 pb-3" style={{ fontFamily: FONT, fontSize: 11.5, color: TEXT_TERTIARY }}>
                    {c.email && <div>{c.email}</div>}
                    {c.phoneNumber && <div>{c.phoneCountryCode} {c.phoneNumber}</div>}
                  </div>
                  <div className="px-4 pb-4 flex gap-2 pt-3" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                    <GlassButton variant="primary" icon={BadgeCheck} onClick={() => approve(c.id)} disabled={busyId === c.id}>Approve</GlassButton>
                    <GlassButton variant="danger" icon={Ban} onClick={() => decline(c.id)} disabled={busyId === c.id}>Decline</GlassButton>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
