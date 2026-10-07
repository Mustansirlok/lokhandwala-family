export type Gender = "men" | "women";

/** Per-person cartoon likeness. Fixed face/hair; the Atelier only edits outfits. */
export interface AvatarFace {
  skin: string;                       // hex
  hair: "straight-fringe" | "messy-waves" | "short-crop" | "curly-top" | "bald" | "long-straight" | "bob" | "hijab" | "pulled-back" | "side-braid" | "covered" | "side-sweep" | "tousled" | "toddler-curls" | "wavy-fringe" | "receding" | "bald-sides" | "parted-covered" | "full-bob" | "side-wave" | "baby-wisps";
  hairColor: string;                  // hex (greys automatically with age)
  facialHair: "none" | "stubble" | "moustache" | "goatee" | "goatee-moustache" | "full-beard" | "long-beard" | "bushy-beard" | "trimmed-beard";
  faceWidth?: number;                 // 0.85 – 1.15
  jaw?: number;                       // 0 soft … 1 square
  eyes?: "relaxed" | "open" | "happy" | "laugh";
  brow?: number;                      // 0.6 thin … 1.6 thick
  browArch?: number;                  // 0 flat … 1 arched
  mouth?: "smirk" | "smile" | "neutral" | "grin";
  nose?: number;                      // 0.8 small … 1.3 big
  earSize?: number;
  glasses?: "none" | "round" | "rect" | "cat-eye" | "wayfarer";
  glassesColor?: string;
  glassesTint?: string;               // lens fill, e.g. "rgba(90,60,40,0.25)"
  beardColor?: string;                // overrides hair colour for facial hair (e.g. grey beard)
  wrinkles?: number;                  // 0..1 explicit age lines (overrides birth-year ageing)
  lashes?: boolean;
  baby?: boolean;                      // infant proportions: very round head, big eyes, tiny nose
  bow?: string;                        // hair bow colour
  childLike?: boolean;                 // rounder, bigger-eyed proportions
  earring?: boolean;
  headCover?: "none" | "dupatta" | "hijab" | "topi";
  headCoverColor?: string;
  headCoverTrim?: string;              // dupatta border colour
  lipColor?: string;                   // lipstick, e.g. "#8E2F3F"
  hairFlowers?: boolean;               // little white flowers tucked in the hair
  tikka?: boolean;                     // gold forehead chain along the parting
  hairStreak?: string;                 // e.g. grey streaks through dark hair
  hairTexture?: number;                // 0 sleek … 1 very textured
  mole?: { x: number; y: number }; // offset from face centre, in avatar units (e.g. 28, 30)
}

export interface AvatarConfig {
  face?: AvatarFace;
  gender: Gender;
  faceShape: string;
  skin: string;
  hair: string;
  hairColor: string;
  top: string;
  topColor: string;
  bottom: string;
  bottomColor: string;
  shoes: string;
  shoeColor: string;
  accessories: string[];
}

export interface Vitals {
  birthYear: string; // empty string = unknown; age is computed from this, never stored
  email: string;
  height: string;
  phoneCountryCode: string;
  phoneNumber: string;
  bloodGroup: string;
}

export interface PhotoRef {
  id: string;
  url: string;
}

export interface FamilyMemberDTO {
  id: string;
  name: string;
  gen: number;
  order: number;
  parent1Id: string | null;
  parent2Id: string | null;
  spouseId: string | null;
  relation: string;
  deceased: boolean;
  vitals: Vitals;
  bio: string;
  avatar: AvatarConfig;
  photos: PhotoRef[];
}

