"use client";

import { useRouter } from "next/navigation";
import HeroCanvas from "@/components/HeroCanvas";

export default function Landing() {
  const router = useRouter();

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#070910",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <HeroCanvas />

      {/* Content overlay */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        textAlign: "center",
        padding: "0 24px",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid rgba(91,140,255,0.25)",
          background: "rgba(91,140,255,0.08)",
          fontSize: 11,
          fontWeight: 600,
          color: "#7eaaff",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#5b8cff",
            boxShadow: "0 0 6px rgba(91,140,255,0.8)",
          }} />
          Data Structures Visualizer
        </div>

        {/* Title */}
        <div>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#e4e9f5",
            margin: 0,
          }}>
            Kuwait Route
          </h1>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            background: "linear-gradient(135deg, #5b8cff 0%, #9b7cff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}>
            Planner
          </h1>
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(14px, 1.8vw, 17px)",
          color: "#566080",
          maxWidth: 420,
          lineHeight: 1.65,
          margin: 0,
        }}>
          Watch Dijkstra and A* find shortest paths across 24 Kuwait areas — step by step, in real time.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/visualizer")}
          style={{
            padding: "14px 36px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #5b8cff 0%, #7b6cef 100%)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-sora), sans-serif",
            letterSpacing: "-0.01em",
            cursor: "pointer",
            boxShadow: "0 0 32px rgba(91,140,255,0.35), 0 4px 16px rgba(0,0,0,0.4)",
            transition: "opacity 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "0.88";
            (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "1";
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          Start Exploring →
        </button>

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: 36,
          marginTop: 8,
        }}>
          {[
            { value: "24", label: "Areas" },
            { value: "41", label: "Roads" },
            { value: "2", label: "Algorithms" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#e4e9f5",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}>{value}</div>
              <div style={{ fontSize: 11, color: "#566080", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
