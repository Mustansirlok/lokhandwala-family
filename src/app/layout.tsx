import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import AmbientGlow from "@/components/AmbientGlow";

export const metadata: Metadata = {
  title: "Lokhandwala Family",
  description: "The Lokhandwala family lineage, in one place.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // stops iOS zooming the whole page when a field is focused or the canvas is pinched
  viewportFit: "cover", // lets us use the full screen on notched iPhones
  themeColor: "#0B0B0E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body" style={{ background: "#0B0B0E", color: "rgba(255,255,255,0.92)", margin: 0 }}>
        <div className="app-shell" style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <AmbientGlow />
          <AppHeader />
          <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>{children}</div>
        </div>
      </body>
    </html>
  );
}
