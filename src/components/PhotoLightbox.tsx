"use client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GLASS_BORDER, FONT } from "@/lib/theme";

export default function PhotoLightbox({ photos, index, onClose, onNav }: {
  photos: string[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  if (index === null || !photos[index]) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />
      <button type="button" onClick={onClose} className="obsidian-btn" style={{ position: "absolute", top: 20, right: 20, zIndex: 2, width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: `1px solid ${GLASS_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <X size={18} color="#fff" />
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" onClick={() => onNav(-1)} className="obsidian-btn" style={{ position: "absolute", left: 20, zIndex: 2, width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.1)", border: `1px solid ${GLASS_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <button type="button" onClick={() => onNav(1)} className="obsidian-btn" style={{ position: "absolute", right: 20, zIndex: 2, width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.1)", border: `1px solid ${GLASS_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={20} color="#fff" />
          </button>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[index]} alt="" style={{ position: "relative", zIndex: 1, maxWidth: "88vw", maxHeight: "82vh", borderRadius: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", bottom: 24, fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{index + 1} / {photos.length}</div>
    </div>
  );
}
