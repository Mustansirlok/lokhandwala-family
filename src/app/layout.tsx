import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import AmbientGlow from "@/components/AmbientGlow";

export const metadata: Metadata = {
  title: "Lokhandwala Family",
  description: "The Lokhandwala family lineage, in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0B0B0E", color: "rgba(255,255,255,0.92)", height: "100vh", overflow: "hidden", margin: 0 }}>
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
          <AmbientGlow />
          <AppHeader />
          <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>{children}</div>
        </div>
      </body>
    </html>
  );
}
