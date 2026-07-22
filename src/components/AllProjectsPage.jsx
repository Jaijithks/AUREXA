import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import fallbackContent from '../data/fallbackContent';

const API_BASE = import.meta.env.PROD ? 'https://aurexa-admin.onrender.com/api' : 'http://localhost:5002/api';

const FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'business', label: 'Business' },
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'portfolio', label: 'Portfolio' },
];

export default function AllProjectsPage() {
  const [projects, setProjects] = useState(fallbackContent.projects);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && typeof data === 'object' && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to connect to backend API on AllProjectsPage, using fallback projects:', err);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    window.scrollTo(0, 0);
  }, [fetchContent]);

  const handleFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const filteredProjects = projects.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <div className="all-projects-page" style={{ padding: '80px 20px', minHeight: '100vh', background: 'var(--white)' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <Link to="/" className="btn-secondary-pill" style={{ marginBottom: '24px' }}>
              ← Go Back
            </Link>
            <h1 className="portfolio-section-title" style={{ marginTop: '16px' }}>
              All <span className="highlight">Projects</span>
            </h1>
          </div>
          <p className="portfolio-section-subtitle" style={{ maxWidth: '400px', margin: 0 }}>
            Browse our complete directory of digital creations, client collaborations, and web solutions.
          </p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters" style={{ justifyContent: 'flex-start', marginBottom: '40px' }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`filter-btn-pill ${activeFilter === key ? 'active' : ''}`}
              onClick={() => handleFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-all-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="portfolio-carousel-card"
              id={project.id}
              style={{ flex: 'none', minWidth: 'auto' }}
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

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--grey-400)' }}>
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
