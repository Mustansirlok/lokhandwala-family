/**
 * One-off correction of two birth years in the LIVE database, without re-seeding
 * (re-seeding would wipe photos and approved members).
 *   Maria Arsiwala  -> born 1999
 *   Abdeali Arsiwala -> born 1993
 * Run once:  npx tsx prisma/fix-ages.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fixes = [
  { name: "Maria Arsiwala", birthYear: 1999 },
  { name: "Abdeali Arsiwala", birthYear: 1993 },
];

async function main() {
  for (const f of fixes) {
    const rows = await prisma.familyMember.findMany({ where: { name: f.name }, select: { id: true, birthYear: true } });
    if (rows.length !== 1) {
      console.log(`Skipped "${f.name}": expected exactly 1 match, found ${rows.length}.`);
      continue;
    }
    await prisma.familyMember.update({ where: { id: rows[0].id }, data: { birthYear: f.birthYear } });
    console.log(`${f.name}: ${rows[0].birthYear ?? "none"} -> ${f.birthYear}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
