import type { AvatarFace } from "@/lib/avatarOptions";
import { shade } from "@/lib/avatarOptions";

/* Cartoon head drawn in the same 200-wide coordinate space as the original
   avatar (face centre x=100, crown y≈55, chin y≈154) so every garment,
   hat and accessory still lines up. */

const INK = "#1b130e";

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = (sh: number) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `#${((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1)}`;
}

function facePath(hw: number, jaw: number) {
  const top = 58, chin = 156;
  const jw = hw * (0.74 + jaw * 0.2);        // half-width at the jaw
  const cx = (d: number) => 100 + d;
  const R = [
    `M100 ${top}`,
    `C${cx(hw * 0.7)} ${top} ${cx(hw)} ${top + 22} ${cx(hw)} ${top + 48}`,
    `C${cx(hw)} ${top + 68} ${cx(jw + 2)} ${chin - 20} ${cx(jw * 0.6 + jaw * 8)} ${chin - 5}`,
    `Q${cx(jw * 0.25)} ${chin + 1} 100 ${chin + 1}`,
  ].join(" ");
  const L = [
    `Q${cx(-jw * 0.25)} ${chin + 1} ${cx(-(jw * 0.6 + jaw * 8))} ${chin - 5}`,
    `C${cx(-(jw + 2))} ${chin - 20} ${cx(-hw)} ${top + 68} ${cx(-hw)} ${top + 48}`,
    `C${cx(-hw)} ${top + 22} ${cx(-hw * 0.7)} ${top} 100 ${top} Z`,
  ].join(" ");
  return `${R} ${L}`;
}

