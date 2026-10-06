# Deploying the Lokhandwala Family site

This is a real Next.js app — it needs a Postgres database, a place to store
photos, and a host. This guide uses Supabase (database + storage, one free
account) and Vercel (hosting, free tier, no card required). Total cost to
get started: $0.

Everything below is copy-paste. Where you see `xxxxx` or `PASSWORD`, that's
a placeholder Supabase will show you — copy the real value from your own
project.

---

## 1. Create your Supabase project

1. Go to https://supabase.com → **Start your project** → sign up (free).
2. **New project**. Pick any name (e.g. `lokhandwala-family`) and a strong
   database password — **save that password somewhere**, you'll need it below.
3. Wait ~2 minutes for the project to finish provisioning.

### Get your database connection strings
In your Supabase project: **Project Settings → Database → Connection string**.
- Copy the **"Transaction" pooler** string (port `6543`) → this is your `DATABASE_URL`.
- Copy the **direct connection** string (port `5432`) → this is your `DIRECT_URL`.
- In both, replace `[YOUR-PASSWORD]` with the database password you set in step 2.

### Get your storage keys
**Project Settings → API**:
- `Project URL` → this is `SUPABASE_URL`
- `service_role` key (under "Project API keys" — **not** the `anon` key) → this is `SUPABASE_SERVICE_ROLE_KEY`

### Create the photo storage bucket
**Storage** (left sidebar) → **New bucket** → name it exactly `family-photos` →
toggle **Public bucket** to ON → Create.

---

## 2. Set up the project locally

```bash
# unzip/open the project folder, then:
npm install
cp .env.example .env
```

Open `.env` and fill in the four values from step 1, plus pick an
`ADMIN_PASSWORD` (this is the shared password your family will use to reach
the Admin approval queue).

### Create the database tables

```bash
npx prisma migrate dev --name init
```

This reads `prisma/schema.prisma` and creates the actual tables in your
Supabase database. You'll see `FamilyMember`, `Photo`, and `Claim` appear
under **Table Editor** in the Supabase dashboard afterward.

### Load the family tree

```bash
npm run prisma:seed
```

This loads the names and relationships from `prisma/seed.ts`. Edit that
file first if you want to add/correct family members before seeding —
it's plain, readable TypeScript (see the `people` array).

### Run it locally to check everything works

```bash
npm run dev
```

Visit http://localhost:3000 — you should see the family tree. Try Claim a
Spot, upload a photo, and check http://localhost:3000/admin (your
`ADMIN_PASSWORD`) to approve it.

---

## 3. Deploy to Vercel

1. Push this project to a GitHub repo (private is fine):
   ```bash
   git init && git add . && git commit -m "Initial commit"
   # create a new repo on github.com, then:
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com → sign up with GitHub (free) → **Add New Project**
   → import your repo.
3. Before clicking Deploy, open **Environment Variables** and add the same
   five values from your `.env` file (`DATABASE_URL`, `DIRECT_URL`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`).
4. Click **Deploy**. Vercel will run `npm install` (which runs
   `prisma generate` automatically via the `postinstall` script) and then
   build the app.
5. Once it's live, Vercel gives you a URL like
   `lokhandwala-family.vercel.app` — that's your real, working site.

### Custom domain (optional)
In your Vercel project → **Settings → Domains** → add the domain you own
(e.g. `lokhandwalafamily.com`) and follow Vercel's DNS instructions (usually
just adding one or two records at your domain registrar).

---

## Ongoing use

- **Adding more family members later**: either have them use "Claim a Spot"
  and approve them via `/admin`, or edit `prisma/seed.ts` and re-run
  `npm run prisma:seed` (note: re-seeding **wipes and rebuilds** the member
  list from that file, so only do this before real photos/data pile up, or
  extend the seed script rather than re-running it once the site is live).
- **Changing the admin password**: update `ADMIN_PASSWORD` in Vercel's
  environment variables and redeploy.
- **Costs at scale**: Supabase's free tier covers a small family site
  comfortably (500MB database, 1GB file storage). If photo storage grows
  past that, Supabase's paid tier starts at $25/mo for 100GB.
