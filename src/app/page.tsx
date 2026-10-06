"use client";
import { useState } from "react";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import LineageCanvas from "@/components/LineageCanvas";
import ProfileDossier from "@/components/ProfileDossier";
import { TEXT_SECONDARY, FONT } from "@/lib/theme";

export default function HomePage() {
  const { members, loading, error, addPhoto, updateDetails } = useFamilyMembers();
  const [dossierId, setDossierId] = useState<string | null>(null);
  const dossierMember = dossierId ? members.find((m) => m.id === dossierId) : null;

  if (loading) {
    return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>Loading the family tree…</div>;
  }
  if (error) {
    return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>{error}</div>;
  }

  return (
    <>
      <LineageCanvas members={members} onOpenDossier={setDossierId} />
      {dossierMember && (
        <ProfileDossier
          member={dossierMember}
          members={members}
          onClose={() => setDossierId(null)}
          onUploadPhoto={(file) => addPhoto(dossierMember.id, file)}
          onUpdateDetails={(details) => updateDetails(dossierMember.id, details)}
        />
      )}
    </>
  );
}
