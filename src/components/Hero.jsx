import { useEffect, useRef } from 'react';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

export default function Hero({ content }) {
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

  return (
    <section id="hero">
      <div className="hero-bg-pattern"></div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="hero-float-shape"
          ref={(el) => (shapesRef.current[i] = el)}
        ></div>
      ))}

      <div className="hero-grid">
        <div className="hero-content">
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
              className="btn-primary"
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
            <a
              href="#contact"
              className="btn-secondary"
              onClick={(e) => smoothScroll(e, '#contact')}
            >
              Contact Us
            </a>
          </div>

          <div className="hero-badges">
            <div className="hero-badge">
              <div className="hero-badge-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              Modern Design
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              Fast Performance
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              SEO Friendly
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-mockup-container">
            <img
              src={content.image}
              alt="Premium website mockup by Aurexa"
              className="hero-mockup"
            />
            {content.statusCard1 && (
              <div className="hero-float-card">
                <div className="card-icon green">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
                    {content.statusCard1.label}
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>
                    {content.statusCard1.value}
                  </div>
                </div>
              </div>
            )}
            {content.statusCard2 && (
              <div className="hero-float-card">
                <div className="card-icon purple">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
                    {content.statusCard2.label}
                  </div>
                  <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: '14px' }}>
                    {content.statusCard2.value}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
