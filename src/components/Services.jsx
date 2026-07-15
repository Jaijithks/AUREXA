import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

const ICON_MAP = {
  design: (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  dev: (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  responsive: (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  maintenance: (
    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

export default function Services({ services }) {
  const headerRef = useScrollReveal();
  const cardRef = useScrollRevealMultiple();
  const ctaRef = useScrollReveal();

  const serviceList = services || [];

  return (
    <section id="services">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">03. Services</div>
        <h2 className="section-title">
          Services <span className="highlight">I Offer</span>
        </h2>
        <p className="section-subtitle">
          End-to-end web solutions tailored to your business needs. From design
          to deployment, we&apos;ve got you covered.
        </p>
      </div>

      <div className="services-grid">
        {serviceList.map((service, i) => (
          <div
            key={service.id}
            className={`service-card reveal reveal-delay-${(i % 4) + 1}`}
            ref={cardRef}
          >
            <div className="service-icon">
              {ICON_MAP[service.iconType] || ICON_MAP.design}
            </div>
            <h3 className="service-name">{service.name}</h3>
            <p className="service-desc">{service.desc}</p>
          </div>
        ))}
      </div>

      <div className="services-cta-row reveal" ref={ctaRef}>
        <a
          href="#contact"
          className="btn-primary"
          onClick={(e) => smoothScroll(e, '#contact')}
        >
          Let&apos;s Work Together
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
}
