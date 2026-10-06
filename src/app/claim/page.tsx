"use client";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import ClaimFlow from "@/components/ClaimFlow";
import { TEXT_SECONDARY, FONT } from "@/lib/theme";

export default function ClaimPage() {
  const { members, loading, error } = useFamilyMembers();

  if (loading) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>Loading…</div>;
  if (error) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>{error}</div>;

  return <ClaimFlow members={members} />;
}
