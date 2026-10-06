import { forwardRef } from "react";
import type { FamilyMemberDTO } from "@/lib/avatarOptions";
import AvatarPortrait from "./avatar/AvatarPortrait";
import { SURFACE_2, GLASS_BORDER, IRIS, TEXT_PRIMARY, TEXT_SECONDARY, HAIRLINE, FONT } from "@/lib/theme";

const MemberNode = forwardRef<HTMLButtonElement, { member: FamilyMemberDTO; highlighted: boolean; onClick: () => void; width: number }>(
  function MemberNode({ member, highlighted, onClick, width }, ref) {
    const cover = member.photos[0]?.url;
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        style={{
          width,
          background: SURFACE_2,
          border: `1px solid ${highlighted ? IRIS : GLASS_BORDER}`,
          borderRadius: 18,
          boxShadow: highlighted ? "0 0 0 3px rgba(139,92,246,0.28), 0 12px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.35)",
          textAlign: "left",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
          flexShrink: 0,
          cursor: "pointer",
          pointerEvents: "auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {cover && (
          <div style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 9, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.7)", boxShadow: "0 2px 8px rgba(0,0,0,0.4)", zIndex: 3 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
        <div style={{ background: "linear-gradient(160deg, rgba(139,92,246,0.10), transparent 60%)", display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <AvatarPortrait avatar={member.avatar} size={width - 30} crop="bust" id={member.id} />
        </div>
        <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${HAIRLINE}` }}>
          <div style={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 600, letterSpacing: "-0.01em", color: TEXT_PRIMARY }}>{member.name}</div>
          <div style={{ fontFamily: FONT, fontSize: 11.5, color: TEXT_SECONDARY, marginTop: 2 }}>{member.relation}</div>
        </div>
      </button>
    );
  }
);

export default MemberNode;
