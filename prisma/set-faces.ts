/**
 * One-off: gives every EXISTING family member their cartoon face (and starting
 * outfit) without wiping any data, photos, claims or details.
 *
 *   npx tsx prisma/set-faces.ts            → face + starting outfit
 *   npx tsx prisma/set-faces.ts --faces-only → face only, keeps current outfits
 *
 * Members are matched on name + generation (that pair is unique in the tree).
 * Anyone not in src/lib/faces.ts (e.g. newly approved claims) is left alone.
 */
import { PrismaClient } from "@prisma/client";
import { FACES } from "../src/lib/faces";

const prisma = new PrismaClient();
const facesOnly = process.argv.includes("--faces-only");

async function main() {
  let updated = 0;
  const missing: string[] = [];
  for (const [key, entry] of Object.entries(FACES)) {
    const member = await prisma.familyMember.findFirst({ where: { name: entry.name, gen: entry.gen } });
    if (!member) { missing.push(`${entry.name} (gen ${entry.gen})`); continue; }
    const current = (member.avatar as any) || {};
    const next = facesOnly
      ? { ...current, gender: entry.outfit.gender, face: entry.face }
      : { ...current, ...entry.outfit, face: entry.face };
    await prisma.familyMember.update({ where: { id: member.id }, data: { avatar: next as any } });
    updated++;
    console.log(`✓ ${entry.name} (${key})`);
  }
  console.log(`\nUpdated ${updated} members.${missing.length ? " Not found: " + missing.join(", ") : ""}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
