import { shade } from "@/lib/avatarOptions";

export function renderTop(top: string, color: string, linenId: string) {
  const dark = shade(color, -22);
  switch (top) {
    case "tank":
      return <path d="M42 214 L52 168 Q100 156 148 168 L158 214 Z" fill={color} />;
    case "blazer":
      return (
        <>
          <path d="M32 214 L44 162 Q100 144 156 162 L168 214 Z" fill={color} />
          <path d="M88 164 L100 182 L94 208 L80 172 Z" fill={dark} opacity="0.85" />
          <path d="M112 164 L100 182 L106 208 L120 172 Z" fill={dark} opacity="0.85" />
          {[0, 1, 2].map((i) => <circle key={i} cx="100" cy={185 + i * 12} r="1.6" fill="#D9D5C8" />)}
        </>
      );
    case "shirt-jacket":
      return (
        <>
          <path d="M35 214 L46 165 Q100 146 154 165 L165 214 Z" fill="#EFEAE0" />
          <path d="M40 214 L48 172 Q78 158 100 158 L96 214 Z" fill={color} />
          <path d="M160 214 L152 172 Q122 158 100 158 L104 214 Z" fill={color} />
        </>
      );
    case "kurta":
      return (
        <>
          <path d="M30 214 L42 160 Q100 140 158 160 L170 214 Z" fill={color} />
          <path d="M30 214 L42 160 Q100 140 158 160 L170 214 Z" fill={`url(#${linenId})`} opacity="0.4" />
          <path d="M84 162 Q100 155 116 162 L112 172 Q100 168 88 172 Z" fill={dark} opacity="0.75" />
        </>
      );
    case "tshirt":
    default:
      return (
        <>
          <path d="M38 214 L48 168 Q100 150 152 168 L162 214 Z" fill={color} />
          <path d="M38 214 L48 168 Q40 172 34 186 L44 192 Z" fill={color} />
          <path d="M162 214 L152 168 Q160 172 166 186 L156 192 Z" fill={color} />
        </>
      );
  }
}

export function renderBottom(bottom: string, color: string, skin: string, denimId: string, linenId: string) {
  switch (bottom) {
    case "shorts":
      return (
        <>
          <path d="M62 214 L60 242 L80 242 L84 216 L100 216 L106 242 L126 242 L124 214 Z" fill={color} />
          <rect x="72" y="242" width="12" height="42" fill={skin} />
          <rect x="118" y="242" width="12" height="42" fill={skin} />
        </>
      );
    case "skirt":
      return <path d="M66 214 L54 258 L146 258 L134 214 Z" fill={color} />;
    case "sari":
      return (
        <>
          <path d="M64 214 L54 280 L146 280 L136 214 Z" fill={color} />
          <path d="M78 214 L60 170 L74 164 L96 214 Z" fill={color} opacity="0.92" />
          <path d="M54 280 L146 280" stroke="#D9B24C" strokeWidth="2" strokeOpacity="0.6" />
        </>
      );
    case "rida":
      return (
        <>
          <path d="M58 214 L48 282 L152 282 L142 214 Z" fill={color} />
          <path d="M58 214 L48 282" stroke="#D9B24C" strokeWidth="1.4" strokeOpacity="0.55" />
          <path d="M142 214 L152 282" stroke="#D9B24C" strokeWidth="1.4" strokeOpacity="0.55" />
        </>
      );
    case "denim":
      return (
        <>
          <path d="M60 214 L58 278 L80 278 L86 220 L100 220 L106 278 L128 278 L126 214 Z" fill={color} />
          <path d="M60 214 L58 278 L80 278 L86 220 L100 220 L106 278 L128 278 L126 214 Z" fill={`url(#${denimId})`} opacity="0.5" />
        </>
      );
    case "linen-slacks":
      return (
        <>
          <path d="M60 214 L58 278 L80 278 L86 220 L100 220 L106 278 L128 278 L126 214 Z" fill={color} />
          <path d="M60 214 L58 278 L80 278 L86 220 L100 220 L106 278 L128 278 L126 214 Z" fill={`url(#${linenId})`} opacity="0.4" />
        </>
      );
    case "trousers":
    default:
      return <path d="M60 214 L58 278 L80 278 L86 220 L100 220 L106 278 L128 278 L126 214 Z" fill={color} />;
  }
}
