"use client";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { MAX_PHOTOS } from "@/lib/avatarOptions";
import { GLASS_BORDER, TEXT_TERTIARY, FONT } from "@/lib/theme";

export default function PhotoGallery({ photos, onUpload, onOpen, editable = true }: {
  photos: string[];
  onUpload: (file: File) => Promise<void>;
  onOpen: (index: number) => void;
  editable?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    const remaining = MAX_PHOTOS - photos.length;
    try {
      for (const file of files.slice(0, remaining)) {
        await onUpload(file);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed — please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.04em", color: TEXT_TERTIARY, textTransform: "uppercase" }}>Photos</div>
        <div style={{ fontFamily: FONT, fontSize: 11, color: TEXT_TERTIARY }}>{photos.length}/{MAX_PHOTOS}</div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {photos.map((url, i) => (
          <button key={i} type="button" onClick={() => onOpen(i)} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: `1px solid ${GLASS_BORDER}`, cursor: "pointer", padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </button>
        ))}
        {editable && photos.length < MAX_PHOTOS && (
          <label className="obsidian-btn" style={{ aspectRatio: "1", borderRadius: 10, border: `1px dashed ${GLASS_BORDER}`, background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.6 : 1 }}>
            <Plus size={16} color={TEXT_TERTIARY} />
            <span style={{ fontFamily: FONT, fontSize: 9, color: TEXT_TERTIARY }}>{busy ? "Uploading…" : "Add"}</span>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={busy} />
          </label>
        )}
      </div>
      {error && <div style={{ fontFamily: FONT, fontSize: 11.5, color: "#F87171", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
