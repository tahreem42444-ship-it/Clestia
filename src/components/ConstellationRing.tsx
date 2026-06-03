import { useId } from "react";
import { Moon } from "./Moon";

// Constant outside component to avoid array recreation on every render.
const ZODIAC_SYMBOLS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
] as const;
const RING_RADIUS = 110;

export function ConstellationRing({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ringGlowId = `ring-glow-${uid}`;

  return (
    <div
      className={className.includes("absolute") ? className : `relative ${className}`}
      aria-hidden="true"
    >
      {/* Spinning zodiac ring */}
      <div className="absolute inset-0 animate-spin-slow">
        <svg viewBox="-130 -130 260 260" className="block h-full w-full" focusable="false">
          <defs>
            <radialGradient id={ringGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.25" />
            </radialGradient>
          </defs>
          <circle
            r={RING_RADIUS}
            fill="none"
            stroke="var(--gold)"
            strokeOpacity="0.35"
            strokeWidth="0.5"
          />
          <circle
            r={RING_RADIUS - 14}
            fill="none"
            stroke="var(--gold)"
            strokeOpacity="0.15"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
          <circle r={RING_RADIUS + 18} fill={`url(#${ringGlowId})`} />
          {ZODIAC_SYMBOLS.map((s, i) => {
            const a = (i / ZODIAC_SYMBOLS.length) * Math.PI * 2 - Math.PI / 2;
            const x = (Math.cos(a) * RING_RADIUS).toFixed(3);
            const y = (Math.sin(a) * RING_RADIUS).toFixed(3);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--gold)"
                fillOpacity="0.7"
                fontSize="11"
              >
                {s}
              </text>
            );
          })}
        </svg>
      </div>
      {/* Backlight / Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.13_85/0.32)_0%,transparent_70%)] blur-md animate-pulse-slow" />
      {/* Centered moon */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="animate-float">
          <Moon size={112} />
        </div>
      </div>
    </div>
  );
}
