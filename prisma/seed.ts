/**
 * Seeds the database with the real family tree structure and known birth
 * years. Ages are never stored directly — the app computes them live from
 * `birthYear` on every request (see computeAge in src/lib/avatarOptions.ts),
 * so everyone's displayed age advances on its own every year automatically.
 *
 * Run with: npm run prisma:seed
 * (safe to re-run: it wipes and re-creates FamilyMember/Photo rows first)
 *
 * To update the tree, edit the `people` array below — each entry's
 * `parents` refers to other entries by their `key`. `relationOverride`
 * lets one entry (Abilfazal) get custom relation text instead of the
 * usual "Child of..." / "Married to..." auto-generated label.
 */
import { PrismaClient } from "@prisma/client";
import type { AvatarConfig } from "../src/lib/avatarOptions";
import { defaultAvatar } from "../src/lib/avatarOptions";
import { faceAvatarFor } from "../src/lib/faces";

const prisma = new PrismaClient();

interface SeedPerson {
  key: string;
  name: string;
  gen: number;
  order: number;
  parents?: string[]; // keys of other entries in this array
  spouse?: string; // key of another entry
  birthYear?: number;
  deceased?: boolean;
  relationOverride?: string;
  avatar?: Partial<AvatarConfig>;
}

const people: SeedPerson[] = [
  // ---------- Generation I ----------
  { key: "abdullah", name: "Abdullah", gen: 1, order: 0, spouse: "sakina", deceased: true,
    avatar: { gender: "men", faceShape: "square", skin: "amber", hair: "simple-short", hairColor: "silver-grey" } },
  { key: "sakina", name: "Sakina", gen: 1, order: 1, spouse: "abdullah", birthYear: 1946,
    avatar: { gender: "women", faceShape: "round", skin: "wheat", hair: "hijab-rida", hairColor: "silver-grey" } },

  // ---------- Generation II — children of Abdullah & Sakina, and their spouses ----------
  { key: "mustansir_sr", name: "Mustansir", gen: 2, order: 0, parents: ["abdullah", "sakina"], spouse: "nilupher", birthYear: 1969,
    avatar: { gender: "men", faceShape: "round", skin: "wheat", hair: "middle-part", hairColor: "black", top: "shirt-jacket", bottom: "denim", accessories: ["wire-glasses"] } },
  { key: "nilupher", name: "Nilupher", gen: 2, order: 1, spouse: "mustansir_sr", birthYear: 1976,
    avatar: { gender: "women", faceShape: "diamond", skin: "porcelain", hair: "long-straight", hairColor: "deep-brown" } },

  { key: "huzefa", name: "Huzefa", gen: 2, order: 2, parents: ["abdullah", "sakina"], spouse: "jumana", birthYear: 1973,
    avatar: { gender: "men", faceShape: "diamond", skin: "sepia", hair: "textured-fringe", hairColor: "black" } },
  { key: "jumana", name: "Jumana", gen: 2, order: 3, spouse: "huzefa",
    avatar: { gender: "women", faceShape: "square", skin: "wheat", hair: "sleek-bob", hairColor: "deep-brown" } },

  { key: "murtuza", name: "Murtuza", gen: 2, order: 4, parents: ["abdullah", "sakina"], spouse: "rumana", birthYear: 1975,
    avatar: { gender: "men", faceShape: "triangular", skin: "amber", hair: "curly", hairColor: "deep-brown", top: "blazer" } },
  { key: "rumana", name: "Rumana", gen: 2, order: 5, spouse: "murtuza",
    avatar: { gender: "women", faceShape: "round", skin: "amber", hair: "chignon-bun", hairColor: "black" } },

  { key: "khozema", name: "Khozema", gen: 2, order: 6, parents: ["abdullah", "sakina"], spouse: "zaineb_khozema", birthYear: 1978,
    avatar: { gender: "men", faceShape: "square", skin: "wheat", hair: "bowl-cut", hairColor: "black", bottom: "shorts" } },
  { key: "zaineb_khozema", name: "Zaineb", gen: 2, order: 7, spouse: "khozema", birthYear: 1983,
    avatar: { gender: "women", faceShape: "diamond", skin: "wheat", hair: "layered-curls", hairColor: "deep-brown" } },

  { key: "zahabiya", name: "Zahabiya Shah", gen: 2, order: 8, parents: ["abdullah", "sakina"], spouse: "qusai", birthYear: 1982,
    avatar: { gender: "women", faceShape: "round", skin: "porcelain", hair: "layered-curls", hairColor: "auburn-red", bottom: "skirt" } },
  { key: "qusai", name: "Qusai Shah", gen: 2, order: 9, spouse: "zahabiya", birthYear: 1982,
    avatar: { gender: "men", faceShape: "square", skin: "amber", hair: "simple-medium", hairColor: "black" } },

  // ---------- Generation III ----------
  { key: "ammar", name: "Ammar", gen: 3, order: 0, parents: ["mustansir_sr", "nilupher"], spouse: "zaineb_ammar", birthYear: 1996,
    avatar: { gender: "men", faceShape: "diamond", skin: "wheat", hair: "textured-fringe", hairColor: "black", accessories: ["wire-glasses"] } },
  { key: "zaineb_ammar", name: "Zaineb", gen: 3, order: 1, spouse: "ammar", birthYear: 1996,
    avatar: { gender: "women", faceShape: "square", skin: "amber", hair: "sleek-bob", hairColor: "black", top: "tank" } },

  { key: "maria_big", name: "Maria Arsiwala", gen: 3, order: 2, parents: ["mustansir_sr", "nilupher"], spouse: "abdeali", birthYear: 1999,
    avatar: { gender: "women", faceShape: "triangular", skin: "porcelain", hair: "textured-waves", hairColor: "platinum-white", top: "tank", bottom: "skirt" } },
  { key: "abdeali", name: "Abdeali Arsiwala", gen: 3, order: 3, spouse: "maria_big", birthYear: 1993,
    avatar: { gender: "men", faceShape: "round", skin: "amber", hair: "simple-medium", hairColor: "black" } },

  { key: "arwa", name: "Arwa", gen: 3, order: 4, parents: ["huzefa", "jumana"], birthYear: 2005,
    avatar: { gender: "women", faceShape: "round", skin: "sepia", hair: "textured-waves", hairColor: "black" } },

  { key: "mustansir_jr", name: "Mustansir", gen: 3, order: 5, parents: ["murtuza", "rumana"], birthYear: 2004,
    avatar: { gender: "men", faceShape: "round", skin: "amber", hair: "curly", hairColor: "deep-brown" } },
  { key: "maria_small", name: "Maria", gen: 3, order: 6, parents: ["murtuza", "rumana"],
    avatar: { gender: "women", faceShape: "round", skin: "amber", hair: "layered-curls", hairColor: "deep-brown" } },

  { key: "adam", name: "Adam", gen: 3, order: 7, parents: ["khozema", "zaineb_khozema"], birthYear: 2007,
    avatar: { gender: "men", faceShape: "square", skin: "wheat", hair: "simple-short", hairColor: "black" } },

  { key: "mohammad_shah", name: "Mohammad Shah", gen: 3, order: 8, parents: ["zahabiya", "qusai"], birthYear: 2006,
    avatar: { gender: "men", faceShape: "round", skin: "amber", hair: "simple-medium", hairColor: "black" } },
  { key: "habeel_shah", name: "Habeel Shah", gen: 3, order: 9, parents: ["zahabiya", "qusai"], birthYear: 2016,
    avatar: { gender: "men", faceShape: "round", skin: "amber", hair: "bowl-cut", hairColor: "black" } },

  // Found brother of the younger Mustansir — no blood or marriage tie to
  // the Lokhandwala family, so intentionally left with no parents/spouse;
  // relationOverride keeps that honest while still placing him in the tree.
  { key: "abilfazal", name: "Abilfazal Lokhandwala", gen: 3, order: 10,
    relationOverride: "Found brother of Mustansir (s/o Murtuza & Rumana) — no blood relation",
    avatar: { gender: "men", faceShape: "diamond", skin: "sepia", hair: "textured-fringe", hairColor: "black" } },

  // ---------- Generation IV ----------
  { key: "husseina_ammar", name: "Husseina Lokhandwala", gen: 4, order: 0, parents: ["ammar", "zaineb_ammar"], birthYear: 2024,
    avatar: { gender: "women", faceShape: "round", skin: "wheat", hair: "middle-part-long", hairColor: "deep-brown", accessories: ["brooch"] } },
  { key: "fatema_arsiwala", name: "Fatema Arsiwala", gen: 4, order: 1, parents: ["maria_big", "abdeali"], birthYear: 2022,
    avatar: { gender: "women", faceShape: "round", skin: "porcelain", hair: "layered-curls", hairColor: "platinum-white" } },
  { key: "husseina_arsiwala", name: "Husseina Arsiwala", gen: 4, order: 2, parents: ["maria_big", "abdeali"], birthYear: 2025,
    avatar: { gender: "women", faceShape: "round", skin: "porcelain", hair: "middle-part-long", hairColor: "platinum-white" } },
];

