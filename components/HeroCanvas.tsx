"use client";

import { useEffect, useRef } from "react";

const AREA_LABELS = [
  "Kuwait City", "Salmiya", "Hawally", "Farwaniya", "Jahra",
  "Ahmadi", "Fahaheel", "Mangaf", "Mishref", "Rumaithiya",
  "Jabriya", "Shuwaikh", "Fintas", "Mahboula", "Jleeb",
  "Khaitan", "Salwa", "Wafra", "Sabah Al Salem", "Sulaibikhat",
];

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number;
  label: string;
  labelTimer: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let rafId: number;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 38;
    const FOV = 700;
    const CONNECT_DIST = 260;

    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * W * 1.4,
      y: (Math.random() - 0.5) * H * 1.4,
      z: Math.random() * 900 + 100,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      vz: (Math.random() - 0.5) * 0.35,
      r: 2 + Math.random() * 2.5,
      label: AREA_LABELS[i % AREA_LABELS.length],
      labelTimer: Math.random() * 200,
    }));

    function project(x: number, y: number, z: number) {
      const s = FOV / (FOV + z);
      return { px: x * s + W / 2, py: y * s + H / 2, s };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Vignette background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#10141f");
      bg.addColorStop(1, "#070910");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Move
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.labelTimer++;

        const hw = W * 0.75, hh = H * 0.75;
        if (Math.abs(p.x) > hw) p.vx *= -1;
        if (Math.abs(p.y) > hh) p.vy *= -1;
        if (p.z < 80 || p.z > 1000) p.vz *= -1;
      });

      const sorted = [...particles].sort((a, b) => b.z - a.z);

      // Edges
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i], b = sorted[j];
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d3 > CONNECT_DIST) continue;

          const pa = project(a.x, a.y, a.z);
          const pb = project(b.x, b.y, b.z);
          const alpha = (1 - d3 / CONNECT_DIST) * 0.22 * Math.min(pa.s, pb.s);

          ctx.beginPath();
          ctx.moveTo(pa.px, pa.py);
          ctx.lineTo(pb.px, pb.py);
          ctx.strokeStyle = `rgba(91,140,255,${alpha})`;
          ctx.lineWidth = pa.s * 0.8;
          ctx.stroke();
        }
      }

      // Nodes
      sorted.forEach((p) => {
        const { px, py, s } = project(p.x, p.y, p.z);
        if (px < -60 || px > W + 60 || py < -60 || py > H + 60) return;

        const r = p.r * s * 2.8;
        const alpha = 0.35 + s * 0.65;

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5);
        grd.addColorStop(0, `rgba(91,140,255,${alpha * 0.25})`);
        grd.addColorStop(1, "rgba(91,140,255,0)");
        ctx.beginPath();
        ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91,140,255,${alpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(150,190,255,${alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Label — show for close nodes
        if (s > 0.72 && (p.labelTimer % 340) < 160) {
          ctx.font = `${Math.round(9 * s)}px var(--font-sora, sans-serif)`;
          ctx.fillStyle = `rgba(160,185,230,${Math.min(alpha * 0.85, 0.7)})`;
          ctx.textAlign = "center";
          ctx.fillText(p.label, px, py + r * 2 + 8 * s);
        }
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
