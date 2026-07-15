import { useState, useCallback } from 'react';
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business' },
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'landing', label: 'Landing Page' },
];

export default function Portfolio({ projects }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const headerRef = useScrollReveal();
  const filtersRef = useScrollReveal();
  const itemRef = useScrollRevealMultiple();
  const ctaRef = useScrollReveal();

  const handleFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const projectList = projects || [];

  const filteredProjects = projectList.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <section id="portfolio">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">04. Work / Portfolio</div>
        <h2 className="section-title">
          Featured <span className="highlight">Works</span>
        </h2>
        <p className="section-subtitle">
          Some of the websites I&apos;ve designed &amp; developed. Each project is
          crafted with precision and purpose.
        </p>
      </div>

      <div className="portfolio-filters reveal" ref={filtersRef}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
            data-filter={key}
            id={`filter-${key}`}
            onClick={() => handleFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredProjects.map((project, i) => (
          <div
            key={project.id}
            className={`portfolio-item reveal reveal-delay-${(i % 3) + 1}`}
            data-category={project.category}
            id={project.id}
            ref={itemRef}
          >
            <img src={project.image} alt={`${project.name} — ${project.type} designed by Aurexa`} />
            <div className="portfolio-overlay">
              <span className="portfolio-tag">{project.tag}</span>
              <h3 className="portfolio-name">{project.name}</h3>
              <p className="portfolio-type">{project.type}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="portfolio-cta-row reveal" ref={ctaRef}>
        <a
          href="#contact"
          className="btn-secondary"
          style={{ marginTop: '20px' }}
          onClick={(e) => smoothScroll(e, '#contact')}
        >
          View All Projects
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
