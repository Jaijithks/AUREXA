import { useState, useCallback, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const smoothScroll = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
};

const FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'business', label: 'Business' },
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'portfolio', label: 'Portfolio' },
];

export default function Portfolio({ projects }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const carouselRef = useRef(null);
  const headerRef = useScrollReveal();
  const filtersRef = useScrollReveal();

  const handleFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const projectList = projects || [];

  const filteredProjects = projectList.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter
  );

  const scrollLeft = () => {
    if (carouselRef.current) {
      // scroll by the width of one card plus gap (approx 340px)
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio">
      <div className="section-label-container">
        <span className="section-label">04. Work / Portfolio</span>
      </div>

      {/* Split Header layout */}
      <div className="portfolio-header reveal" ref={headerRef}>
        <div className="portfolio-header-left">
          <h2 className="portfolio-section-title">
            Featured <span className="highlight">Works</span>
          </h2>
        </div>
        <div className="portfolio-header-right">
          <p className="portfolio-section-subtitle">
            A curated showcase of bespoke websites and digital platforms crafted to transform brand presence and maximize business growth.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="portfolio-filters reveal" ref={filtersRef}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-btn-pill ${activeFilter === key ? 'active' : ''}`}
            data-filter={key}
            id={`filter-${key}`}
            onClick={() => handleFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Snap Scroll Carousel */}
      <div className="portfolio-carousel-wrapper">
        <div className="portfolio-carousel-track" ref={carouselRef}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="portfolio-carousel-card"
              id={project.id}
            >
              <img
                src={project.image}
                alt={`${project.name} — ${project.type}`}
                className="portfolio-card-img"
              />
              <div className="portfolio-card-overlay">
                <span className="portfolio-card-tag">{project.tag}</span>
                <h3 className="portfolio-card-name">{project.name}</h3>
                <p className="portfolio-card-type">{project.type}</p>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-card-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Navigation and CTA bottom row */}
      <div className="portfolio-bottom-controls">
        <div className="controls-left">
          <a
            href="#contact"
            className="btn-primary-pill"
            onClick={(e) => smoothScroll(e, '#contact')}
          >
            Start a Project ↗
          </a>
        </div>
        <div className="controls-right">
          <button
            className="carousel-arrow-btn"
            onClick={scrollLeft}
            aria-label="Previous Project"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="carousel-arrow-btn"
            onClick={scrollRight}
            aria-label="Next Project"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
