import { useEffect, useRef } from 'react';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

export default function Hero({ content, stats }) {
  const shapesRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      shapesRef.current.forEach((shape, i) => {
        if (shape) {
          const speed = (i + 1) * 0.03;
          shape.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!content) return null;

  const displayStats = stats || [
    { id: "stat-1", target: 5, suffix: "+", prefix: "", label: "Projects Completed" },
    { id: "stat-2", target: 100, suffix: "%", prefix: "", label: "Client Satisfaction" },
    { id: "stat-3", target: 2, suffix: "+", prefix: "", label: "Years Experience" }
  ];

  const statsToRender = displayStats.slice(0, 3);

  return (
    <section id="hero">
      <div className="hero-bg-pattern"></div>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="hero-float-shape"
          ref={(el) => (shapesRef.current[i] = el)}
        ></div>
      ))}

      <div className="hero-grid">
        {/* Left Card Container */}
        <div className="hero-left-card">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            {content.eyebrow}
          </div>
          <h1 className="hero-title">
            {content.titleLine1}<br />
            <span className="highlight">{content.titleHighlight}</span><br />
            {content.titleLine2}
          </h1>
          <p className="hero-subtitle">
            {content.subtitle}
          </p>
          <div className="hero-buttons">
            <a
              href="#portfolio"
              className="btn-primary-pill"
              onClick={(e) => smoothScroll(e, '#portfolio')}
            >
              View Our Work
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* 3-Column Stats Grid */}
          <div className="hero-stats-grid">
            {statsToRender.map((stat) => (
              <div key={stat.id || stat.label} className="hero-stat-card">
                <div className="hero-stat-dot-wrapper">
                  <span className="hero-stat-dot"></span>
                </div>
                <div className="hero-stat-val">
                  {stat.prefix}{stat.target}{stat.suffix}
                </div>
                <div className="hero-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card Container */}
        <div className="hero-right-card">
          <div className="hero-mockup-wrapper">
            <img
              src={content.image}
              alt="Premium website mockup by Aurexa"
              className="hero-mockup-img"
            />
            {content.statusCard1 && (
              <div className="hero-status-tag top-left-tag">
                <span className="status-dot green"></span>
                {content.statusCard1.label}: <strong>{content.statusCard1.value}</strong>
              </div>
            )}
            {content.statusCard2 && (
              <div className="hero-status-tag bottom-right-tag">
                <span className="status-dot purple"></span>
                {content.statusCard2.label}: <strong>{content.statusCard2.value}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