export interface ClaimDTO {
  id: string;
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  birthYear: string;
  height: string;
  bloodGroup: string;
  bio: string;
  avatar: AvatarConfig;
  photoUrls: string[];
  parent1Id: string | null;
  parent2Id: string | null;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function shade(hex: string, pct: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const target = pct < 0 ? 0 : 255;
  const p = Math.min(1, Math.abs(pct) / 100);
  r = Math.round(r + (target - r) * p);
  g = Math.round(g + (target - g) * p);
  b = Math.round(b + (target - b) * p);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ---------------------------------------------------------------------- */

export const FACE_SHAPE_OPTIONS = [
  { id: "round", label: "Round" },
  { id: "square", label: "Square" },
  { id: "diamond", label: "Diamond" },
  { id: "triangular", label: "Triangular" },
];

export const SKIN_OPTIONS = [
  { id: "porcelain", label: "Porcelain White", hex: "#F3E4D3" },
  { id: "wheat", label: "Caramel Wheat", hex: "#D9AF82" },
  { id: "amber", label: "Rich Amber", hex: "#C08A5C" },
  { id: "sepia", label: "Dark Sepia Brown", hex: "#6B4226" },
  { id: "fantasy-purple", label: "Fantasy Purple", hex: "#A78BFA" },
  { id: "stylized-yellow", label: "Stylized Yellow", hex: "#F5C84C" },
];

export const MEN_HAIR_OPTIONS = [
  { id: "middle-part", label: "Middle-Part" },
  { id: "bun", label: "Bun" },
  { id: "curly", label: "Curly" },
  { id: "textured-fringe", label: "Textured Fringe" },
  { id: "bowl-cut", label: "Bowl Cut" },
  { id: "mullet", label: "Mullet" },
  { id: "simple-medium", label: "Simple Medium" },
  { id: "simple-short", label: "Simple Short" },
];

export const WOMEN_HAIR_OPTIONS = [
  { id: "middle-part-long", label: "Middle-Part" },
  { id: "chignon-bun", label: "Classic Chignon Bun" },
  { id: "layered-curls", label: "Layered Curls" },
  { id: "textured-waves", label: "Textured Waves" },
  { id: "sleek-bob", label: "Sleek Bob" },
  { id: "long-straight", label: "Long Straight" },
  { id: "hijab-rida", label: "Draped Hijab / Rida" },
];

export const HAIR_COLOR_OPTIONS = [
  { id: "black", label: "Natural Black", hex: "#171412" },
  { id: "deep-brown", label: "Deep Brown", hex: "#3B2A1E" },
  { id: "platinum-white", label: "Platinum White", hex: "#E8E3D8" },
  { id: "silver-grey", label: "Silver Grey", hex: "#9CA3AF" },
  { id: "auburn-red", label: "Auburn Red", hex: "#8B3A2C" },
];

export const TOP_OPTIONS = [
  { id: "tshirt", label: "T-Shirt", defaultColor: "#4B5563" },
  { id: "kurta", label: "Traditional Kurta", defaultColor: "#5B6B57" },
  { id: "blazer", label: "Tailored Suit / Blazer", defaultColor: "#22252B" },
  { id: "tank", label: "Tank Top", defaultColor: "#8B5CF6" },
  { id: "shirt-jacket", label: "Shirt with Jacket", defaultColor: "#E7E3D8" },
];

export const BOTTOM_OPTIONS = [
  { id: "trousers", label: "Trousers / Pants", defaultColor: "#2E2A26" },
  { id: "denim", label: "Raw Denim", defaultColor: "#33465E" },
  { id: "linen-slacks", label: "Linen Slacks", defaultColor: "#D8CFB8" },
  { id: "shorts", label: "Shorts", defaultColor: "#3B3F45" },
  { id: "skirt", label: "Pleated Skirt", defaultColor: "#6B4F72" },
  { id: "sari", label: "Traditional Sari", defaultColor: "#8C2F22" },
  { id: "rida", label: "Dawoodi Bohra Rida", defaultColor: "#2F6B6B" },
];

export const SHOE_OPTIONS = [
  { id: "sneakers", label: "Streetwear Sneakers", defaultColor: "#F4F2EC" },
  { id: "dress-shoes", label: "Normal Shoes", defaultColor: "#241F1B" },
];

export const ACCESSORY_OPTIONS = [
  { id: "sunglasses", label: "Sunglasses" },
  { id: "wire-glasses", label: "Wire Eyeglasses" },
  { id: "tie", label: "Formal Tie" },
  { id: "brooch", label: "Brooch" },
  { id: "cap", label: "Baseball Cap" },
  { id: "beanie", label: "Knit Beanie" },
  { id: "bag", label: "Shoulder Bag" },
  { id: "topi", label: "Bohra Topi" },
  { id: "trophy", label: "Golden Trophy" },
];
export const MAX_ACCESSORIES = 2;
export const MAX_PHOTOS = 10;

export function defaultAvatar(overrides: Partial<AvatarConfig> = {}): AvatarConfig {
  return {
    gender: "men",
    faceShape: "round",
    skin: "wheat",
    hair: "simple-short",
    hairColor: "black",
    top: "kurta",
    topColor: TOP_OPTIONS.find((t) => t.id === "kurta")!.defaultColor,
    bottom: "trousers",
    bottomColor: BOTTOM_OPTIONS.find((b) => b.id === "trousers")!.defaultColor,
    shoes: "sneakers",
    shoeColor: SHOE_OPTIONS.find((s) => s.id === "sneakers")!.defaultColor,
    accessories: [],
    ...overrides,
  };
}

export function emptyVitals(): Vitals {
  return { birthYear: "", email: "", height: "", phoneCountryCode: "", phoneNumber: "", bloodGroup: "" };
}

/**
 * Computes a live age from a birth year — never stored, always derived at
 * request/render time from the current date, so age advances on its own
 * every year with no scheduled job or manual update required.
 */
export function computeAge(birthYear: string | number | null | undefined): string {
  const y = typeof birthYear === "number" ? birthYear : parseInt(String(birthYear || "").trim(), 10);
  if (!y || Number.isNaN(y) || y < 1900 || y > new Date().getFullYear()) return "";
  return String(new Date().getFullYear() - y);
}

// All four face shapes share the same width envelope at the hairline
// (~54–146 near y90) so every hairstyle sits consistently regardless of shape.
export const FACE_PATHS: Record<string, string> = {
  round: "M100 62 C132 62 146 85 146 109 C146 135 126 151 100 151 C74 151 54 135 54 109 C54 85 68 62 100 62 Z",
  square: "M100 58 C128 58 142 74 142 100 L142 128 C142 144 122 154 100 154 C78 154 58 144 58 128 L58 100 C58 74 72 58 100 58 Z",
  diamond: "M100 55 C116 55 126 70 128 90 C130 102 144 108 138 120 C130 136 114 148 100 155 C86 148 70 136 62 120 C56 108 70 102 72 90 C74 70 84 55 100 55 Z",
  triangular: "M100 60 C110 60 118 68 120 80 L134 130 C136 142 120 152 100 152 C80 152 64 142 66 130 L80 80 C82 68 90 60 100 60 Z",
};

export const COUNTRY_CODES = [
  { code: "+1", label: "+1 (US/CA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+91", label: "+91 (India)" },
  { code: "+92", label: "+92 (Pakistan)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+968", label: "+968 (Oman)" },
  { code: "+254", label: "+254 (Kenya)" },
  { code: "+255", label: "+255 (Tanzania)" },
  { code: "+256", label: "+256 (Uganda)" },
  { code: "+61", label: "+61 (Australia)" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function genLabel(gen: number): string {
  return { 1: "Generation I", 2: "Generation II", 3: "Generation III", 4: "Generation IV" }[gen] || `Generation ${gen}`;
}
