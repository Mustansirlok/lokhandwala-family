/**
 * Hand-drawn cartoon likenesses, one per family member, based on their photos.
 * The face (skin, hair, beard, glasses, head-cover …) is fixed; the Atelier only
 * changes outfits. `name` + `gen` identify the member (that pair is unique), and
 * the outfit values are each person's starting outfit.
 */
import type { AvatarConfig, AvatarFace } from "./avatarOptions";

type Outfit = Pick<AvatarConfig, "gender" | "top" | "topColor" | "bottom" | "bottomColor">;
export interface FaceEntry { name: string; gen: number; outfit: Outfit; face: AvatarFace }

const m = (top: string, topColor: string, bottom: string, bottomColor = ""): Outfit => ({ gender: "men", top, topColor, bottom, bottomColor });
const w = (top: string, topColor: string, bottom: string, bottomColor = ""): Outfit => ({ gender: "women", top, topColor, bottom, bottomColor });

export const FACES: Record<string, FaceEntry> = {
  /* ---------------- Generation I ---------------- */
  abdullah: { name: "Abdullah", gen: 1, outfit: m("kurta", "#EDE6D8", "linen-slacks", "#D8CFB8"), face: {
    skin: "#B38660", hair: "bald-sides", hairColor: "#8a8b8f", facialHair: "trimmed-beard", beardColor: "#8F9094", wrinkles: 0.8,
    faceWidth: 1.1, jaw: 0.7, eyes: "relaxed", brow: 1.0, browArch: 0.2, mouth: "smirk", nose: 1.15, earSize: 1.2 } },
  sakina: { name: "Sakina", gen: 1, outfit: w("kurta", "#F6F6F3", "rida", "#F6F6F3"), face: {
    skin: "#C79A72", hair: "covered", hairColor: "#E4E4E4", facialHair: "none", headCover: "hijab", headCoverColor: "#F7F7F4",
    glasses: "rect", glassesColor: "#6A5A55", glassesTint: "rgba(80,55,45,0.28)", wrinkles: 1,
    faceWidth: 1.03, jaw: 0.15, eyes: "relaxed", brow: 0.7, browArch: 0.2, mouth: "smile", nose: 1.05, earSize: 0.9 } },

  /* ---------------- Generation II ---------------- */
  mustansir_sr: { name: "Mustansir", gen: 2, outfit: m("kurta", "#EFE6CF", "linen-slacks", "#D8CFB8"), face: {
    skin: "#A8744F", hair: "short-crop", hairColor: "#17120f", facialHair: "full-beard", headCover: "topi",
    faceWidth: 1.06, jaw: 0.5, eyes: "happy", brow: 1.3, browArch: 0.3, mouth: "grin", nose: 1.15, earSize: 1.0, wrinkles: 0.2 } },
  nilupher: { name: "Nilupher", gen: 2, outfit: w("kurta", "#F0B83C", "rida", "#F0B83C"), face: {
    skin: "#DDB391", hair: "parted-covered", hairColor: "#17120f", facialHair: "none", headCover: "dupatta", headCoverColor: "#F2D6A6", tikka: true,
    faceWidth: 1.12, jaw: 0.05, eyes: "open", brow: 0.85, browArch: 0.7, mouth: "smirk", lipColor: "#8E2F3F", nose: 1.0, earSize: 0.9, lashes: true, earring: true } },
  huzefa: { name: "Huzefa", gen: 2, outfit: m("tshirt", "#E8A9C0", "trousers", "#2E2A26"), face: {
    skin: "#B5865F", hair: "tousled", hairColor: "#1f1915", facialHair: "trimmed-beard", beardColor: "#2d2825", wrinkles: 0.4,
    faceWidth: 1.07, jaw: 0.6, eyes: "relaxed", brow: 1.5, browArch: 0.1, mouth: "neutral", nose: 1.2, earSize: 1.1 } },
  jumana: { name: "Jumana", gen: 2, outfit: w("tshirt", "#6F95C4", "trousers", "#2E2A26"), face: {
    skin: "#D8AD88", hair: "pulled-back", hairColor: "#2a1f1a", facialHair: "none", glasses: "cat-eye", glassesColor: "#1b1a1c", glassesTint: "rgba(20,20,24,0.93)",
    faceWidth: 1.0, jaw: 0.25, eyes: "relaxed", brow: 0.8, browArch: 0.4, mouth: "smirk", nose: 1.05, earSize: 0.95, earring: true } },
  murtuza: { name: "Murtuza", gen: 2, outfit: m("tshirt", "#8A92B4", "trousers", "#2E2A26"), face: {
    skin: "#B07B55", hair: "receding", hairColor: "#2a2420", facialHair: "bushy-beard", wrinkles: 0.45,
    faceWidth: 1.0, jaw: 0.3, eyes: "relaxed", brow: 1.35, browArch: 0.1, mouth: "neutral", nose: 1.15, earSize: 1.3 } },
  rumana: { name: "Rumana", gen: 2, outfit: w("kurta", "#C8A0C4", "rida", "#C8A0C4"), face: {
    skin: "#B98760", hair: "covered", hairColor: "#3a322d", facialHair: "none", headCover: "hijab", headCoverColor: "#C8A0C4", glasses: "cat-eye",
    faceWidth: 1.06, jaw: 0.2, eyes: "relaxed", brow: 0.9, browArch: 0.4, mouth: "smile", nose: 1.12, earSize: 0.9, lashes: true } },
  khozema: { name: "Khozema", gen: 2, outfit: m("kurta", "#F1F1EC", "linen-slacks", "#D8CFB8"), face: {
    skin: "#A8754F", hair: "short-crop", hairColor: "#17120f", facialHair: "full-beard", headCover: "topi", wrinkles: 0.15,
    faceWidth: 0.97, jaw: 0.45, eyes: "relaxed", brow: 1.25, browArch: 0.2, mouth: "neutral", nose: 1.15, earSize: 1.1 } },
  zaineb_khozema: { name: "Zaineb", gen: 2, outfit: w("kurta", "#C06A3A", "rida", "#C06A3A"), face: {
    skin: "#E2BC9A", hair: "parted-covered", hairColor: "#17120f", facialHair: "none", headCover: "dupatta", headCoverColor: "#B8643C",
    faceWidth: 1.02, jaw: 0.2, eyes: "happy", brow: 1.3, browArch: 0.45, mouth: "smile", nose: 1.0, earSize: 0.9, lashes: true } },
  zahabiya: { name: "Zahabiya Shah", gen: 2, outfit: w("kurta", "#5A2D6E", "rida", "#5A2D6E"), face: {
    skin: "#B98A62", hair: "covered", hairColor: "#17120f", facialHair: "none", headCover: "hijab", headCoverColor: "#5A2D6E",
    glasses: "round", glassesColor: "#D9B79F", glassesTint: "rgba(255,230,215,0.15)", wrinkles: 0.3,
    faceWidth: 1.04, jaw: 0.2, eyes: "relaxed", brow: 0.85, browArch: 0.3, mouth: "neutral", nose: 1.05, earSize: 0.9, lashes: true } },
  qusai: { name: "Qusai Shah", gen: 2, outfit: m("tshirt", "#1A2340", "trousers", "#2E2A26"), face: {
    skin: "#AE8262", hair: "short-crop", hairColor: "#8E9096", beardColor: "#A3A6AC", facialHair: "long-beard", headCover: "topi",
    glasses: "round", glassesColor: "#2A2A30", wrinkles: 0.55,
    faceWidth: 1.0, jaw: 0.5, eyes: "relaxed", brow: 1.1, browArch: 0.2, mouth: "smirk", nose: 1.1, earSize: 1.05 } },

  /* ---------------- Generation III ---------------- */
  ammar: { name: "Ammar", gen: 3, outfit: m("tshirt", "#F3F0E8", "denim", "#33465E"), face: {
    skin: "#BC875B", hair: "tousled", hairColor: "#1c1714", hairStreak: "#9EA1A8", facialHair: "full-beard", glasses: "wayfarer",
    faceWidth: 1.0, jaw: 0.6, eyes: "relaxed", brow: 1.3, browArch: 0.3, mouth: "grin", nose: 1.12, earSize: 1.0 } },
  zaineb_ammar: { name: "Zaineb", gen: 3, outfit: w("kurta", "#B3202F", "rida", "#B3202F"), face: {
    skin: "#B7835D", hair: "side-wave", hairColor: "#17120f", facialHair: "none", headCover: "dupatta", headCoverColor: "#E8D2A0", headCoverTrim: "#B3202F", tikka: true,
    faceWidth: 0.98, jaw: 0.25, eyes: "relaxed", brow: 1.1, browArch: 0.5, mouth: "smirk", lipColor: "#C26A78", nose: 1.0, earSize: 0.9, lashes: true } },
  maria_big: { name: "Maria Arsiwala", gen: 3, outfit: w("kurta", "#F4EFE2", "rida", "#F4EFE2"), face: {
    skin: "#D9B08A", hair: "side-braid", hairColor: "#1d1511", facialHair: "none", headCover: "dupatta", hairFlowers: true, tikka: true,
    faceWidth: 1.0, jaw: 0.2, eyes: "relaxed", brow: 1.0, browArch: 0.5, mouth: "smirk", nose: 1.0, earSize: 0.9, lashes: true } },
  abdeali: { name: "Abdeali Arsiwala", gen: 3, outfit: m("kurta", "#E0B63A", "trousers", "#2E2A26"), face: {
    skin: "#C69A72", hair: "short-crop", hairColor: "#1a1410", facialHair: "stubble", beardColor: "#2b221c",
    faceWidth: 1.0, jaw: 0.55, eyes: "relaxed", brow: 1.2, browArch: 0.15, mouth: "smirk", nose: 1.05, earSize: 1.1 } },
  arwa: { name: "Arwa", gen: 3, outfit: w("kurta", "#F3EEE3", "rida", "#EDE6D6"), face: {
    skin: "#DDB087", hair: "side-braid", hairColor: "#17120f", facialHair: "none", headCover: "dupatta",
    faceWidth: 1.05, jaw: 0.1, eyes: "relaxed", brow: 1.0, browArch: 0.5, mouth: "smile", nose: 0.95, earSize: 0.9, lashes: true, mole: { x: 27, y: 133 } } },
  mustansir_jr: { name: "Mustansir", gen: 3, outfit: m("tshirt", "#16161a", "denim", "#33465E"), face: {
    skin: "#D2A47A", hair: "straight-fringe", hairColor: "#17120f", facialHair: "none", hairTexture: 1,
    faceWidth: 1.04, jaw: 0.55, eyes: "relaxed", brow: 1.25, browArch: 0.1, mouth: "smirk", nose: 1.0, earSize: 1.05 } },
  maria_small: { name: "Maria", gen: 3, outfit: w("kurta", "#86A0CE", "trousers", "#1B2240"), face: {
    skin: "#B07C52", hair: "pulled-back", hairColor: "#17120f", facialHair: "none",
    faceWidth: 0.97, jaw: 0.15, eyes: "relaxed", brow: 0.95, browArch: 0.6, mouth: "neutral", nose: 0.9, earSize: 0.95, lashes: true, earring: true } },
  adam: { name: "Adam", gen: 3, outfit: m("tshirt", "#6B4A35", "denim", "#33465E"), face: {
    skin: "#B98557", hair: "wavy-fringe", hairColor: "#1b130e", facialHair: "none",
    faceWidth: 0.94, jaw: 0.35, eyes: "relaxed", brow: 0.95, browArch: 0.4, mouth: "smile", nose: 1.05, earSize: 1.0 } },
  mohammad_shah: { name: "Mohammad Shah", gen: 3, outfit: m("tshirt", "#B58B55", "denim", "#33465E"), face: {
    skin: "#D9AE85", hair: "tousled", hairColor: "#1a1410", facialHair: "none", glasses: "round", glassesColor: "#7A5A22", glassesTint: "rgba(255,255,255,0.10)",
    faceWidth: 0.92, jaw: 0.5, eyes: "relaxed", brow: 1.1, browArch: 0.3, mouth: "smirk", nose: 1.0, earSize: 1.0 } },
  habeel_shah: { name: "Habeel Shah", gen: 3, outfit: m("tshirt", "#F2C230", "denim", "#33465E"), face: {
    skin: "#C9996D", hair: "side-sweep", hairColor: "#1d1511", facialHair: "none", childLike: true,
    faceWidth: 0.98, jaw: 0.2, eyes: "open", brow: 1.35, browArch: 0.2, mouth: "smirk", nose: 0.9, earSize: 1.2 } },
  abilfazal: { name: "Abilfazal Lokhandwala", gen: 3, outfit: m("tshirt", "#1F3B6B", "denim", "#33465E"), face: {
    skin: "#A8744A", hair: "messy-waves", hairColor: "#140e0b", facialHair: "goatee-moustache",
    faceWidth: 0.94, jaw: 0.3, eyes: "relaxed", brow: 0.85, browArch: 0.6, mouth: "smirk", nose: 1.05, earSize: 1.0 } },

  /* ---------------- Generation IV ---------------- */
  husseina_ammar: { name: "Husseina Lokhandwala", gen: 4, outfit: w("tshirt", "#A9E0E3", "denim", "#33465E"), face: {
    skin: "#CFA07A", hair: "toddler-curls", hairColor: "#4A3326", facialHair: "none", childLike: true,
    faceWidth: 1.1, jaw: 0.05, eyes: "open", brow: 0.85, browArch: 0.4, mouth: "smile", nose: 0.8, earSize: 0.9, lashes: true } },
  fatema_arsiwala: { name: "Fatema Arsiwala", gen: 4, outfit: w("tank", "#F4F1EA", "trousers", "#26262B"), face: {
    skin: "#C99A76", hair: "full-bob", hairColor: "#2c211b", facialHair: "none", childLike: true,
    faceWidth: 1.12, jaw: 0.05, eyes: "laugh", brow: 0.8, browArch: 0.5, mouth: "grin", nose: 0.8, earSize: 0.9, lashes: true, earring: true } },
  husseina_arsiwala: { name: "Husseina Arsiwala", gen: 4, outfit: w("tshirt", "#F6C8D6", "trousers", "#F6C8D6"), face: {
    skin: "#D2A580", hair: "baby-wisps", hairColor: "#2a1e18", facialHair: "none", baby: true, bow: "#F28DB0",
    faceWidth: 1.0, jaw: 0, eyes: "open", brow: 0.55, browArch: 0.4, mouth: "smile", earSize: 0.7 } },
};

/** Look up the starting avatar fields (outfit + face) for a seed key. */
export function faceAvatarFor(key: string): Partial<AvatarConfig> | null {
  const f = FACES[key];
  return f ? { ...f.outfit, face: f.face } : null;
}
