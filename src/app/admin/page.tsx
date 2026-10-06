"use client";
import { useRouter } from "next/navigation";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import AdminQueue from "@/components/AdminQueue";
import { GlassButton } from "@/components/Glass";
import { TEXT_SECONDARY, FONT } from "@/lib/theme";

export default function AdminPage() {
  const { members, loading, error, refetch } = useFamilyMembers();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>Loading…</div>;
  if (error) return <div className="h-full flex items-center justify-center" style={{ fontFamily: FONT, color: TEXT_SECONDARY, fontSize: 13 }}>{error}</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end px-4 sm:px-6 pt-3">
        <GlassButton variant="subtle" onClick={logout}>Log out of Admin</GlassButton>
      </div>
      <div className="flex-1 min-h-0">
        <AdminQueue members={members} onApproved={refetch} />
      </div>
    </div>
  );
}
