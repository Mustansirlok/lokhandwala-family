# Lokhandwala Family

A real, deployable family lineage website — interactive tree canvas, a
full-body illustrated avatar builder, per-member photo galleries, and a
"Claim a Spot" onboarding flow with admin approval.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Prisma** + **Postgres** (via Supabase)
- **Supabase Storage** for photos
- Simple shared-password gate for the `/admin` queue (no user accounts)

## First-time setup
See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide (Supabase
project, environment variables, and deploying to Vercel).

Quick local version, once `.env` is filled in:
```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Project structure
```
prisma/schema.prisma       Database schema (FamilyMember, Photo, Claim)
prisma/seed.ts             Family tree data — edit this to add/correct members
src/app/                   Pages (canvas, claim, atelier, admin) + API routes
src/components/            UI, including the avatar SVG engine under avatar/
src/lib/                   Shared constants, theme tokens, DB/storage clients
src/hooks/useFamilyMembers.ts   Client-side data fetching + mutations
```

## Editing the avatar options
All hairstyles, skin tones, attire, and accessories are defined in
`src/lib/avatarOptions.ts`. The actual SVG shapes live in
`src/components/avatar/` (`hair.tsx`, `garments.tsx`,
`AvatarPortrait.tsx`) — add a new option to the list in `avatarOptions.ts`
and a matching `case` in the relevant render function.
