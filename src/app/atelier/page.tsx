"use client";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import AvatarAtelierClient from "@/components/AvatarAtelierClient";
import { TEXT_SECONDARY, FONT } from "@/lib/theme";

export default function AtelierPage() {
  const { members, loading, error, saveAvatar } = useFamilyMembers();

  if (loading) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>Loading…</div>;
  if (error) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>{error}</div>;

  return <AvatarAtelierClient members={members} onSave={saveAvatar} />;
}
