import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

function StatItem({ target, suffix, prefix, label, delay }) {
  const { ref, display } = useCountUp(target, suffix, prefix);

  return (
    <div className={`stat-item reveal reveal-delay-${delay}`} ref={ref}>
      <div className="stat-value" dangerouslySetInnerHTML={{ __html: display.replace(suffix, `<span>${suffix}</span>`) }} />
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function About({ content }) {
  const visualRef = useScrollReveal();
  const contentRef = useScrollReveal();

  if (!content) return null;

  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-visual reveal-left" ref={visualRef}>
          <div className="about-image-wrap">
            <img
              src={content.image}
              alt="Aurexa team at work designing websites"
            />
          </div>
          <div className="about-badge">
            <span className="about-badge-num">5+</span>
            <span className="about-badge-text">
              Projects<br />Completed
            </span>
          </div>
        </div>

        <div className="about-content reveal-right" ref={contentRef}>
          <div className="section-label">{content.sectionLabel}</div>
          <h2 className="about-title">
            {content.titleLine1}<br />
            We&apos;re Your <span className="highlight">{content.titleHighlight}</span>
          </h2>
          <p className="about-desc">{content.desc1}</p>
          <p className="about-desc">{content.desc2}</p>
          <div className="about-cta">
            <a
              href="#contact"
              className="btn-primary"
              onClick={(e) => smoothScroll(e, '#contact')}
            >
              Learn More
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

          <div className="about-stats">
            {content.stats?.map((stat, i) => (
              <StatItem
                key={stat.id}
                target={stat.target}
                suffix={stat.suffix}
                prefix={stat.prefix}
                label={stat.label}
                delay={i + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