function relationFor(p: SeedPerson): string {
  if (p.relationOverride) return p.relationOverride;
  if (p.parents && p.parents.length > 0) {
    const parentNames = p.parents.map((k) => people.find((x) => x.key === k)!.name);
    return `Child of ${parentNames.join(" & ")}`;
  }
  // No parents in the tree: either a Generation I founder, or someone who
  // married into a later generation (never both, given this data set).
  if (p.gen === 1) return "Founding Generation";
  if (p.spouse) return `Married to ${people.find((x) => x.key === p.spouse)!.name}`;
  return "Family member";
}

async function main() {
  console.log("Wiping existing members and photos...");
  await prisma.photo.deleteMany();
  await prisma.familyMember.deleteMany();

  const idByKey = new Map<string, string>();

  // Pass 1: create everyone without parent/spouse links (self-references
  // need the other row to exist first).
  for (const p of people) {
    const created = await prisma.familyMember.create({
      data: {
        name: p.name,
        gen: p.gen,
        order: p.order,
        relation: relationFor(p),
        birthYear: p.birthYear ?? null,
        deceased: p.deceased ?? false,
        avatar: defaultAvatar({ ...(p.avatar || {}), ...(faceAvatarFor(p.key) || {}) }) as any,
      },
    });
    idByKey.set(p.key, created.id);
  }

  // Pass 2: wire up parent1Id/parent2Id/spouseId now that all ids exist.
  for (const p of people) {
    const [parent1Key, parent2Key] = p.parents || [];
    await prisma.familyMember.update({
      where: { id: idByKey.get(p.key)! },
      data: {
        parent1Id: parent1Key ? idByKey.get(parent1Key) : null,
        parent2Id: parent2Key ? idByKey.get(parent2Key) : null,
        spouseId: p.spouse ? idByKey.get(p.spouse) : null,
      },
    });
  }

  console.log(`Seeded ${people.length} family members.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
