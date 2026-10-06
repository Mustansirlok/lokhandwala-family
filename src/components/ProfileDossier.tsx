"use client";
import { useState } from "react";
import { X, User, Mail, Ruler, Phone, Droplet } from "lucide-react";
import type { FamilyMemberDTO } from "@/lib/avatarOptions";
import { genLabel, computeAge } from "@/lib/avatarOptions";
import { GlassPanel, PillChip } from "./Glass";
import AvatarPortrait from "./avatar/AvatarPortrait";
import PhotoGallery from "./PhotoGallery";
import PhotoLightbox from "./PhotoLightbox";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, IRIS_LIGHT, HAIRLINE, FONT } from "@/lib/theme";

export default function ProfileDossier({ member, members, onClose, onUploadPhoto }: {
  member: FamilyMemberDTO;
  members: FamilyMemberDTO[];
  onClose: () => void;
  onUploadPhoto: (file: File) => Promise<void>;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const parents = [member.parent1Id, member.parent2Id].filter(Boolean).map((id) => members.find((m) => m.id === id)).filter(Boolean) as FamilyMemberDTO[];
  const parentLabel = parents.length ? `Child of ${parents.map((p) => p.name).join(" & ")}` : member.relation;
  const spouse = member.spouseId ? members.find((m) => m.id === member.spouseId) : null;
  const children = members.filter((m) => m.parent1Id === member.id || m.parent2Id === member.id);
  const v = member.vitals;
  const phone = v.phoneNumber ? `${v.phoneCountryCode || ""} ${v.phoneNumber}`.trim() : "";
  const photoUrls = member.photos.map((p) => p.url);

  const nav = (dir: 1 | -1) => setLightboxIndex((i) => ((i ?? 0) + dir + photoUrls.length) % photoUrls.length);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <div className="animate-[slidein_0.4s_cubic-bezier(.2,.8,.2,1)]" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(440px, 94vw)", overflowY: "auto" }}>
        <GlassPanel style={{ minHeight: "100%", borderRadius: 0, borderRight: "none", borderTop: "none", borderBottom: "none" }}>
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between mb-5">
              <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: IRIS_LIGHT, textTransform: "uppercase", fontWeight: 600 }}>{genLabel(member.gen)}</div>
              <button type="button" onClick={onClose} aria-label="Close dossier" className="obsidian-btn" style={{ padding: 4, cursor: "pointer" }}><X size={18} color={TEXT_SECONDARY} /></button>
            </div>

            <div className="flex flex-col items-center">
              <AvatarPortrait avatar={member.avatar} size={190} crop="full" id={member.id} />
              <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_PRIMARY, marginTop: 8 }}>{member.name}</h2>
              {member.deceased && (
                <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.04em", color: TEXT_TERTIARY, marginTop: 2, fontStyle: "italic" }}>In loving memory</div>
              )}
              <div style={{ fontFamily: FONT, fontSize: 13, color: TEXT_SECONDARY, marginTop: 2 }}>{parentLabel}</div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-6">
              <PillChip icon={User} label="Age" value={member.deceased ? "In loving memory" : computeAge(v.birthYear)} />
              <PillChip icon={Droplet} label="Blood Group" value={v.bloodGroup} />
              <PillChip icon={Ruler} label="Height" value={v.height} />
              <PillChip icon={Phone} label="Phone" value={phone} />
              <div className="col-span-2"><PillChip icon={Mail} label="Email" value={v.email} /></div>
            </div>

            {(spouse || children.length > 0) && (
              <div className="grid grid-cols-2 gap-4 mt-5" style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT_SECONDARY }}>
                {spouse && (
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Spouse</div>
                    <div style={{ color: TEXT_PRIMARY, marginTop: 3 }}>{spouse.name}</div>
                  </div>
                )}
                {children.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Children</div>
                    <div style={{ color: TEXT_PRIMARY, marginTop: 3 }}>{children.map((c) => c.name).join(", ")}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ height: 1, background: HAIRLINE, margin: "22px 0" }} />

            <PhotoGallery photos={photoUrls} onUpload={onUploadPhoto} onOpen={(i) => setLightboxIndex(i)} />

            {member.bio ? (
              <>
                <div style={{ height: 1, background: HAIRLINE, margin: "22px 0" }} />
                <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase", marginBottom: 6 }}>Anecdote</div>
                <p style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT_PRIMARY, lineHeight: 1.6 }}>{member.bio}</p>
              </>
            ) : null}
          </div>
        </GlassPanel>
      </div>
      <PhotoLightbox photos={photoUrls} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={nav} />
    </div>
  );
}
