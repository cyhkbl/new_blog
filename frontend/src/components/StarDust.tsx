const STAR_COUNT = 18;
const stars = Array.from({ length: STAR_COUNT }, (_, id) => ({
  id,
  left: `${(id * 37) % 100}%`,
  top: `${(id * 19) % 100}%`,
  delay: `${(id % 7) * 0.7}s`,
  duration: `${10 + (id % 5) * 3}s`,
}));

export default function StarDust() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star-dust"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
