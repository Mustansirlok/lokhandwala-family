import { IRIS, ROSE } from "@/lib/theme";

export default function AmbientGlow() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: IRIS, opacity: 0.09, filter: "blur(120px)" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-5%", width: 480, height: 480, borderRadius: "50%", background: ROSE, opacity: 0.07, filter: "blur(130px)" }} />
    </div>
  );
}
