import { useState, useEffect, useCallback } from 'react';

const NAV_ITEMS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Work' },
  { href: '#process', label: 'Process' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Active section tracking
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = useCallback((e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  return (
    <>
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <a
          href="#hero"
          className="nav-brand"
          onClick={(e) => handleSmoothScroll(e, '#hero')}
        >
          <div className="nav-logo-mark">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 24L16 6L22 24M12.5 19H19.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="nav-name">AUREXA</span>
        </a>

        <ul className="nav-links">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={activeSection === href.slice(1) ? 'active' : ''}
                onClick={(e) => handleSmoothScroll(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="nav-cta"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
          id="hamburger"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        {[...NAV_ITEMS, { href: '#contact', label: 'Contact' }].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleSmoothScroll(e, href)}
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
