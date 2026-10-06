export function renderHairBack(hair: string, hairHex: string) {
  switch (hair) {
    case "long-straight":
      return (
        <>
          <path d="M56 146 Q48 178 56 208 Q62 212 70 208 Q64 176 68 148 Z" fill={hairHex} />
          <path d="M144 146 Q152 178 144 208 Q138 212 130 208 Q136 176 132 148 Z" fill={hairHex} />
        </>
      );
    case "textured-waves":
      return (
        <>
          <path d="M54 144 Q40 176 56 210 Q64 215 72 209 Q60 178 66 146 Z" fill={hairHex} />
          <path d="M146 144 Q160 176 144 210 Q136 215 128 209 Q140 178 134 146 Z" fill={hairHex} />
        </>
      );
    case "middle-part-long":
      return (
        <>
          <path d="M58 148 Q52 172 58 194 Q64 197 70 193 Q66 172 70 150 Z" fill={hairHex} />
          <path d="M142 148 Q148 172 142 194 Q136 197 130 193 Q134 172 130 150 Z" fill={hairHex} />
        </>
      );
    case "mullet":
      return <path d="M86 90 Q80 116 90 138 Q100 142 110 138 Q120 116 114 90 Z" fill={hairHex} />;
    default:
      return null;
  }
}

export function renderHairFront(hair: string, hairHex: string, netId: string, fadeId: string) {
  switch (hair) {
    case "simple-short":
      return <path d="M54 96 Q56 58 100 49 Q144 58 146 96 Q140 66 100 57 Q60 66 54 96 Z" fill={hairHex} />;
    case "simple-medium":
      return <path d="M52 94 Q58 52 100 49 Q142 52 148 94 Q128 64 100 60 Q74 66 52 94 Z" fill={hairHex} />;
    case "middle-part":
      return (
        <>
          <path d="M54 96 Q56 58 100 49 Q144 58 146 96 Q140 66 100 57 Q60 66 54 96 Z" fill={hairHex} />
          <path d="M100 49 L100 82" stroke="#161311" strokeOpacity="0.3" strokeWidth="1" />
        </>
      );
    case "middle-part-long":
      return (
        <>
          <path d="M54 96 Q56 58 100 49 Q144 58 146 96 Q140 66 100 57 Q60 66 54 96 Z" fill={hairHex} />
          <path d="M100 49 L100 86" stroke="#161311" strokeOpacity="0.25" strokeWidth="1" />
        </>
      );
    case "textured-fringe":
      return (
        <>
          <path d="M54 96 Q56 58 100 49 Q144 58 146 96 Q140 66 100 57 Q60 66 54 96 Z" fill={hairHex} />
          <path d="M62 78 L68 92 M74 72 L78 88 M86 68 L88 86 M100 66 L100 86 M114 68 L112 86 M126 72 L122 88 M138 78 L132 92" stroke="#161311" strokeOpacity="0.22" strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "bowl-cut":
      return <path d="M54 92 Q56 56 100 52 Q144 56 146 92 Q146 100 136 100 L64 100 Q54 100 54 92 Z" fill={hairHex} />;
    case "curly":
    case "layered-curls":
      return (
        <>
          <path d="M60 90 Q62 60 100 54 Q138 60 140 90 Q136 70 100 66 Q64 70 60 90 Z" fill={hairHex} opacity="0.92" />
          <g fill={hairHex}>
            <circle cx="64" cy="70" r="11.5" /><circle cx="80" cy="55" r="12.5" />
            <circle cx="100" cy="49" r="13.5" /><circle cx="120" cy="55" r="12.5" />
            <circle cx="136" cy="70" r="11.5" /><circle cx="100" cy="63" r="17" />
          </g>
        </>
      );
    case "textured-waves":
      return <path d="M52 94 Q48 128 60 148 Q64 58 100 51 Q136 58 140 148 Q152 128 148 94 Q142 56 100 47 Q58 56 52 94 Z" fill={hairHex} />;
    case "long-straight":
      return <path d="M54 96 Q52 128 60 148 Q100 52 140 148 Q148 128 146 96 Q142 60 100 51 Q58 60 54 96 Z" fill={hairHex} />;
    case "sleek-bob":
      return <path d="M54 94 Q56 56 100 50 Q144 56 146 94 Q148 122 136 132 Q140 100 100 92 Q60 100 64 132 Q52 122 54 94 Z" fill={hairHex} />;
    case "chignon-bun":
      return (
        <>
          <path d="M54 96 Q58 58 100 53 Q142 58 146 96 Q138 68 100 60 Q62 68 54 96 Z" fill={hairHex} />
          <circle cx="100" cy="44" r="12.5" fill="none" stroke={hairHex} strokeWidth="3.6" />
          <circle cx="100" cy="44" r="6.5" fill="none" stroke={hairHex} strokeWidth="2.6" />
        </>
      );
    case "bun":
      return (
        <>
          <path d="M54 96 Q58 58 100 53 Q142 58 146 96 Q138 68 100 60 Q62 68 54 96 Z" fill={hairHex} />
          <circle cx="100" cy="45" r="13.5" fill={hairHex} />
        </>
      );
    case "mullet":
      return <path d="M54 96 Q56 58 100 49 Q144 58 146 96 Q140 66 100 57 Q60 66 54 96 Z" fill={hairHex} />;
    case "hijab-rida":
      return (
        <g>
          <path d="M42 132 Q36 58 100 42 Q164 58 158 132 Q154 92 132 78 L128 150 L72 150 L68 78 Q46 92 42 132" fill="#2F6B6B" opacity="0.92" />
          <path d="M74 92 Q100 100 126 92" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1.4" />
          <path d="M70 108 Q100 116 130 108" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1.4" />
        </g>
      );
    default:
      return null;
  }
}
