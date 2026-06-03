// Moon phase helper based on synodic month from a known new moon.
// Reference new moon: 2000-01-06 18:14 UTC. Synodic period: 29.530588853 days.

import { useId } from "react";

const DEFAULT_DISPLAY_DATE = new Date(Date.UTC(2024, 8, 18, 12, 0, 0));

export function getMoonPhase(date: Date = new Date()) {
  const SYNODIC = 29.530588853;
  const refNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const days = (date.getTime() - refNewMoon) / 86400000;
  let phase = (days / SYNODIC) % 1;
  if (phase < 0) phase += 1;
  // 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  const names = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];
  const idx = Math.floor((phase + 1 / 16) * 8) % 8;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2; // 0..1
  return { phase, name: names[idx], illumination };
}

export function Moon({ size = 80, date = DEFAULT_DISPLAY_DATE }: { size?: number; date?: Date }) {
  const { phase, name, illumination } = getMoonPhase(date);
  const uid = useId();
  const litId = `moon-lit-${uid}`;
  const glowId = `moon-glow-${uid}`;
  const shadowId = `moon-shadow-${uid}`;

  const R = 50;
  // x-radius of the terminator ellipse
  const rx = Math.abs(Math.cos(2 * Math.PI * phase)) * R;

  // Determine which side is dark:
  // 0 -> 0.5 waxing: dark on the LEFT
  // 0.5 -> 1 waning: dark on the RIGHT
  const waxing = phase < 0.5;
  // Whether terminator curves into the dark side (gibbous) or away (crescent)
  const gibbous = illumination > 0.5;

  // Build shadow path covering the unlit portion.
  // Outer arc traces the dark half of the moon's edge; inner arc is the terminator ellipse.
  // Outer arc sweep: 0 to go around the left side, 1 to go around the right.
  const outerSweep = waxing ? 0 : 1;
  // Terminator sweep flips between crescent and gibbous to put the curve on the correct side.
  const innerSweep = gibbous ? outerSweep : 1 - outerSweep;

  const shadow = `M 0 ${-R} A ${R} ${R} 0 1 ${outerSweep} 0 ${R} A ${rx} ${R} 0 1 ${innerSweep} 0 ${-R} Z`;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${name} moon illustration`}
      title={`${name} moon illustration`}
    >
      <svg viewBox="-55 -55 110 110" className="h-full w-full" focusable="false">
        <defs>
          <radialGradient id={litId} cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="oklch(0.98 0.02 85)" />
            <stop offset="60%" stopColor="oklch(0.88 0.06 80)" />
            <stop offset="100%" stopColor="oklch(0.72 0.09 65)" />
          </radialGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="oklch(0.95 0.05 85 / 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="oklch(0.18 0.05 280 / 0.92)" />
            <stop offset="100%" stopColor="oklch(0.10 0.04 275 / 0.98)" />
          </radialGradient>
        </defs>
        {/* outer glow */}
        <circle r="54" fill={`url(#${glowId})`} />
        {/* lit disk */}
        <circle r={R} fill={`url(#${litId})`} />
        {/* subtle craters */}
        <g fill="oklch(0.6 0.05 70 / 0.18)">
          <circle cx="-14" cy="-10" r="6" />
          <circle cx="10" cy="6" r="9" />
          <circle cx="-6" cy="18" r="4" />
          <circle cx="20" cy="-18" r="3" />
        </g>
        {/* shadow for current phase */}
        {phase > 0.001 && phase < 0.999 && <path d={shadow} fill={`url(#${shadowId})`} />}
        {/* rim */}
        <circle r={R} fill="none" stroke="oklch(0.95 0.05 85 / 0.25)" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
