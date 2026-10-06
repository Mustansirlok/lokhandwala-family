"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Lock } from "lucide-react";
import { IRIS, ROSE, IRIS_LIGHT, TEXT_PRIMARY, TEXT_TERTIARY, TEXT_SECONDARY, GLASS_BORDER, HAIRLINE, FONT } from "@/lib/theme";
import { SegmentedControl, CountChip } from "./Glass";

const TABS = [
  { id: "/", label: "Canvas" },
  { id: "/claim", label: "Claim a Spot" },
  { id: "/atelier", label: "Atelier" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    fetch("/api/claims/count")
      .then((r) => r.json())
      .then((d) => setQueueCount(d.count || 0))
      .catch(() => {});
  }, [pathname]);

  const activeTab = TABS.some((t) => t.id === pathname) ? pathname : "/";
  const onAdmin = pathname.startsWith("/admin");

  return (
    <header style={{ position: "relative", zIndex: 10, background: "rgba(11,11,14,0.7)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: `1px solid ${HAIRLINE}`, flexShrink: 0 }}>
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${IRIS}, ${ROSE})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Users size={16} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.02em", color: TEXT_PRIMARY, lineHeight: 1.1 }}>Lokhandwala</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: TEXT_TERTIARY, letterSpacing: "-0.005em" }}>Family Lineage</div>
          </div>
        </Link>

        <SegmentedControl options={TABS} value={activeTab} onChange={(id) => router.push(id)} />

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="obsidian-btn flex items-center gap-1.5 px-3 py-2"
          style={{
            border: `1px solid ${onAdmin ? IRIS : GLASS_BORDER}`,
            background: onAdmin ? "rgba(139,92,246,0.16)" : "rgba(255,255,255,0.04)",
            color: onAdmin ? IRIS_LIGHT : TEXT_SECONDARY,
            borderRadius: 12, fontFamily: FONT, fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}
          title="Admin only"
        >
          <Lock size={11} />
          Admin
          {queueCount > 0 && <CountChip n={queueCount} />}
        </button>
      </div>
    </header>
  );
}
