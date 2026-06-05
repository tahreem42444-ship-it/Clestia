type Star = {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  opacity: string;
  animated: boolean;
};

function seededRatio(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function buildStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${(seededRatio(i + 1) * 100).toFixed(3)}%`,
    left: `${(seededRatio(i + 17) * 100).toFixed(3)}%`,
    size: `${(seededRatio(i + 31) * 1.2 + 0.5).toFixed(3)}px`,
    delay: `${(seededRatio(i + 47) * 4).toFixed(3)}s`,
    duration: `${(5 + seededRatio(i + 63) * 5).toFixed(3)}s`,
    opacity: (0.3 + seededRatio(i + 79) * 0.45).toFixed(3),
    animated: i % 3 === 0,
  }));
}

export function StarField({ count = 30 }: { count?: number }) {
  const stars = buildStars(count);

  return (
    <div
      aria-hidden="true"
      className="star-field pointer-events-none absolute inset-0 overflow-hidden"
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className={
            star.animated
              ? "absolute rounded-full bg-ivory animate-twinkle"
              : "absolute rounded-full bg-ivory"
          }
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
