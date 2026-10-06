"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { FamilyMemberDTO } from "@/lib/avatarOptions";
import { clamp, genLabel } from "@/lib/avatarOptions";
import { GlassPanel } from "./Glass";
import MemberNode from "./MemberNode";
import { OBSIDIAN, IRIS, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, HAIRLINE, FONT } from "@/lib/theme";

function useViewportSize() {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1024,
    h: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return size;
}

const MIN_SCALE = 0.12;
const MAX_SCALE = 2.5;
const CLICK_DELTA_THRESHOLD = 8; // a little more forgiving for fingers than a mouse
const DOUBLE_TAP_MS = 320;

export default function LineageCanvas({ members, onOpenDossier }: { members: FamilyMemberDTO[]; onOpenDossier: (id: string) => void }) {
  const { w: windowWidth, h: windowHeight } = useViewportSize();
  // Phones (portrait or landscape) get smaller, name-only cards so far more of the tree fits on screen.
  const isMobile = windowWidth < 640 || windowHeight < 500;
  const CARD_W = isMobile ? 96 : 172;
  const NODE_H = isMobile ? 122 : 236;
  const GAP_X = isMobile ? 14 : 30;
  const GEN_H = isMobile ? NODE_H + 64 : 300;
  const TOP_PAD = isMobile ? 40 : 60;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 900, height: 600 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [interacting, setInteracting] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const panState = useRef({ active: false, lastX: 0, lastY: 0, startX: 0, startY: 0, moved: false, downMemberId: null as string | null });
  const pinchState = useRef({ active: false, startDist: 0, startScale: 1 });
  const userAdjusted = useRef(false); // once the person pans/zooms, stop auto-fitting on rotate/resize
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 7000);
    return () => clearTimeout(t);
  }, []);

  const byGen = useMemo(() => {
    const map: Record<number, FamilyMemberDTO[]> = {};
    members.forEach((m) => { map[m.gen] = map[m.gen] || []; map[m.gen].push(m); });
    Object.keys(map).forEach((g) => map[Number(g)].sort((a, b) => a.order - b.order));
    return map;
  }, [members]);

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    Object.entries(byGen).forEach(([gen, list]) => {
      list.forEach((m, i) => { pos[m.id] = { x: i * (CARD_W + GAP_X) + (isMobile ? 24 : 40), y: (Number(gen) - 1) * GEN_H + TOP_PAD }; });
    });
    return pos;
  }, [byGen, CARD_W, GAP_X, GEN_H, TOP_PAD, isMobile]);

  const canvasW = Math.max(...Object.values(positions).map((p) => p.x), 0) + CARD_W + 60;
  const canvasH = Math.max(...Object.values(positions).map((p) => p.y), 0) + NODE_H + 40;

  const connectors = useMemo(() => {
    const lines: { id: string; d: string }[] = [];
    members.forEach((m) => {
      const parentIds = [m.parent1Id, m.parent2Id].filter(Boolean) as string[];
      if (parentIds.length && positions[m.id]) {
        const validParents = parentIds.map((pid) => positions[pid]).filter(Boolean) as { x: number; y: number }[];
        if (validParents.length) {
          const midX = validParents.reduce((s, p) => s + p.x, 0) / validParents.length + CARD_W / 2;
          const midY = validParents[0].y + NODE_H + 8;
          const childPos = positions[m.id];
          lines.push({ id: `p-${m.id}`, d: `M ${midX} ${midY} L ${midX} ${midY + 22} L ${childPos.x + CARD_W / 2} ${midY + 22} L ${childPos.x + CARD_W / 2} ${childPos.y}` });
        }
      }
      if (m.spouseId) {
        const a = positions[m.id];
        const b = positions[m.spouseId];
        if (a && b && m.id < m.spouseId) lines.push({ id: `s-${m.id}`, d: `M ${a.x + CARD_W} ${a.y + NODE_H / 2} L ${b.x} ${b.y + NODE_H / 2}` });
      }
    });
    return lines;
  }, [members, positions, CARD_W, NODE_H]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setViewportSize({ width: r.width, height: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitToView = useCallback(() => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height || !canvasW || !canvasH) return;
    // keep the tree clear of the search/zoom bar that floats over the top of the canvas
    const topInset = 68;
    const availH = Math.max(120, rect.height - topInset);
    const scale = clamp(Math.min(rect.width / canvasW, availH / canvasH) * 0.96, MIN_SCALE, MAX_SCALE);
    setTransform({ scale, x: (rect.width - canvasW * scale) / 2, y: topInset + (availH - canvasH * scale) / 2 });
  }, [canvasW, canvasH]);

  const markAdjusted = useCallback(() => {
    userAdjusted.current = true;
    setShowHint(false);
  }, []);

  // Fit the whole tree on first load, and re-fit on rotate/resize until the person takes over.
  useEffect(() => {
    if (!userAdjusted.current) fitToView();
  }, [fitToView, viewportSize.width, viewportSize.height]);

  const zoomAt = useCallback((cx: number, cy: number, factorOrScale: number, absolute = false) => {
    setTransform((t) => {
      const newScale = clamp(absolute ? factorOrScale : t.scale * factorOrScale, MIN_SCALE, MAX_SCALE);
      const contentX = (cx - t.x) / t.scale;
      const contentY = (cy - t.y) / t.scale;
      return { scale: newScale, x: cx - contentX * newScale, y: cy - contentY * newScale };
    });
  }, []);

  const zoomButton = (dir: 1 | -1) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    markAdjusted();
    zoomAt(rect.width / 2, rect.height / 2, dir > 0 ? 1.25 : 0.8);
  };

  const focusOn = (id: string) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const p = positions[id];
    if (!rect || !p) return;
    markAdjusted();
    const scale = clamp(Math.max(transform.scale, isMobile ? 0.9 : 1), MIN_SCALE, MAX_SCALE);
    const contentX = p.x + CARD_W / 2;
    const contentY = p.y + NODE_H / 2;
    setInteracting(true);
    setTransform({ scale, x: rect.width / 2 - contentX * scale, y: rect.height / 2 - contentY * scale });
    setTimeout(() => setInteracting(false), 300);
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      markAdjusted();
      const rect = el.getBoundingClientRect();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, markAdjusted]);

  const onPointerDown = (e: React.PointerEvent) => {
    (viewportRef.current as any)?.setPointerCapture?.(e.pointerId);
    const target = e.target as HTMLElement;
    const cardEl = target.closest?.("[data-member-id]");
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      panState.current = { active: true, lastX: e.clientX, lastY: e.clientY, startX: e.clientX, startY: e.clientY, moved: false, downMemberId: cardEl ? cardEl.getAttribute("data-member-id") : null };
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      markAdjusted();
      panState.current.moved = true; // a pinch is never a tap
      pinchState.current = { active: true, startDist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), startScale: transform.scale };
      panState.current.active = false;
    }
    setInteracting(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchState.current.active && pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2, midY = (pts[0].y + pts[1].y) / 2;
      const rect = viewportRef.current!.getBoundingClientRect();
      zoomAt(midX - rect.left, midY - rect.top, pinchState.current.startScale * (dist / pinchState.current.startDist), true);
    } else if (panState.current.active) {
      const dx = e.clientX - panState.current.lastX;
      const dy = e.clientY - panState.current.lastY;
      panState.current.lastX = e.clientX;
      panState.current.lastY = e.clientY;
      const totalDelta = Math.hypot(e.clientX - panState.current.startX, e.clientY - panState.current.startY);
      if (totalDelta > CLICK_DELTA_THRESHOLD && !panState.current.moved) { panState.current.moved = true; markAdjusted(); }
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    const wasPanning = panState.current.active;
    const moved = panState.current.moved;
    const downMemberId = panState.current.downMemberId;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchState.current.active = false;
    if (pointers.current.size === 0) {
      panState.current.active = false;
      setInteracting(false);
      if (wasPanning && !moved && downMemberId) {
        onOpenDossier(downMemberId);
      } else if (wasPanning && !moved && !downMemberId) {
        // double-tap on empty canvas zooms in (like a map)
        const now = Date.now();
        const lt = lastTap.current;
        const rect = viewportRef.current?.getBoundingClientRect();
        if (rect && now - lt.t < DOUBLE_TAP_MS && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 30) {
          markAdjusted();
          setInteracting(true);
          zoomAt(e.clientX - rect.left, e.clientY - rect.top, 1.9);
          setTimeout(() => setInteracting(false), 330);
          lastTap.current = { t: 0, x: 0, y: 0 };
        } else {
          lastTap.current = { t: now, x: e.clientX, y: e.clientY };
        }
      }
    }
  };

  const results = query.trim() ? members.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase())) : [];
  const jumpTo = (id: string) => {
    setHighlightId(id);
    setQuery("");
    focusOn(id);
    onOpenDossier(id);
    setTimeout(() => setHighlightId(null), 2200);
  };

  const MM_W = isMobile ? 92 : 148;
  const MM_H = isMobile ? 62 : 96;
  const mmScale = Math.min(MM_W / canvasW, MM_H / canvasH);
  const mmOffX = (MM_W - canvasW * mmScale) / 2;
  const mmOffY = (MM_H - canvasH * mmScale) / 2;
  const vx0 = -transform.x / transform.scale;
  const vy0 = -transform.y / transform.scale;
  const vw = viewportSize.width / transform.scale;
  const vh = viewportSize.height / transform.scale;

  const jumpFromMiniMap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const contentX = (mx - mmOffX) / mmScale;
    const contentY = (my - mmOffY) / mmScale;
    const vpRect = viewportRef.current!.getBoundingClientRect();
    markAdjusted();
    setInteracting(true);
    setTransform((t) => ({ ...t, x: vpRect.width / 2 - contentX * t.scale, y: vpRect.height / 2 - contentY * t.scale }));
    setTimeout(() => setInteracting(false), 300);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute z-20 flex items-start gap-2.5" style={{ top: 12, left: 12, right: 12 }}>
        <GlassPanel style={{ padding: 0, borderRadius: 14, flex: isMobile ? "1 1 0" : undefined, minWidth: 0, maxWidth: isMobile ? 420 : undefined }}>
          <div className="relative" style={{ width: isMobile ? "100%" : 260 }}>
            <Search size={14} color={TEXT_TERTIARY} style={{ position: "absolute", left: 12, top: isMobile ? 14 : 11.5 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the family…" style={{ width: "100%", padding: isMobile ? "12px 12px 12px 34px" : "10px 12px 10px 32px", background: "transparent", border: "none", fontFamily: FONT, fontSize: 13, color: TEXT_PRIMARY, outline: "none" }} />
          </div>
          {results.length > 0 && (
            <div style={{ borderTop: `1px solid ${HAIRLINE}`, maxHeight: 220, overflowY: "auto" }}>
              {results.map((r) => (
                <button key={r.id} type="button" onClick={() => jumpTo(r.id)} className="w-full text-left px-3.5 py-3 flex items-center justify-between obsidian-btn" style={{ fontFamily: FONT, fontSize: 13, color: TEXT_PRIMARY, cursor: "pointer" }}>
                  <span>{r.name}</span>
                  <span style={{ fontSize: 10.5, color: TEXT_TERTIARY }}>{genLabel(r.gen)}</span>
                </button>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel style={{ padding: 4, borderRadius: 14, display: "flex", alignItems: "center", gap: 2, marginLeft: "auto", flexShrink: 0 }}>
          <button type="button" onClick={() => zoomButton(-1)} title="Zoom out" className="obsidian-btn" style={{ padding: isMobile ? 11 : 8, borderRadius: 10, cursor: "pointer" }}><ZoomOut size={14} color={TEXT_SECONDARY} /></button>
          {!isMobile && <span style={{ fontFamily: FONT, fontSize: 11.5, color: TEXT_SECONDARY, width: 38, textAlign: "center" }}>{Math.round(transform.scale * 100)}%</span>}
          <button type="button" onClick={() => zoomButton(1)} title="Zoom in" className="obsidian-btn" style={{ padding: isMobile ? 11 : 8, borderRadius: 10, cursor: "pointer" }}><ZoomIn size={14} color={TEXT_SECONDARY} /></button>
          <div style={{ width: 1, height: 18, background: HAIRLINE, margin: "0 2px" }} />
          <button type="button" onClick={() => { userAdjusted.current = false; fitToView(); }} title="Fit to screen" className="obsidian-btn" style={{ padding: isMobile ? 11 : 8, borderRadius: 10, cursor: "pointer" }}><Maximize2 size={14} color={TEXT_SECONDARY} /></button>
        </GlassPanel>
      </div>

      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onLostPointerCapture={endPointer}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ background: OBSIDIAN, touchAction: "none", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: canvasW, height: canvasH, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: "0 0", transition: interacting ? "none" : "transform 0.32s cubic-bezier(.2,.85,.25,1)" }}>
          <svg width={canvasW} height={canvasH} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <defs>
              <pattern id="obsidian-dots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="#fff" opacity="0.05" />
              </pattern>
            </defs>
            <rect width={canvasW} height={canvasH} fill="url(#obsidian-dots)" />
            {connectors.map((c) => <path key={c.id} d={c.d} fill="none" stroke={IRIS} strokeOpacity="0.35" strokeWidth="1.6" />)}
          </svg>
          {[1, 2, 3, 4].map((gen) => byGen[gen] && (
            <div key={gen} style={{ position: "absolute", left: 0, top: (gen - 1) * GEN_H + TOP_PAD - (isMobile ? 24 : 30), fontFamily: FONT, fontSize: isMobile ? 10 : 11, letterSpacing: "0.06em", color: TEXT_TERTIARY, textTransform: "uppercase", fontWeight: 600 }}>
              {genLabel(gen)}
            </div>
          ))}
          {members.map((m) => (
            <div key={m.id} data-member-id={m.id} style={{ position: "absolute", left: positions[m.id].x, top: positions[m.id].y, zIndex: 2, pointerEvents: "auto" }}>
              <MemberNode member={m} width={CARD_W} compact={isMobile} highlighted={highlightId === m.id} onClick={() => onOpenDossier(m.id)} />
            </div>
          ))}
        </div>

        {isMobile && windowWidth < 640 && showHint && (
          <div style={{ position: "absolute", left: 14, bottom: "calc(16px + env(safe-area-inset-bottom))", zIndex: 3, pointerEvents: "none", fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY, background: "rgba(22,22,29,0.8)", border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "8px 11px", maxWidth: "calc(100% - 140px)", lineHeight: 1.35 }}>
            Pinch to zoom · drag to move · double-tap to zoom in
          </div>
        )}
        <GlassPanel style={{ position: "absolute", bottom: "calc(14px + env(safe-area-inset-bottom))", right: "calc(14px + env(safe-area-inset-right))", width: MM_W, height: MM_H, padding: 0, borderRadius: 14, cursor: "pointer", zIndex: 3 }}>
          <div onClick={jumpFromMiniMap} style={{ width: "100%", height: "100%" }} title="Click to jump">
            <svg width={MM_W} height={MM_H}>
              {Object.entries(positions).map(([id, p]) => (
                <rect key={id} x={mmOffX + p.x * mmScale} y={mmOffY + p.y * mmScale} width={Math.max(2, CARD_W * mmScale)} height={Math.max(2, NODE_H * mmScale)} fill="#fff" opacity="0.18" rx={1} />
              ))}
              <rect x={mmOffX + vx0 * mmScale} y={mmOffY + vy0 * mmScale} width={Math.max(1, vw * mmScale)} height={Math.max(1, vh * mmScale)} fill="none" stroke={IRIS_LIGHT} strokeWidth="1.4" rx={2} />
            </svg>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
