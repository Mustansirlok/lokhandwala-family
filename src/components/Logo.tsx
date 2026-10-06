import React from "react";

/** Original family crest: crescent moon, bats and a single drop - a dark-romantic nod, not any show's logo. */
export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Lokhandwala family crest" style={{ display: "block", flexShrink: 0 }}>
      <defs>
          <radialGradient id="lk-bg" cx="50%" cy="30%" r="80%">
            <stop offset="0" stopColor="#4a1020"/>
            <stop offset="1" stopColor="#0c0508"/>
          </radialGradient>
          <linearGradient id="lk-moon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf1e4"/>
            <stop offset="1" stopColor="#c9a98f"/>
          </linearGradient>
          <mask id="lk-cres">
            <rect width="64" height="64" fill="#fff"/>
            <circle cx="40" cy="25" r="14.5" fill="#000"/>
          </mask>
        </defs>
        <rect width="64" height="64" rx="15" fill="url(#lk-bg)"/>
        <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="#e9d3bd" strokeOpacity=".22" strokeWidth="1.2"/>
        <circle cx="31" cy="29" r="17.5" fill="url(#lk-moon)" mask="url(#lk-cres)"/>
        <g fill="#d23a58" transform="translate(44 19) scale(.9)">
          <path id="lk-bat" d="M0-2.5 1.2-4.6 2.2-2.6C5-3.6 8.5-4.6 12-6.2 11-3.8 10.8-2.2 11 0 9.6-1.2 8.4-1.4 7.4-.4 6.4-1.8 5-1.8 4-.2 3-1 2-.6 1.4 1.2L0 3.2Z"/>
          <use href="#lk-bat" transform="scale(-1 1)"/>
        </g>
        <g fill="#e9d3bd" fillOpacity=".9" transform="translate(50 36) scale(.5)">
          <path d="M0-2.5 1.2-4.6 2.2-2.6C5-3.6 8.5-4.6 12-6.2 11-3.8 10.8-2.2 11 0 9.6-1.2 8.4-1.4 7.4-.4 6.4-1.8 5-1.8 4-.2 3-1 2-.6 1.4 1.2L0 3.2Z M0-2.5-1.2-4.6-2.2-2.6C-5-3.6-8.5-4.6-12-6.2-11-3.8-10.8-2.2-11 0-9.6-1.2-8.4-1.4-7.4-.4-6.4-1.8-5-1.8-4-.2-3-1-2-.6-1.4 1.2L0 3.2Z"/>
        </g>
        <circle cx="13" cy="14" r=".9" fill="#e9d3bd" fillOpacity=".8"/>
        <circle cx="21" cy="9" r=".6" fill="#e9d3bd" fillOpacity=".6"/>
        <circle cx="9" cy="26" r=".6" fill="#e9d3bd" fillOpacity=".5"/>
        <path d="M32 46c-3.2 4-5 6.6-5 9a5 5 0 0 0 10 0c0-2.4-1.8-5-5-9Z" fill="#c0334d"/>
        <path d="M30 53.6a2.6 2.6 0 0 0 1.6 2" fill="none" stroke="#f4a5b3" strokeOpacity=".7" strokeWidth="1" strokeLinecap="round"/>
      
    </svg>
  );
}

const SERIF = "'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif";
const BODY = "'Cormorant Garamond', Georgia, serif";

export function Wordmark({ showSub = true }: { showSub?: boolean }) {
  return (
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: "0.04em", color: "#F1E4D3", textShadow: "0 0 18px rgba(192,51,77,0.35)" }}>Lokhandwala</div>
      {showSub && (
        <div className="brand-sub" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 10.5, letterSpacing: "0.34em", color: "#D4566B", marginTop: 5, textTransform: "uppercase", paddingLeft: 1 }}>Family Lineage</div>
      )}
    </div>
  );
}
