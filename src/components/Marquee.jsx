const MARQUEE_ITEMS = [
  'Modern Design',
  'Clean & Creative',
  'Responsive',
  'All Devices',
  'Fast Performance',
  'Optimized Speed',
  'SEO Friendly',
  'Rank Higher',
];

export default function Marquee() {
  // Double the items for seamless infinite scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span className="marquee-item" key={i}>
            <span className="dot"></span> {text}
          </span>
        ))}
      </div>
    </div>
  );
}
