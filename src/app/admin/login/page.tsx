"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { GlassPanel, GlassButton } from "@/components/Glass";
import { TextField } from "@/components/FormFields";
import { OBSIDIAN, IRIS_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, FONT } from "@/lib/theme";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Incorrect password");
      }
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4" style={{ background: OBSIDIAN }}>
      <GlassPanel style={{ width: "100%", maxWidth: 360, padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(139,92,246,0.16)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Lock size={19} color={IRIS_LIGHT} />
        </div>
        <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_PRIMARY }}>Admin Access</h1>
        <p style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT_SECONDARY, marginTop: 4, marginBottom: 20 }}>Enter the shared admin password to review pending claims.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <TextField label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          {error && <div style={{ fontFamily: FONT, fontSize: 12, color: "#F87171" }}>{error}</div>}
          <GlassButton type="submit" variant="primary" disabled={busy || !password}>{busy ? "Checking…" : "Enter"}</GlassButton>
        </form>
      </GlassPanel>
    </div>
  );
}
