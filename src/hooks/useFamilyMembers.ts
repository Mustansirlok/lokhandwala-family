"use client";
import { useCallback, useEffect, useState } from "react";
import type { AvatarConfig, FamilyMemberDTO } from "@/lib/avatarOptions";
import { resizeImageFile } from "@/lib/resizeImage";

// Survives page changes (client-side navigation), so switching tabs shows
// the tree instantly instead of flashing "could not load".
let cachedMembers: FamilyMemberDTO[] | null = null;

async function fetchMembersWithRetry(attempts = 4): Promise<FamilyMemberDTO[]> {
  let lastErr = "Could not load the family tree";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return data.members as FamilyMemberDTO[];
      }
      const body = await res.json().catch(() => ({}));
      lastErr = body.error || `Server returned ${res.status}`;
    } catch (e: any) {
      lastErr = e?.message || lastErr;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  throw new Error(lastErr);
}

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMemberDTO[]>(cachedMembers ?? []);
  const [loading, setLoading] = useState(!cachedMembers);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchMembersWithRetry();
      cachedMembers = data;
      setMembers(data);
      setError(null);
    } catch (e: any) {
      if (!cachedMembers) setError(e.message || "Something went wrong loading the family tree");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  useEffect(() => { if (members.length) cachedMembers = members; }, [members]);

  const saveAvatar = useCallback(async (id: string, avatar: AvatarConfig) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, avatar } : m))); // optimistic
    const res = await fetch(`/api/members/${id}/avatar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar }),
    });
    if (!res.ok) {
      await refetch();
      throw new Error("Couldn't save that avatar — please try again.");
    }
  }, [refetch]);

  const addPhoto = useCallback(async (id: string, file: File) => {
    const blob = await resizeImageFile(file);
    const form = new FormData();
    form.append("file", blob, "photo.jpg");
    const res = await fetch(`/api/members/${id}/photos`, { method: "POST", body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Photo upload failed (server returned ${res.status})`);
    }
    const { photo } = await res.json();
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, photos: [...m.photos, photo] } : m)));
    return photo;
  }, []);

  return { members, loading, error, refetch, saveAvatar, addPhoto };
}
