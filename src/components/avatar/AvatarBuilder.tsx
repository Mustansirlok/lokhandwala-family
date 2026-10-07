"use client";
import { useState } from "react";
import { User, Palette, Sparkles, Shirt, Footprints, Glasses, Check } from "lucide-react";
import {
  AvatarConfig, FACE_SHAPE_OPTIONS, SKIN_OPTIONS, MEN_HAIR_OPTIONS, WOMEN_HAIR_OPTIONS,
  HAIR_COLOR_OPTIONS, TOP_OPTIONS, BOTTOM_OPTIONS, SHOE_OPTIONS, ACCESSORY_OPTIONS, MAX_ACCESSORIES,
} from "@/lib/avatarOptions";
import { IRIS, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, GLASS_BORDER, HAIRLINE, FONT } from "@/lib/theme";
import { SegmentedControl } from "../Glass";

const TABS = [
  { id: "face", label: "Face Shape", icon: User },
  { id: "skin", label: "Skin", icon: Palette },
  { id: "hair", label: "Hair", icon: Sparkles },
  { id: "hairColor", label: "Hair Colour", icon: Palette },
  { id: "top", label: "Top", icon: Shirt },
  { id: "bottom", label: "Bottom", icon: Shirt },
  { id: "shoes", label: "Shoes", icon: Footprints },
  { id: "accessories", label: "Accessories", icon: Glasses },
] as const;

function OptionGrid({ options, value, onChange, renderSwatch }: {
  options: { id: string; label: string; hex?: string }[];
  value: string;
  onChange: (id: string) => void;
  renderSwatch?: (o: { id: string; label: string; hex?: string }) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className="obsidian-btn text-left px-3 py-3 flex items-center gap-2.5"
            style={{ border: `1px solid ${active ? IRIS : GLASS_BORDER}`, background: active ? "rgba(139,92,246,0.14)" : "rgba(255,255,255,0.03)", borderRadius: 12, cursor: "pointer" }}
          >
            {renderSwatch ? renderSwatch(opt) : <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? IRIS_LIGHT : TEXT_TERTIARY, flexShrink: 0 }} />}
            <span style={{ fontFamily: FONT, fontSize: 12.5, color: active ? TEXT_PRIMARY : TEXT_SECONDARY, flex: 1 }}>{opt.label}</span>
            {active && <Check size={13} color={IRIS_LIGHT} strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 mb-5" style={{ fontFamily: FONT, fontSize: 12, color: TEXT_SECONDARY }}>
      <span style={{ position: "relative", width: 34, height: 34, borderRadius: 10, overflow: "hidden", border: `1px solid ${GLASS_BORDER}`, flexShrink: 0 }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", inset: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", padding: 0, cursor: "pointer" }} />
      </span>
      {label}
      <span style={{ color: TEXT_TERTIARY, fontSize: 11 }}>{value}</span>
    </label>
  );
}

