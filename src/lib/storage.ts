import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client. SUPABASE_SERVICE_ROLE_KEY must never be exposed to
// the browser — it is only read here, inside API routes that run on the
// server, and this file is never imported from a "use client" component.
let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Storage upload failed: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from the server environment (.env)"
    );
  }
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

const BUCKET = "family-photos";

/**
 * Uploads a photo buffer to the "family-photos" bucket under a
 * per-entity folder (a member id or a pending claim id), and returns its
 * public URL.
 */
export async function uploadPhoto(entityId: string, file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const path = `${entityId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await getClient().storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = getClient().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Deletes a photo given its full public URL (used when a claim is declined or a member removed). */
export async function deletePhoto(publicUrl: string): Promise<void> {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  await getClient().storage.from(BUCKET).remove([path]);
}
