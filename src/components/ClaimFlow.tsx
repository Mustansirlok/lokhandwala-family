"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, ScrollText, ShieldCheck, Plus, Check } from "lucide-react";
import {
  AvatarConfig, FamilyMemberDTO, defaultAvatar, genLabel, COUNTRY_CODES, BLOOD_GROUPS,
} from "@/lib/avatarOptions";
import { GlassPanel, GlassButton } from "./Glass";
import AvatarPortrait from "./avatar/AvatarPortrait";
import AvatarBuilder from "./avatar/AvatarBuilder";
import PhotoGallery from "./PhotoGallery";
import { TextField, SelectField } from "./FormFields";
import { resizeImageFile } from "@/lib/resizeImage";
import { OBSIDIAN, GLASS_BORDER, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, HAIRLINE, FONT } from "@/lib/theme";

async function uploadClaimPhoto(claimId: string, file: File): Promise<string> {
  const blob = await resizeImageFile(file);
  const form = new FormData();
  form.append("file", blob, "photo.jpg");
  const res = await fetch(`/api/claims/${claimId}/photos`, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Photo upload failed");
  }
  const data = await res.json();
  return (data.photoUrls as string[])[data.photoUrls.length - 1];
}

export default function ClaimFlow({ members }: { members: FamilyMemberDTO[] }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [parentQuery, setParentQuery] = useState("");
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatar());
  const [photos, setPhotos] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [height, setHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const steps = ["Personal Credentials", "Avatar Builder", "Photo Vault & Anecdotes"];

  const parentResults = parentQuery.trim() ? members.filter((m) => m.name.toLowerCase().includes(parentQuery.trim().toLowerCase())) : members;
  const toggleParent = (id: string) => {
    setParentIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };
  const chosenParents = parentIds.map((id) => members.find((m) => m.id === id)).filter(Boolean) as FamilyMemberDTO[];
  const relationPreview = chosenParents.length ? `Child of ${chosenParents.map((p) => p.name).join(" & ")}` : "Select at least one parent";

  const canNextStep0 = name.trim().length > 1 && email.trim().length > 3 && phoneNumber.trim().length > 3 && parentIds.length >= 1;

  const setAvatarField = <K extends keyof AvatarConfig>(field: K, value: AvatarConfig[K]) => setAvatar((a) => ({ ...a, [field]: value }));

  const goToAvatarStep = async () => {
    setBusy(true);
    setFormError(null);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phoneCountryCode, phoneNumber: phoneNumber.trim(),
          parent1Id: parentIds[0] || null, parent2Id: parentIds[1] || null, avatar,
        }),
      });
      if (!res.ok) throw new Error("Couldn't start your claim — please try again.");
      const data = await res.json();
      setClaimId(data.id);
      setStep(1);
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const goToPhotoStep = async () => {
    if (!claimId) return setStep(2);
    setBusy(true);
    setFormError(null);
    try {
      await fetch(`/api/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      });
      setStep(2);
    } catch {
      setFormError("Couldn't save your avatar — you can still continue.");
      setStep(2);
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!claimId) return;
    setBusy(true);
    setFormError(null);
    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bio.trim(), birthYear: birthYear.trim(), height: height.trim(), bloodGroup }),
      });
      if (!res.ok) throw new Error("Couldn't file your claim — please try again.");
      setDone(true);
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addPhoto = async (file: File) => {
    if (!claimId) throw new Error("Something went wrong — please restart your claim.");
    const url = await uploadClaimPhoto(claimId, file);
    setPhotos((prev) => [...prev, url]);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6" style={{ background: OBSIDIAN }}>
        <AvatarPortrait avatar={avatar} size={130} crop="bust" animated={false} />
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(139,92,246,0.16)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <ShieldCheck size={24} color={IRIS_LIGHT} />
        </div>
        <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_PRIMARY, marginTop: 16 }}>Wait for Approval by Admin</h2>
        <p style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT_SECONDARY, marginTop: 8, maxWidth: 380 }}>
          {name}'s claim — {relationPreview.toLowerCase()} — has been sent to the Admin queue for review.
        </p>
        <GlassButton
          variant="ghost"
          icon={Plus}
          onClick={() => {
            setDone(false); setStep(0); setClaimId(null);
            setName(""); setEmail(""); setPhoneCountryCode("+1"); setPhoneNumber(""); setParentIds([]);
            setAvatar(defaultAvatar()); setPhotos([]); setBio(""); setBirthYear(""); setHeight(""); setBloodGroup("");
          }}
          style={{ marginTop: 20 }}
        >
          File another claim
        </GlassButton>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6 sm:py-10 px-3 sm:px-4 h-full overflow-y-auto" style={{ background: OBSIDIAN }}>
      <GlassPanel style={{ width: "100%", maxWidth: 640, height: "fit-content" }}>
        <div className="px-5 sm:px-8 pt-7">
          <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.06em", color: IRIS_LIGHT, textTransform: "uppercase", fontWeight: 600 }}>Step {step + 1} of {steps.length}</div>
          <h2 style={{ fontFamily: FONT, fontSize: 23, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_PRIMARY, marginTop: 4 }}>{steps[step]}</h2>
          <div className="flex gap-1.5 mt-4">
            {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#8B5CF6" : HAIRLINE }} />)}
          </div>
        </div>

        <div className="px-5 sm:px-8 py-7">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <TextField label="Full Name" value={name} onChange={setName} placeholder="As it should appear on the tree" />
              <TextField label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
              <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(118px, 1fr) 2fr" }}>
                <SelectField label="Country Code" value={phoneCountryCode} onChange={setPhoneCountryCode}>
                  {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </SelectField>
                <div>
                  <TextField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="98765 43210" />
                </div>
              </div>

              <div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, marginBottom: 8 }}>Parent Linkage</div>
                <input
                  value={parentQuery}
                  onChange={(e) => setParentQuery(e.target.value)}
                  placeholder="Search the tree for your parent(s)…"
                  style={{ width: "100%", padding: "10px 13px", background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, fontFamily: FONT, fontSize: 13.5, color: TEXT_PRIMARY, marginBottom: 8 }}
                />
                <div style={{ maxHeight: 190, overflowY: "auto", border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
                  {parentResults.map((m) => {
                    const active = parentIds.includes(m.id);
                    return (
                      <button key={m.id} type="button" onClick={() => toggleParent(m.id)} className="w-full flex items-center justify-between px-3.5 py-2.5 obsidian-btn" style={{ background: active ? "rgba(139,92,246,0.14)" : "transparent", borderBottom: `1px solid ${HAIRLINE}`, fontFamily: FONT, fontSize: 13, color: TEXT_PRIMARY, cursor: "pointer" }}>
                        <span>{m.name} <span style={{ color: TEXT_TERTIARY, fontSize: 11 }}>· {genLabel(m.gen)}</span></span>
                        {active && <Check size={14} color={IRIS_LIGHT} />}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 10, fontFamily: FONT, fontSize: 13, color: IRIS_LIGHT }}>{relationPreview}</div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center">
                <GlassPanel style={{ padding: 12 }}>
                  <AvatarPortrait avatar={avatar} size={160} crop="full" />
                </GlassPanel>
              </div>
              <div className="flex-1">
                <AvatarBuilder avatar={avatar} onChange={setAvatarField} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <PhotoGallery photos={photos} onUpload={addPhoto} onOpen={() => {}} />
              <label style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY }}>
                Anecdote
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="A memory, a habit, a running family joke…"
                  style={{ marginTop: 6, width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}`, borderRadius: 12, fontFamily: FONT, fontSize: 13.5, color: TEXT_PRIMARY, resize: "vertical" }}
                />
              </label>

              <div>
                <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase", marginBottom: 10 }}>A Few More Details (optional)</div>
                <div className="grid grid-cols-3 gap-3">
                  <TextField label="Birth Year" value={birthYear} onChange={setBirthYear} placeholder="e.g. 1998" />
                  <TextField label="Height" value={height} onChange={setHeight} placeholder="5'9&quot;" />
                  <SelectField label="Blood Group" value={bloodGroup} onChange={setBloodGroup}>
                    <option value="">—</option>
                    {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </SelectField>
                </div>
              </div>
            </div>
          )}

          {formError && <div style={{ fontFamily: FONT, fontSize: 12, color: "#F87171", marginTop: 14 }}>{formError}</div>}
        </div>

        <div className="px-5 sm:px-8 pb-7 flex justify-between">
          <GlassButton variant="ghost" icon={ArrowLeft} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy}>Back</GlassButton>
          {step === 0 && <GlassButton variant="primary" icon={ArrowRight} onClick={goToAvatarStep} disabled={!canNextStep0 || busy}>{busy ? "Please wait…" : "Continue"}</GlassButton>}
          {step === 1 && <GlassButton variant="primary" icon={ArrowRight} onClick={goToPhotoStep} disabled={busy}>{busy ? "Please wait…" : "Continue"}</GlassButton>}
          {step === 2 && <GlassButton variant="primary" icon={ScrollText} onClick={submit} disabled={busy}>{busy ? "Submitting…" : "Submit Claim"}</GlassButton>}
        </div>
      </GlassPanel>
    </div>
  );
}