export default function AvatarBuilder({ avatar, onChange, mobile = false }: { avatar: AvatarConfig; mobile?: boolean; onChange: <K extends keyof AvatarConfig>(field: K, value: AvatarConfig[K]) => void }) {
  const [tab, setTab] = useState<string>(avatar.face ? "top" : "face");
  const outfitOnly = !!avatar.face;
  const tabs = outfitOnly ? TABS.filter((t) => ["top","bottom","shoes","accessories"].includes(t.id)) : TABS;
  const setField = <K extends keyof AvatarConfig>(field: K) => (value: AvatarConfig[K]) => onChange(field, value);
  const hairCatalog = avatar.gender === "women" ? WOMEN_HAIR_OPTIONS : MEN_HAIR_OPTIONS;

  const toggleAccessory = (id: string) => {
    const current = avatar.accessories || [];
    if (current.includes(id)) onChange("accessories", current.filter((a) => a !== id));
    else if (current.length < MAX_ACCESSORIES) onChange("accessories", [...current, id]);
  };

  return (
    <div className="flex flex-col h-full min-w-0" style={{ minHeight: 0 }}>
      <div className="tab-strip flex flex-nowrap gap-2 overflow-x-auto" style={{ flexShrink: 0, paddingBottom: 10, WebkitOverflowScrolling: "touch" }}>
        {tabs.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className="obsidian-btn px-3 py-2 flex items-center gap-2" style={{ flexShrink: 0, whiteSpace: "nowrap", minHeight: 40, border: `1px solid ${active ? IRIS : GLASS_BORDER}`, background: active ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)", color: active ? IRIS_LIGHT : TEXT_SECONDARY, borderRadius: 11, fontFamily: FONT, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>
      <div style={{ height: 1, background: HAIRLINE, flexShrink: 0 }} />
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingTop: 14, paddingBottom: mobile ? "calc(24px + env(safe-area-inset-bottom))" : 16 }}>

      {tab === "face" && <OptionGrid options={FACE_SHAPE_OPTIONS} value={avatar.faceShape} onChange={setField("faceShape")} />}

      {tab === "skin" && (
        <OptionGrid options={SKIN_OPTIONS} value={avatar.skin} onChange={setField("skin")}
          renderSwatch={(o) => <span style={{ width: 18, height: 18, borderRadius: "50%", background: o.hex, border: `1px solid ${GLASS_BORDER}`, flexShrink: 0 }} />} />
      )}

      {tab === "hair" && (
        <>
          <div className="mb-4">
            <SegmentedControl
              options={[{ id: "men", label: "Men's Styles" }, { id: "women", label: "Women's Styles" }]}
              value={avatar.gender}
              onChange={(g) => {
                onChange("gender", g as "men" | "women");
                const catalog = g === "women" ? WOMEN_HAIR_OPTIONS : MEN_HAIR_OPTIONS;
                if (!catalog.some((h) => h.id === avatar.hair)) onChange("hair", catalog[0].id);
              }}
            />
          </div>
          <OptionGrid options={hairCatalog} value={avatar.hair} onChange={setField("hair")} />
        </>
      )}

      {tab === "hairColor" && (
        <OptionGrid options={HAIR_COLOR_OPTIONS} value={avatar.hairColor} onChange={setField("hairColor")}
          renderSwatch={(o) => <span style={{ width: 18, height: 18, borderRadius: "50%", background: o.hex, border: `1px solid ${GLASS_BORDER}`, flexShrink: 0 }} />} />
      )}

      {tab === "top" && (
        <>
          <ColorField label="Colour" value={avatar.topColor} onChange={setField("topColor")} />
          <OptionGrid options={TOP_OPTIONS} value={avatar.top} onChange={(v) => { onChange("top", v); onChange("topColor", TOP_OPTIONS.find((t) => t.id === v)!.defaultColor); }} />
        </>
      )}

      {tab === "bottom" && (
        <>
          <ColorField label="Colour" value={avatar.bottomColor} onChange={setField("bottomColor")} />
          <OptionGrid options={BOTTOM_OPTIONS} value={avatar.bottom} onChange={(v) => { onChange("bottom", v); onChange("bottomColor", BOTTOM_OPTIONS.find((b) => b.id === v)!.defaultColor); }} />
        </>
      )}

      {tab === "shoes" && (
        <>
          <ColorField label="Colour" value={avatar.shoeColor} onChange={setField("shoeColor")} />
          <OptionGrid options={SHOE_OPTIONS} value={avatar.shoes} onChange={(v) => { onChange("shoes", v); onChange("shoeColor", SHOE_OPTIONS.find((s) => s.id === v)!.defaultColor); }} />
        </>
      )}

      {tab === "accessories" && (
        <>
          <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_TERTIARY, marginBottom: 12 }}>
            Choose up to {MAX_ACCESSORIES} — {(avatar.accessories || []).length}/{MAX_ACCESSORIES} equipped
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACCESSORY_OPTIONS.map((opt) => {
              const active = (avatar.accessories || []).includes(opt.id);
              const atCap = !active && (avatar.accessories || []).length >= MAX_ACCESSORIES;
              return (
                <button key={opt.id} type="button" aria-pressed={active} disabled={atCap} onClick={() => toggleAccessory(opt.id)} className="obsidian-btn text-left px-3 py-3 flex items-center gap-2.5" style={{ border: `1px solid ${active ? IRIS : GLASS_BORDER}`, background: active ? "rgba(139,92,246,0.14)" : "rgba(255,255,255,0.03)", borderRadius: 12, opacity: atCap ? 0.4 : 1, cursor: atCap ? "not-allowed" : "pointer" }}>
                  <span style={{ fontFamily: FONT, fontSize: 12.5, color: active ? TEXT_PRIMARY : TEXT_SECONDARY, flex: 1 }}>{opt.label}</span>
                  {active && <Check size={13} color={IRIS_LIGHT} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
