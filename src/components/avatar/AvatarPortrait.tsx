import {
  AvatarConfig, SKIN_OPTIONS, HAIR_COLOR_OPTIONS, FACE_PATHS, TOP_OPTIONS, BOTTOM_OPTIONS,
  SHOE_OPTIONS, MEN_HAIR_OPTIONS, WOMEN_HAIR_OPTIONS, hashSeed, shade,
} from "@/lib/avatarOptions";
import { renderHairBack, renderHairFront } from "./hair";
import { renderTop, renderBottom } from "./garments";
import CartoonHead from "./CartoonHead";

export default function AvatarPortrait({
  avatar, size = 120, crop = "full", animated = true, id = "", age,
}: {
  age?: number;
  avatar: AvatarConfig;
  size?: number;
  crop?: "full" | "bust";
  animated?: boolean;
  id?: string;
}) {
  const skin = SKIN_OPTIONS.find((s) => s.id === avatar.skin)?.hex || SKIN_OPTIONS[1].hex;
  const skinLight = shade(skin, 24);
  const skinDark = shade(skin, -18);
  const hairHex = HAIR_COLOR_OPTIONS.find((h) => h.id === avatar.hairColor)?.hex || HAIR_COLOR_OPTIONS[0].hex;
  const facePath = FACE_PATHS[avatar.faceShape] || FACE_PATHS.round;
  const hairCatalog = avatar.gender === "women" ? WOMEN_HAIR_OPTIONS : MEN_HAIR_OPTIONS;
  const hairValid = hairCatalog.some((h) => h.id === avatar.hair) ? avatar.hair : hairCatalog[0].id;
  const topColor = avatar.topColor || TOP_OPTIONS.find((t) => t.id === avatar.top)?.defaultColor || "#4B5563";
  const bottomColor = avatar.bottomColor || BOTTOM_OPTIONS.find((b) => b.id === avatar.bottom)?.defaultColor || "#2E2A26";
  const shoeColor = avatar.shoeColor || SHOE_OPTIONS.find((s) => s.id === avatar.shoes)?.defaultColor || "#F4F2EC";
  const accessories = avatar.accessories || [];
  const has = (a: string) => accessories.includes(a);

  const seedStr = (id || JSON.stringify(avatar)) + "";
  const h = hashSeed(seedStr);
  const blinkDelay = (h % 500) / 100;
  const breatheDur = 4 + ((h >> 3) % 150) / 100;
  const breatheDelay = ((h >> 6) % 300) / 100;
  const idBase = h % 999999;
  const skinGradId = `skin-${idBase}`;
  const neckGradId = `neck-${idBase}`;
  const denimId = `denim-${idBase}`;
  const linenId = `linen-${idBase}`;

  const viewBoxH = crop === "bust" ? 190 : 300;

  return (
    <div style={{ width: size, height: size * (viewBoxH / 200), position: "relative" }}>
      <svg viewBox={`0 0 200 ${viewBoxH}`} width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <radialGradient id={skinGradId} cx="42%" cy="34%" r="75%">
            <stop offset="0%" stopColor={skinLight} />
            <stop offset="55%" stopColor={skin} />
            <stop offset="100%" stopColor={skinDark} />
          </radialGradient>
          <linearGradient id={neckGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skin} />
            <stop offset="100%" stopColor={skinDark} />
          </linearGradient>
          <pattern id={denimId} width="3" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#1E2A38" strokeOpacity="0.4" strokeWidth="0.7" />
          </pattern>
          <pattern id={linenId} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke="#000" strokeOpacity="0.08" strokeWidth="0.5" />
          </pattern>
        </defs>

        <g className={animated ? "avatar-breathe" : ""} style={animated ? { animationDuration: `${breatheDur}s`, animationDelay: `${breatheDelay}s` } : {}}>
          <ellipse cx="80" cy="292" rx="15" ry="7" fill={shoeColor} stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          <ellipse cx="120" cy="292" rx="15" ry="7" fill={shoeColor} stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          {avatar.shoes === "dress-shoes" && (
            <>
              <path d="M68 292 L92 292" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
              <path d="M108 292 L132 292" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            </>
          )}

          {renderBottom(avatar.bottom, bottomColor, skin, denimId, linenId)}
          {renderTop(avatar.top, topColor, linenId)}

          {has("bag") && (
            <>
              <path d="M70 160 L128 205" stroke="#4A3728" strokeWidth="5" strokeOpacity="0.9" />
              <rect x="112" y="196" width="24" height="20" rx="3" fill="#4A3728" />
            </>
          )}

          {avatar.face ? (
            <CartoonHead face={avatar.face} age={age} idBase={idBase} />
          ) : (
            <>
          <rect x="88" y="140" width="24" height="30" fill={`url(#${neckGradId})`} />
          <path d={facePath} fill={`url(#${skinGradId})`} />
          <ellipse cx="72" cy="112" rx="9" ry="6.5" fill={skinLight} opacity="0.26" />
          <ellipse cx="128" cy="112" rx="9" ry="6.5" fill={skinLight} opacity="0.26" />

          {renderHairBack(hairValid, hairHex)}

          <g className={animated ? "avatar-blink" : ""} style={animated ? { animationDelay: `${blinkDelay}s`, transformOrigin: "84px 102px" } : {}}>
            <ellipse cx="84" cy="102" rx="7.5" ry="5" fill="#F5F1E8" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <circle cx="84" cy="102" r="2.8" fill="#241C14" />
          </g>
          <g className={animated ? "avatar-blink" : ""} style={animated ? { animationDelay: `${blinkDelay}s`, transformOrigin: "116px 102px" } : {}}>
            <ellipse cx="116" cy="102" rx="7.5" ry="5" fill="#F5F1E8" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <circle cx="116" cy="102" r="2.8" fill="#241C14" />
          </g>
          <path d="M76 92 L92 91" stroke="#241C14" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M108 91 L124 92" stroke="#241C14" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M100 102 L96 115 L104 115" fill="none" stroke="#241C14" strokeOpacity="0.45" strokeWidth="1.3" />
          <path d="M90 125 Q100 131 110 125" fill="none" stroke="#241C14" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />

          {renderHairFront(hairValid, hairHex, `net-${idBase}`, `fade-${idBase}`)}

            </>
          )}

          {has("cap") && (
            <g>
              <path d="M56 92 Q100 62 144 92 Q140 70 100 62 Q60 70 56 92 Z" fill="#2B2E33" />
              <path d="M56 92 Q80 100 100 100" fill="none" stroke="#2B2E33" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}
          {has("beanie") && <path d="M58 92 Q60 56 100 52 Q140 56 142 92 Q136 78 100 74 Q64 78 58 92 Z" fill="#3B3F45" />}
          {has("topi") && (
            <>
              <path d="M62 84 Q100 58 138 84 L136 66 Q100 46 64 66 Z" fill="#F3EEDD" stroke="#C6A15B" strokeWidth="1" strokeOpacity="0.7" />
              <path d="M64 66 Q100 46 136 66" fill="none" stroke="#C6A15B" strokeWidth="1.2" strokeOpacity="0.8" />
            </>
          )}

          {has("sunglasses") && (
            <g>
              <rect x="74" y="96" width="20" height="14" rx="4" fill="#111" opacity="0.92" />
              <rect x="106" y="96" width="20" height="14" rx="4" fill="#111" opacity="0.92" />
              <path d="M94 100 L106 100" stroke="#111" strokeWidth="2.4" />
            </g>
          )}
          {has("wire-glasses") && (
            <g fill="none" stroke="#D4D4D8" strokeWidth="1.4" opacity="0.85">
              <circle cx="84" cy="102" r="9" /><circle cx="116" cy="102" r="9" /><path d="M93 102 L107 102" />
            </g>
          )}

          {has("tie") && <path d="M96 160 L104 160 L108 200 L100 210 L92 200 Z" fill="#7B1F2B" />}
          {has("brooch") && (
            <g>
              <circle cx="100" cy="178" r="6" fill="#D9B24C" stroke="#241C14" strokeOpacity="0.4" />
              <path d="M100 174 L102 178 L100 182 L98 178 Z" fill="#F3EEDD" />
            </g>
          )}
          {has("trophy") && (
            <g transform="translate(148, 210)">
              <rect x="-4" y="14" width="8" height="6" fill="#D9B24C" />
              <path d="M-6 0 L6 0 L4 12 L-4 12 Z" fill="#D9B24C" />
              <path d="M-6 0 Q-12 0 -10 6 L-6 4 Z" fill="#D9B24C" />
              <path d="M6 0 Q12 0 10 6 L6 4 Z" fill="#D9B24C" />
              <ellipse cx="0" cy="-2" rx="6" ry="2.4" fill="#F1D98A" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