function Eye({ x, flip, style, child, lashes, big }: { x: number; flip: 1 | -1; style: string; child: boolean; lashes?: boolean; big?: boolean }) {
  const y = big ? 112 : child ? 108 : 103;
  const rx = big ? 10 : child ? 8.6 : 7.8, ry = big ? 8 : child ? 6.4 : 5.4;
  const lid = style === "relaxed" ? 0.5 : style === "happy" ? 0.45 : 0.05;
  if (style === "laugh") {
    // eyes squeezed shut in a laugh: upward arcs with little lashes
    return (
      <g>
        <path d={`M${x - rx} ${y + 2} Q${x} ${y - 7} ${x + rx} ${y + 2}`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        {lashes && <path d={`M${x - flip * rx} ${y + 1.5} l${-flip * 2.4} -1.4`} stroke={INK} strokeWidth="1.2" strokeLinecap="round" fill="none" />}
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FBF7EE" stroke={INK} strokeOpacity="0.35" strokeWidth="0.6" />
      <circle cx={x + flip * -0.4} cy={y + 0.6} r={big ? 5.2 : child ? 3.9 : 3.5} fill="#2A1A10" />
      <circle cx={x + flip * -0.4} cy={y + 0.6} r={big ? 2.3 : 1.5} fill="#000" />
      <circle cx={x + flip * 1.4} cy={y - 1.6} r={big ? 1.8 : 1.1} fill="#fff" opacity="0.95" />
      {lashes && (
        <path d={`M${x - flip * rx} ${y - ry * 0.4} l${-flip * 2.6} -1.6 M${x - flip * rx * 0.85} ${y - ry * 0.8} l${-flip * 2.4} -2.4`} stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      )}
      {/* upper lid (skin coloured) gives the relaxed, half-lidded look */}
      <clipPath id={`eyeclip-${x}`}><ellipse cx={x} cy={y} rx={rx} ry={ry} /></clipPath>
      <rect x={x - rx - 1} y={y - ry - 1} width={rx * 2 + 2} height={(ry * 2 + 2) * lid} fill="var(--skin)" clipPath={`url(#eyeclip-${x})`} />
      <path d={`M${x - rx} ${y - ry * (1 - 2 * lid) + 0.2} Q${x} ${y - ry * (1 - 2 * lid) - 2.2} ${x + rx} ${y - ry * (1 - 2 * lid) + 0.2}`} fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

/** Hair that sits behind the head (volume, back of the cut). */
export function HairBack({ hair, color }: { hair: AvatarFace["hair"]; color: string }) {
  const dark = shade(color, -25);
  switch (hair) {
    case "messy-waves":
      return (
        <g fill={color}>
          <circle cx="62" cy="86" r="17" /><circle cx="76" cy="62" r="19" /><circle cx="100" cy="52" r="20" />
          <circle cx="126" cy="60" r="19" /><circle cx="141" cy="84" r="17" /><circle cx="56" cy="104" r="9" /><circle cx="146" cy="104" r="9" />
          <circle cx="88" cy="46" r="12" fill={dark} opacity="0.35" />
        </g>
      );
    case "side-sweep":
      return <path d="M54 108 C48 64 72 50 102 50 C132 50 154 64 148 108 Z" fill={color} />;
    case "bald-sides":
      return null;
    case "side-wave":
      return <path d="M52 112 C46 62 72 48 100 48 C130 48 154 62 148 112 Z" fill={color} />;
    case "full-bob":
      return (
        <g fill={color}>
          {/* thick, full bob that frames the face and curls under at the chin */}
          <path d="M44 120 C34 62 68 40 100 40 C134 40 166 62 156 120 C158 140 154 156 140 164 C122 170 78 170 60 164 C46 156 42 140 44 120 Z" />
          <circle cx="48" cy="150" r="11" /><circle cx="152" cy="150" r="11" /><circle cx="62" cy="162" r="10" /><circle cx="138" cy="162" r="10" />
        </g>
      );
    case "receding":
      return <path d="M54 112 C48 66 72 50 100 50 C130 50 154 66 148 112 Z" fill={color} />;
    case "wavy-fringe":
      return (
        <g fill={color}>
          <path d="M52 108 C44 62 70 44 100 44 C132 44 158 62 148 108 Z" />
          {[[66, 56], [84, 46], [104, 42], [124, 46], [140, 58], [56, 76], [148, 78]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="12" />)}
        </g>
      );
    case "tousled":
      return <path d="M52 108 C44 60 70 42 100 42 C132 42 158 60 148 108 Z" fill={color} />;
    case "toddler-curls":
      return (
        <g fill={color}>
          <circle cx="56" cy="110" r="15" /><circle cx="50" cy="132" r="13" /><circle cx="58" cy="152" r="12" />
          <circle cx="144" cy="110" r="15" /><circle cx="150" cy="132" r="13" /><circle cx="142" cy="152" r="12" />
          <path d="M52 108 C46 62 72 48 100 48 C130 48 156 62 148 108 Z" />
          <circle cx="100" cy="40" r="11" /><circle cx="90" cy="46" r="9" />
        </g>
      );
    case "straight-fringe":
      return <path d="M52 112 C44 66 70 50 100 50 C132 50 156 66 148 112 Z" fill={color} />;
    case "short-crop":
    case "curly-top":
      return <path d="M54 100 C50 62 74 50 100 50 C128 50 150 62 146 100 Z" fill={color} />;
    case "pulled-back":
      return (
        <g fill={color}>
          <path d="M52 112 C46 62 72 48 100 48 C130 48 154 62 148 112 Z" />
          {/* ponytail swept over one shoulder */}
          <path d="M56 100 C36 118 30 150 42 184 C52 190 62 184 62 176 C54 150 60 126 70 110 Z" />
        </g>
      );
    case "side-braid":
      return <path d="M52 112 C46 62 72 48 100 48 C130 48 154 62 148 112 Z" fill={color} />;
    case "long-straight":
      return <path d="M50 110 C44 60 70 48 100 48 C132 48 156 60 150 110 L152 196 L48 196 Z" fill={color} />;
    case "bob":
      return <path d="M50 110 C44 60 70 48 100 48 C132 48 156 60 150 110 L152 150 Q100 162 48 150 Z" fill={color} />;
    default:
      return null;
  }
}

/** Hair that sits over the forehead / temples. */
export function HairFront({ hair, color, texture = 0, streak, flowers }: { hair: AvatarFace["hair"]; color: string; texture?: number; streak?: string; flowers?: boolean }) {
  const hi = shade(color, 22);
  const dark = shade(color, -20);
  switch (hair) {
    case "straight-fringe":
      return (
        <g>
          {/* crown + side-swept fringe, longer on the left, sideburns over the temples */}
          <path d="M55 118 C47 66 72 49 101 49 C134 49 154 68 146 118 L142 118 C142 100 140 90 134 86 C122 80 108 80 96 86 C84 90 74 93 66 98 L60 118 Z" fill={color} />
          <path d="M96 86 C84 90 74 93 66 98" fill="none" stroke={hi} strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />
          <path d="M112 66 C100 70 86 74 74 82 M126 70 C116 72 104 74 94 78" fill="none" stroke={hi} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
          <path d="M60 104 L57 120 L63 118 Z M140 100 L144 120 L139 116 Z" fill={dark} />
          {texture > 0 && (
            <g>
              {/* choppy, layered ends along the fringe + extra strand lines */}
              <path d="M70 60 C82 56 94 55 104 56 M60 76 C72 66 86 62 98 62 M110 58 C122 58 134 62 140 72 M118 70 C128 70 136 76 140 86" fill="none" stroke={hi} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
              <path d="M84 70 C92 64 100 62 108 63 M126 64 C134 68 140 74 142 82" fill="none" stroke={dark} strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
              <path d="M54 92 l-5 4 l7 0 Z M146 90 l5 5 l-7 1 Z" fill={color} />
            </g>
          )}
        </g>
      );
    case "messy-waves":
      return (
        <g>
          <path d="M58 100 C52 70 70 54 100 54 C132 54 150 70 143 100 C140 90 137 84 130 80 C124 74 118 74 112 78 C106 70 98 72 94 78 C86 72 76 76 72 84 C66 86 62 92 58 100 Z" fill={color} />
          {/* loose curls spilling onto the forehead and temples */}
          <path d="M122 78 q8 3 7 11 q-5 -3 -8 -8 Z M62 92 q-4 6 -2 13 q4 -4 3 -11 Z" fill={color} />
          <path d="M72 66 q10 -10 22 -8 M104 60 q12 -4 24 4 M64 80 q4 -10 14 -14" fill="none" stroke={hi} strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
        </g>
      );
    case "short-crop":
      return <path d="M56 100 C52 64 76 52 101 52 C128 52 148 64 144 100 C138 80 124 72 100 72 C76 72 62 80 56 100 Z" fill={color} />;
    case "curly-top":
      return (
        <g fill={color}>
          <path d="M56 100 C52 64 76 52 101 52 C128 52 148 64 144 100 C138 80 124 74 100 74 C76 74 62 80 56 100 Z" />
          {[[66, 66], [82, 56], [100, 52], [118, 56], [134, 66]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" />)}
        </g>
      );
    case "side-sweep":
      return (
        <g>
          {/* neat side-swept top, cropped sides: lower over the right temple, clear on the left */}
          <path d="M57 104 C50 64 76 48 104 48 C134 48 156 64 148 104 L146 108 C144 96 140 90 132 87 C120 83 106 84 94 80 C84 77 74 79 67 86 C62 91 59 98 58 108 Z" fill={color} />
          <path d="M66 70 C84 56 112 54 134 64 M74 82 C92 66 118 64 140 80 M96 58 C112 56 128 60 142 72" fill="none" stroke={hi} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
          <path d="M57 104 C57 92 60 86 64 82 L62 108 Z" fill={dark} opacity="0.7" />
        </g>
      );
    case "bald-sides":
      return (
        <g fill={color}>
          {/* bald on top: just thin hair over each ear/temple */}
          <path d="M56 110 C53 92 56 82 62 78 C60 90 62 100 64 112 Z" />
          <path d="M144 110 C147 92 144 82 138 78 C140 90 138 100 136 112 Z" />
          <path d="M55 104 q-2 8 0 16 M145 104 q2 8 0 16" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "receding":
      return (
        <g fill={color}>
          {/* bald crown: only a thin band of hair at the top, thicker round the temples */}
          <path d="M54 114 C48 66 72 50 100 50 C130 50 154 66 148 114 C147 98 142 86 134 78 C124 68 112 64 100 64 C88 64 76 68 66 78 C58 86 53 98 54 114 Z" />
          <path d="M60 96 q-3 10 -2 20 M140 96 q3 10 2 20" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "wavy-fringe":
      return (
        <g fill={color}>
          {/* messy waves: volume on top, a wavy fringe falling across the forehead, loose sideburns */}
          <path d="M55 110 C48 66 72 48 102 48 C134 48 154 66 146 108 C144 94 140 84 134 78 C128 84 122 82 118 76 C112 84 104 82 100 76 C94 86 86 84 82 78 C76 86 68 86 64 82 C60 90 57 100 55 110 Z" />
          <path d="M66 82 q-8 6 -5 14 q6 -2 8 -10 Z M118 78 q8 5 6 12 q-6 -3 -8 -9 Z M140 84 q6 6 4 16 q-5 -5 -5 -14 Z" />
          <path d="M70 62 q12 -10 26 -8 M104 54 q14 -3 26 6 M64 76 q4 -10 14 -14 M120 68 q10 2 16 10" fill="none" stroke={shade(color, 28)} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    case "tousled":
      return (
        <g>
          {/* swept-up, tousled top; hairline recedes at the temples */}
          <path d="M56 102 C48 62 70 40 100 40 C132 40 156 60 146 102 C144 90 140 80 132 76 C126 70 120 66 114 66 C108 62 94 62 88 66 C78 68 72 76 68 82 C62 88 58 96 56 102 Z" fill={color} />
          <path d="M70 52 l-6 -9 l11 5 l1 -10 l8 8 l5 -11 l5 10 l9 -9 l2 11 l10 -6 l-2 11 l11 -2 l-6 9 Z" fill={color} />
          <path d="M66 58 C78 48 94 44 110 46 M84 56 C96 52 112 52 126 58 M110 52 C122 54 134 60 140 70" fill="none" stroke={shade(color, 28)} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
          {streak && <path d="M72 62 C86 50 100 48 112 50 M96 58 C108 56 120 60 130 66 M60 82 C66 72 74 66 84 62" fill="none" stroke={streak} strokeWidth="3.2" opacity="0.85" strokeLinecap="round" />}
          <path d="M56 102 C57 92 60 88 64 84 L61 108 Z M144 102 C143 92 140 88 136 84 L140 108 Z" fill={color} opacity="0.85" />
        </g>
      );
    case "toddler-curls":
      return (
        <g fill={color}>
          {/* full, centre-parted curls: dense crown, curls framing the face down past the ears */}
          <path d="M52 124 C42 64 70 44 100 44 C132 44 158 64 148 124 C146 104 142 92 134 84 C126 76 114 72 100 76 C86 72 74 76 66 84 C58 92 54 104 52 124 Z" />
          {[[58, 92], [64, 80], [74, 70], [88, 64], [112, 64], [126, 70], [136, 80], [142, 92], [52, 108], [148, 108], [52, 124], [148, 124]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i < 8 ? 9 : 8} />
          ))}
          <circle cx="100" cy="44" r="11" /><circle cx="110" cy="38" r="9" /><circle cx="90" cy="40" r="8" />
          <path d="M100 76 C98 66 98 58 100 50" fill="none" stroke={shade(color, 35)} strokeWidth="1.3" opacity="0.5" />
          <path d="M66 74 q8 -10 20 -10 M114 64 q12 0 20 10 M56 98 q-2 10 0 20 M144 98 q2 10 0 20" fill="none" stroke={shade(color, 30)} strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
        </g>
      );
    case "baby-wisps":
      return (
        <g>
          {/* a soft swirl of baby hair on top, a few wisps over the forehead and ears */}
          <path d="M70 70 C80 56 94 50 108 52 C124 54 134 62 134 70 C124 62 108 60 94 64 C84 66 76 68 70 70 Z" fill={color} />
          <path d="M100 54 C94 42 104 36 112 42 C118 46 112 52 106 50" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M82 66 C88 74 86 80 82 82 M112 62 C118 70 116 76 112 78 M124 66 C130 72 130 78 128 82" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
          <path d="M52 108 q-2 6 0 12 M148 108 q2 6 0 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </g>
      );
    case "full-bob":
      return (
        <g fill={color}>
          {/* side-swept fringe + thick sides covering the ears, flyaway wisps */}
          <path d="M50 134 C40 70 70 46 102 46 C136 46 162 70 150 134 C152 112 146 94 136 84 C122 90 100 86 84 78 C72 88 62 104 58 126 C56 130 52 134 50 134 Z" />
          <path d="M56 108 C54 126 56 138 62 148 L50 148 C44 134 46 118 56 108 Z M144 108 C146 126 144 138 138 148 L150 148 C156 134 154 118 144 108 Z" />
          <path d="M70 62 C84 52 106 50 126 58 M62 82 C70 70 82 64 92 62 M118 66 C130 68 140 76 144 88" fill="none" stroke={shade(color, 30)} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
          <path d="M60 70 q-8 -6 -10 -14 M146 68 q8 -8 12 -14 M52 100 q-8 4 -8 12" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    case "side-wave":
      return (
        <g fill={color}>
          <path d="M54 118 C46 66 72 49 100 49 C130 49 154 66 146 118 C146 98 140 82 130 76 C120 68 108 70 100 74 C92 70 80 68 70 76 C60 82 54 98 54 118 Z" />
          <path d="M100 74 C97 66 98 58 100 51" fill="none" stroke={shade(color, 30)} strokeWidth="1.2" opacity="0.5" />
          {/* long wavy lock falling over the shoulder on the left */}
          <path d="M56 106 C42 124 36 146 42 162 C48 176 40 186 46 196 L58 194 C52 184 60 174 54 160 C50 148 52 134 58 122 Z" />
          <path d="M48 128 C44 140 46 150 48 160 M50 168 C46 178 50 186 50 192" fill="none" stroke={shade(color, 30)} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
        </g>
      );
    case "parted-covered":
      return (
        <g fill={color}>
          <path d="M55 100 C54 78 76 62 100 62 C124 62 146 78 145 100 C141 86 124 74 100 75 C76 74 59 86 55 100 Z" />
          <path d="M100 63 L100 75" stroke={shade(color, 30)} strokeWidth="1.2" opacity="0.6" />
        </g>
      );
    case "covered":
      return <path d="M58 100 C58 80 76 70 100 70 C124 70 142 80 142 100 C138 86 122 78 100 78 C78 78 62 86 58 100 Z" fill={color} />;
    case "side-braid":
      return (
        <g>
          {/* centre-parted hair swept to the sides, soft wave at the temples */}
          <path d="M54 118 C46 66 72 49 100 49 C130 49 154 66 146 118 C146 98 140 82 130 76 C120 68 108 70 100 74 C92 70 80 68 70 76 C60 82 54 98 54 118 Z" fill={color} />
          <path d="M100 74 C97 66 98 58 100 51 M72 76 C80 64 90 57 98 53 M128 76 C120 64 110 57 102 53" fill="none" stroke={hi} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
          {/* braid over the shoulder */}
          <g fill={color} stroke={dark} strokeWidth="0.8">
            <path d="M142 120 C156 130 158 146 154 160 L144 158 C146 146 144 134 138 124 Z" />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={152 - i * 1.4} cy={158 + i * 8.5} rx="6.6" ry="5" transform={`rotate(${i % 2 ? 20 : -20} ${152 - i * 1.4} ${158 + i * 8.5})`} />
            ))}
          </g>
                  {flowers && (
            <g fill="#FFFFFF" stroke="#E3DFEA" strokeWidth="0.5">
              {[[142, 128], [150, 134], [146, 142], [154, 146], [148, 152], [156, 156], [150, 162], [144, 150], [152, 170], [146, 176]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.9} />)}
              {[[144, 132], [152, 140], [149, 158], [153, 166]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.1" fill="#F4C6D4" stroke="none" />)}
            </g>
          )}
</g>
      );
    case "pulled-back":
      return (
        <g>
          <path d="M55 116 C47 66 72 49 100 49 C130 49 153 66 145 116 C143 94 139 82 129 74 C119 68 108 69 100 72 C92 69 81 68 71 74 C61 82 57 96 55 116 Z" fill={color} />
          <path d="M100 72 C97 64 98 58 100 52" fill="none" stroke={shade(color, 30)} strokeWidth="1.2" opacity="0.5" />
          <path d="M72 80 C80 66 90 58 98 54 M128 80 C120 66 110 58 102 54" fill="none" stroke={hi} strokeWidth="1.2" opacity="0.35" />
          <path d="M60 100 q-3 8 -1 16 M142 100 q3 8 1 16" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "long-straight":
    case "bob":
      return <path d="M54 118 C46 66 72 50 100 50 C130 50 154 66 146 118 C144 96 136 84 126 78 C112 86 88 86 74 78 C64 86 56 98 54 118 Z" fill={color} />;
    default:
      return null;
  }
}

function FacialHair({ kind, color, faceD, clipId }: { kind: AvatarFace["facialHair"]; color: string; faceD: string; clipId: string }) {
  if (kind === "none") return null;
  const moustache = (
    <path d="M87 128.5 Q93 124.5 100 127 Q107 124.5 113 128.5 Q107 127 100 128.6 Q93 127 87 128.5 Z" fill={color} opacity="0.95" />
  );
  return (
    <g>
      <clipPath id={clipId}><path d={faceD} /></clipPath>
      {kind === "stubble" && (
        <g clipPath={`url(#${clipId})`}>
          <path d="M58 118 C60 142 78 156 100 157 C122 156 140 142 142 118 C130 130 118 132 100 132 C82 132 70 130 58 118 Z" fill={color} opacity="0.09" />
          <path d="M86 128 Q100 123.5 114 128 Q100 127 86 128 Z" fill={color} opacity="0.3" />
          {Array.from({ length: 70 }).map((_, i) => {
            const a = (i * 137.5) % 360, r = 8 + ((i * 53) % 34);
            const x = 100 + Math.cos((a * Math.PI) / 180) * r * 1.4, y = 140 + Math.abs(Math.sin((a * Math.PI) / 180)) * r * 0.45;
            return <circle key={i} cx={x} cy={y} r="0.8" fill={color} opacity="0.55" />;
          })}
        </g>
      )}
      {(kind === "moustache" || kind === "goatee-moustache") && moustache}
      {(kind === "goatee" || kind === "goatee-moustache") && (
        <g clipPath={`url(#${clipId})`}>
          <path d="M91 139 Q100 135 109 139 Q112 148 106 157 L94 157 Q88 148 91 139 Z" fill={color} />
          <path d="M60 118 C64 140 80 156 100 157 C120 156 136 140 140 118 C132 124 118 128 100 127 C82 128 68 124 60 118 Z" fill={color} opacity="0.10" />
        </g>
      )}
      {(kind === "full-beard" || kind === "long-beard" || kind === "trimmed-beard") && (
        <g clipPath={`url(#${clipId})`}>
          {/* sideburns blend into the hair, cheek line curves down to the moustache, full chin */}
          {(kind === "long-beard" || kind === "trimmed-beard") ? (
            <>
              {/* beard follows the jaw; cheeks above stay mostly clean with light stubble */}
              <path d={kind === "trimmed-beard" ? "M52 102 C54 116 62 126 76 131 C86 134 94 131 100 133 C106 131 114 134 124 131 C138 126 146 116 148 102 L154 102 L154 170 Q100 172 46 170 L46 102 Z" : "M52 104 C54 124 64 136 80 140 C88 142 94 138 100 140 C106 138 112 142 120 140 C136 136 146 124 148 104 L154 104 L154 180 L46 180 L46 104 Z"} fill={color} fillOpacity={kind === "trimmed-beard" ? 0.92 : 1} />
              {kind === "long-beard" && <path d="M56 104 C58 120 66 130 78 134 C66 126 60 116 58 104 Z M144 104 C142 120 134 130 122 134 C134 126 140 116 142 104 Z" fill={color} opacity="0.75" />}
              {[[68, 124], [74, 130], [80, 128], [126, 128], [132, 130], [120, 130], [64, 116], [136, 116], [86, 134], [114, 134]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" fill={kind === "trimmed-beard" && i % 3 === 0 ? "#9A9A9E" : shade(color, -25)} opacity="0.7" />)}
              {kind === "long-beard" && <path d="M62 150 C70 160 82 164 100 164 C118 164 130 160 138 150" fill="none" stroke={shade(color, -25)} strokeWidth="1" opacity="0.4" />}
            </>
          ) : (
            <path d="M54 104 C54 112 58 118 66 122 C76 127 86 125 92 124 L108 124 C114 125 124 127 134 122 C142 118 146 112 146 104 L152 104 L152 178 L48 178 L48 104 Z" fill={color} />
          )}
          {kind === "full-beard" && <ellipse cx="100" cy="135" rx="11" ry="4.2" fill="#9A5E52" />}
          <path d="M58 112 C60 140 78 160 100 163 C122 160 140 140 142 112" fill="none" stroke={shade(color, 30)} strokeWidth="1.3" opacity="0.3" />
          <path d="M70 140 C80 150 90 154 100 154 M130 140 C120 150 110 154 100 154" fill="none" stroke={shade(color, 30)} strokeWidth="1" opacity="0.3" />
        </g>
      )}
      {kind === "bushy-beard" && (
        <g>
          {/* wide, full beard: salt-and-pepper grey on the cheeks and sideburns, dark through the chin, hanging past the jaw */}
          <path d="M50 98 C44 128 50 160 72 178 C86 188 114 188 128 178 C150 160 156 128 150 98 C147 114 141 124 132 128 C122 132 112 129 100 130 C88 129 78 132 68 128 C59 124 53 114 50 98 Z" fill="#B4B5B9" />
          <path d="M60 128 C58 150 64 168 80 180 C70 160 66 144 66 132 Z M140 128 C142 150 136 168 120 180 C130 160 134 144 134 132 Z" fill="#C9CACD" />
          {/* dark core: under the lip and through the chin, ragged edges blending into the grey */}
          <path d="M74 138 C80 130 90 132 100 134 C110 132 120 130 126 138 C132 152 128 172 118 182 C110 188 90 188 82 182 C72 172 68 152 74 138 Z" fill="#26211f" />
          <path d="M64 136 C68 128 74 132 76 140 C72 150 72 160 76 170 C68 164 62 150 64 136 Z M136 136 C132 128 126 132 124 140 C128 150 128 160 124 170 C132 164 138 150 136 136 Z" fill="#3a3532" opacity="0.8" />
          {/* irregular grey/white strands through the dark chin + dark flecks in the grey cheeks */}
          <path d="M84 150 q2 8 -1 14 M94 146 q3 10 0 20 M108 148 q-2 10 1 18 M118 152 q-3 8 -1 14 M90 168 q2 6 5 10 M106 170 q-1 6 -4 10 M80 138 q-3 6 -2 10 M122 140 q3 6 2 10" fill="none" stroke="#E4E5E8" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
          <path d="M62 112 q3 6 1 14 M70 120 q3 6 2 12 M138 112 q-3 6 -1 14 M130 120 q-3 6 -2 12 M58 126 q2 8 0 16 M142 126 q-2 8 0 16" fill="none" stroke="#6E6F74" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />
          <ellipse cx="100" cy="135.5" rx="12" ry="4.6" fill="#9E6154" />
        </g>
      )}
      {kind === "long-beard" && (
        <g>
          <path d="M64 146 C64 168 84 186 100 190 C116 186 136 168 136 146 C126 160 114 164 100 164 C86 164 74 160 64 146 Z" fill={color} />
          <path d="M86 166 C88 176 94 184 100 187 M114 166 C112 176 106 184 100 187 M100 166 L100 188" fill="none" stroke={shade(color, -22)} strokeWidth="1.1" opacity="0.5" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export default function CartoonHead({ face, age, idBase }: { face: AvatarFace; age?: number; idBase: number }) {
  const baby = !!face.baby;
  const child = baby || !!face.childLike || (age != null && age < 13);
  const teen = age != null && age >= 13 && age < 19;
  const hw = baby ? 51 * (face.faceWidth ?? 1) : (child ? 46 : 43) * (face.faceWidth ?? 1) + (child ? 2 : 0);
  const jaw = Math.max(0, Math.min(1, (face.jaw ?? 0.4) * (child ? 0.3 : 1)));
  const d = facePath(hw, jaw);
  const skin = face.skin;
  const skinHi = shade(skin, 14), skinLo = shade(skin, -14);
  const grey = age != null && age > 40 ? Math.min(0.92, (age - 40) / 32) : 0;
  const hairColor = mix(face.hairColor, "#C9CCD2", grey);
  const brow = face.brow ?? 1;
  const arch = face.browArch ?? 0.3;
  const nose = face.nose ?? 1;
  const ear = face.earSize ?? 1;
  const eyeStyle = face.eyes ?? "relaxed";
  const mouth = face.mouth ?? "smirk";
  const lineAge = face.wrinkles != null ? face.wrinkles : age != null && age >= 48 ? Math.min(1, (age - 48) / 25) : 0;
  const eyeY = baby ? 112 : child ? 108 : 103;
  const browY = eyeY - 11 - (eyeStyle === "relaxed" ? 0 : 1);
  const hairKind = face.hair;

  return (
    <g style={{ ["--skin" as any]: skin }}>
      <defs>
        <radialGradient id={`cs-${idBase}`} cx="42%" cy="36%" r="78%">
          <stop offset="0%" stopColor={skinHi} /><stop offset="75%" stopColor={skin} /><stop offset="100%" stopColor={shade(skin, -7)} />
        </radialGradient>
      </defs>

      {face.headCover === "dupatta" && (
        <g>
          <path d="M44 124 C34 52 70 36 100 36 C132 36 166 52 156 124 L172 200 L28 200 Z" fill={face.headCoverColor || "#F6F1E6"} stroke={shade(face.headCoverColor || "#F6F1E6", -8)} strokeWidth="1.2" />
          <path d="M44 124 C34 52 70 36 100 36 C132 36 166 52 156 124" fill="none" stroke={face.headCoverTrim || "#D4AF5A"} strokeWidth={face.headCoverTrim ? 5 : 3} strokeLinecap="round" />
          {[[70, 48], [90, 42], [112, 42], [132, 50], [50, 80], [150, 80], [44, 108], [156, 108]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.3" fill="#D4AF5A" />)}
        </g>
      )}
      {face.headCover === "hijab" && (
        <path d="M40 204 C34 100 46 40 100 38 C154 40 166 100 160 204 Z" fill={shade(face.headCoverColor || "#C8A0C4", -8)} />
      )}
      <HairBack hair={hairKind} color={hairColor} />

      {/* neck + ears */}
      <path d="M86 138 L86 166 Q100 174 114 166 L114 138 Z" fill={skinLo} />
      <path d="M86 150 Q100 160 114 150 L114 138 L86 138 Z" fill={INK} opacity="0.10" />
      {([-1, 1] as const).map((s) => (
        <g key={s}>
          <ellipse cx={100 + s * (hw + 1)} cy="110" rx={5.5 * ear} ry={9.5 * ear} fill={skin} stroke={skinLo} strokeWidth="1" />
          <path d={`M${100 + s * (hw + 1)} 105 q${s * 2} 5 0 10`} fill="none" stroke={skinLo} strokeWidth="1.2" />
          {face.earring && <circle cx={100 + s * (hw + 1)} cy={120 * 1} r="2.3" fill="#E3B84A" stroke="#8A6A1E" strokeWidth="0.6" />}
        </g>
      ))}

      <path d={d} fill={`url(#cs-${idBase})`} stroke={skinLo} strokeWidth="1.2" />
      {/* cheek warmth */}
      <ellipse cx={100 - hw * 0.55} cy="120" rx="9" ry="5.5" fill="#E58D74" opacity="0.18" />
      <ellipse cx={100 + hw * 0.55} cy="120" rx="9" ry="5.5" fill="#E58D74" opacity="0.18" />

      <FacialHair kind={face.facialHair} color={face.beardColor || mix(face.hairColor, "#A8ABB2", grey * 0.9)} faceD={d} clipId={`fh-${idBase}`} />

      {/* eyes */}
      <Eye x={100 - 17.5} flip={1} style={eyeStyle} child={child} lashes={face.lashes} big={baby} />
      <Eye x={100 + 17.5} flip={-1} style={eyeStyle} child={child} lashes={face.lashes} big={baby} />
      {/* bags / tired lines on relaxed eyes */}
      {!child && !teen && <path d={`M${100 - 24} ${eyeY + 8} q7 3.5 14 0 M${100 + 10} ${eyeY + 8} q7 3.5 14 0`} fill="none" stroke={skinLo} strokeWidth="1" opacity="0.5" strokeLinecap="round" />}

      {/* brows */}
      <path d={`M${100 - 27} ${browY + 2.4 - arch * 1} Q${100 - 19} ${browY - 2.6 - arch * 4} ${100 - 9} ${browY + 0.8}`} fill="none" stroke={mix(face.hairColor, "#C9CCD2", grey)} strokeWidth={2.2 * brow} strokeLinecap="round" />
      <path d={`M${100 + 9} ${browY + 0.8} Q${100 + 19} ${browY - 2.6 - arch * 4} ${100 + 27} ${browY + 2.4 - arch * 1}`} fill="none" stroke={mix(face.hairColor, "#C9CCD2", grey)} strokeWidth={2.2 * brow} strokeLinecap="round" />

      {baby ? (
        <g>
          <ellipse cx="100" cy={eyeY + 12} rx="3.2" ry="2.2" fill={skinLo} opacity="0.85" />
          <ellipse cx="98.6" cy={eyeY + 11.4} rx="1" ry="0.7" fill="#fff" opacity="0.45" />
        </g>
      ) : null}
      {/* nose */}
      {!baby && (
        <g>
          <path d={`M100 ${eyeY + 2} Q${100 - 3.5 * nose} ${eyeY + 14} ${100 - 5.5 * nose} ${eyeY + 20} Q100 ${eyeY + 24.5 * nose} ${100 + 5.5 * nose} ${eyeY + 20}`} fill="none" stroke={skinLo} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={100 - 4.2 * nose} cy={eyeY + 21} rx="1.6" ry="1" fill={INK} opacity="0.35" />
          <ellipse cx={100 + 4.2 * nose} cy={eyeY + 21} rx="1.6" ry="1" fill={INK} opacity="0.35" />
        </g>
      )}

      {/* mouth */}
      {!baby && mouth === "smirk" && (
        <g>
          <path d="M88 133 Q96 137.5 106 134 Q112 131.5 115 128.5" fill="none" stroke={INK} strokeOpacity="0.75" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M92 134.5 Q101 140 111 133.6 Q101 137 92 134.5 Z" fill={face.lipColor || "#C0705E"} opacity={face.lipColor ? 0.95 : 0.55} />
        </g>
      )}
      {baby && (
        <g>
          <path d="M87 134 Q100 150 113 134 Q100 138 87 134 Z" fill="#7A3A34" stroke={INK} strokeOpacity="0.55" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M93 139 Q100 144 107 139" fill="none" stroke="#E98E88" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </g>
      )}
      {!baby && mouth === "smile" && (
        <g>
          <path d="M86 131 Q100 144 114 131" fill="#6A2A24" stroke={INK} strokeOpacity="0.7" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M89 133 Q100 139 111 133 Q100 135.5 89 133 Z" fill="#fff" opacity="0.9" />
        </g>
      )}
      {!baby && mouth === "grin" && (
        <g>
          <path d="M84 129 Q100 148 116 129 Z" fill="#6A2A24" stroke={(face.facialHair === "full-beard" || face.facialHair === "long-beard" || face.facialHair === "trimmed-beard") ? "#A8685A" : INK} strokeOpacity={(face.facialHair === "full-beard" || face.facialHair === "long-beard" || face.facialHair === "trimmed-beard") ? 1 : 0.7} strokeWidth={(face.facialHair === "full-beard" || face.facialHair === "long-beard" || face.facialHair === "trimmed-beard") ? 2.6 : 1.6} strokeLinejoin="round" />
          <path d="M88 130.5 Q100 134 112 130.5 L110 135 Q100 138 90 135 Z" fill="#fff" />
        </g>
      )}
      {!baby && mouth === "neutral" && <path d="M90 134 Q100 136 110 134" fill="none" stroke={INK} strokeOpacity="0.75" strokeWidth="1.8" strokeLinecap="round" />}

      {(face.facialHair === "full-beard" || face.facialHair === "long-beard" || face.facialHair === "trimmed-beard" || face.facialHair === "bushy-beard") && (
        <g>
          {/* thick moustache sits over the upper lip, in front of the mouth */}
          <path d="M82 129 C86 121 94 120 100 124 C106 120 114 121 118 129 C112 126 106 126 100 127.5 C94 126 88 126 82 129 Z" fill={face.facialHair === "bushy-beard" ? "#1c1816" : (face.beardColor || mix(face.hairColor, "#A8ABB2", grey * 0.9))} />
        </g>
      )}

      {/* age lines */}
      {lineAge > 0 && (
        <g fill="none" stroke={skinLo} strokeWidth="1.1" strokeLinecap="round" opacity={0.35 + lineAge * 0.4}>
          <path d="M78 76 Q100 71 122 76" /><path d="M82 82 Q100 78.5 118 82" />
          <path d="M72 100 q-4 2 -4 6 M128 100 q4 2 4 6" />
          <path d="M84 123 q-2 6 0 11 M116 123 q2 6 0 11" />
        </g>
      )}

      {face.mole && (
        <g>
          <circle cx={100 + face.mole.x} cy={face.mole.y} r="2.3" fill="#FFFDF6" stroke={skinLo} strokeWidth="0.6" />
          <circle cx={100 + face.mole.x - 0.6} cy={face.mole.y - 0.7} r="0.7" fill="#fff" />
        </g>
      )}

      <HairFront hair={hairKind} color={hairColor} texture={face.hairTexture} streak={face.hairStreak} flowers={face.hairFlowers} />

      {face.tikka && (
        <g>
          <path d="M100 52 L100 77" stroke="#D9B24C" strokeWidth="1.3" />
          <path d="M78 74 Q90 68 100 76 Q110 68 122 74" fill="none" stroke="#D9B24C" strokeWidth="1.1" opacity="0.9" />
          <circle cx="100" cy="80" r="3" fill="#D9B24C" stroke="#8A6A1E" strokeWidth="0.6" /><circle cx="100" cy="80" r="1" fill="#F3E3A5" />
        </g>
      )}

      

      {face.headCover === "hijab" && (() => {
        const c = face.headCoverColor || "#C8A0C4";
        return (
          <g>
            <path fillRule="evenodd" d={`M36 206 C30 98 44 36 100 34 C156 36 170 98 164 206 Z M54 112 C52 80 74 65 100 65 C126 65 148 80 146 112 C146 144 126 161 100 161 C74 161 54 144 54 112 Z`} fill={c} />
            <path d="M54 112 C52 80 74 65 100 65 C126 65 148 80 146 112" fill="none" stroke={shade(c, -22)} strokeWidth="1.6" opacity="0.7" />
            <path d="M40 150 C44 170 54 186 62 200 M160 150 C156 170 146 186 138 200 M56 56 C50 80 48 100 50 130" fill="none" stroke={shade(c, -14)} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
            <path d="M70 44 C86 38 114 38 130 44" fill="none" stroke={shade(c, 20)} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          </g>
        );
      })()}

      {face.bow && (
        <g transform="translate(126 62) rotate(18)">
          <path d="M0 0 C-12 -10 -22 -4 -20 6 C-18 14 -8 10 0 2 Z" fill={face.bow} stroke={shade(face.bow, -22)} strokeWidth="0.8" />
          <path d="M0 0 C12 -10 22 -4 20 6 C18 14 8 10 0 2 Z" fill={face.bow} stroke={shade(face.bow, -22)} strokeWidth="0.8" />
          <circle cx="0" cy="1.5" r="3.4" fill={shade(face.bow, -12)} />
        </g>
      )}

      {face.headCover === "topi" && (
        <g>
          <path d="M57 90 C54 56 76 40 100 40 C124 40 146 56 143 90 C130 82 116 80 100 80 C84 80 70 82 57 90 Z" fill="#F4EFE0" stroke="#D9CFB4" strokeWidth="1" />
          <path d="M56 80 C70 72 86 70 100 70 C114 70 130 72 144 80 L143 90 C130 82 116 80 100 80 C84 80 70 82 57 90 Z" fill="#C9A24A" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M${60 + i * 10} ${86 - Math.abs(i - 4) * 0.3} l5 -6 l5 6 l-5 4 Z`} fill="#F4EFE0" opacity="0.85" />)}
          <path d="M60 52 C74 44 90 42 100 42" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        </g>
      )}

      {face.glasses === "cat-eye" && (
        <g fill={face.glassesTint || "rgba(255,255,255,0.12)"} stroke={face.glassesColor || "#E7DCEB"} strokeWidth="2.4" strokeLinejoin="round">
          <path d={`M64 ${eyeY - 10} Q70 ${eyeY - 12} 83 ${eyeY - 10} Q98 ${eyeY - 9} 99 ${eyeY + 1} Q98 ${eyeY + 14} 83 ${eyeY + 13} Q66 ${eyeY + 11} 64 ${eyeY - 10} Z`} />
          <path d={`M136 ${eyeY - 10} Q130 ${eyeY - 12} 117 ${eyeY - 10} Q102 ${eyeY - 9} 101 ${eyeY + 1} Q102 ${eyeY + 14} 117 ${eyeY + 13} Q134 ${eyeY + 11} 136 ${eyeY - 10} Z`} />
          <path d="M98 100 Q100 98 102 100" fill="none" />
        </g>
      )}
      {face.glasses === "wayfarer" && (
        <g fill="rgba(255,255,255,0.08)" stroke="#0E0E10" strokeWidth="4" strokeLinejoin="round">
          <path d={`M66 ${eyeY - 9} L95 ${eyeY - 9} Q99 ${eyeY - 9} 99 ${eyeY - 4} L99 ${eyeY + 5} Q98 ${eyeY + 12} 90 ${eyeY + 12} L74 ${eyeY + 12} Q66 ${eyeY + 11} 66 ${eyeY + 3} Z`} />
          <path d={`M134 ${eyeY - 9} L105 ${eyeY - 9} Q101 ${eyeY - 9} 101 ${eyeY - 4} L101 ${eyeY + 5} Q102 ${eyeY + 12} 110 ${eyeY + 12} L126 ${eyeY + 12} Q134 ${eyeY + 11} 134 ${eyeY + 3} Z`} />
          <path d={`M66 ${eyeY - 6} L56 ${eyeY - 8} M134 ${eyeY - 6} L144 ${eyeY - 8}`} />
        </g>
      )}
      {face.glasses && face.glasses !== "none" && face.glasses !== "cat-eye" && face.glasses !== "wayfarer" && (
        <g fill={face.glassesTint || "none"} stroke={face.glassesColor || "#1C1C20"} strokeWidth="2">
          {face.glasses === "round" ? (<><circle cx="82.5" cy={eyeY} r="10.5" /><circle cx="117.5" cy={eyeY} r="10.5" /></>) : (<><rect x="71" y={eyeY - 8} width="22" height="16" rx="4" /><rect x="107" y={eyeY - 8} width="22" height="16" rx="4" /></>)}
          <path d="M93 102 Q100 99 107 102" fill="none" />
          <path d={`M72 ${eyeY - 2} L${100 - hw - 2} ${eyeY - 3} M128 ${eyeY - 2} L${100 + hw + 2} ${eyeY - 3}`} fill="none" strokeWidth="1.4" />
        </g>
      )}
    </g>
  );
}
