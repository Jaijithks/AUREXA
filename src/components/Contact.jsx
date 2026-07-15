import { useState, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact({ contact }) {
  const [formState, setFormState] = useState('idle'); // idle | sending | success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const labelRef1 = useScrollReveal();
  const titleRef = useScrollReveal();
  const descRef = useScrollReveal();
  const detail1Ref = useScrollReveal();
  const detail2Ref = useScrollReveal();
  const detail3Ref = useScrollReveal();
  const socialsRef = useScrollReveal();
  const formRef = useScrollReveal();

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setFormState('sending');

      setTimeout(() => {
        setFormState('success');

        setTimeout(() => {
          setFormState('idle');
          setFormData({ name: '', email: '', projectType: '', message: '' });
        }, 2500);
      }, 1500);
    },
    []
  );

  const contactData = contact || {};
  const socials = contactData.socials || {};

  return (
    <section id="contact">
      <div className="contact-grid">
        <div className="contact-info">
          <div className="section-label reveal" ref={labelRef1}>
            06. Contact
          </div>
          <h2 className="contact-title reveal" ref={titleRef}>
            Let&apos;s Start Your<br />
            <span className="highlight">Next Project</span>
          </h2>
          <p className="contact-desc reveal" ref={descRef}>
            Have a project in mind? Let&apos;s create something awesome together.
            Reach out and let&apos;s discuss your ideas.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item reveal" ref={detail1Ref}>
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-value">{contactData.email}</span>
              </div>
            </div>

            <div className="contact-detail-item reveal" ref={detail2Ref}>
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-value">{contactData.phone}</span>
              </div>
            </div>

            <div className="contact-detail-item reveal" ref={detail3Ref}>
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Location</span>
                <span className="contact-detail-value">{contactData.location}</span>
              </div>
            </div>
          </div>

          <div className="contact-socials reveal" ref={socialsRef}>
            <a href={socials.instagram || '#'} className="social-link" aria-label="Instagram" id="social-instagram">
              <svg viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a href={socials.github || '#'} className="social-link" aria-label="GitHub" id="social-github">
              <svg viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href={socials.twitter || '#'} className="social-link" aria-label="Twitter / X" id="social-twitter">
              <svg viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={socials.linkedin || '#'} className="social-link" aria-label="LinkedIn" id="social-linkedin">
              <svg viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="contact-form-wrap reveal-right" ref={formRef}>
          <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type</label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select project type
                </option>
                <option value="business">Business Website</option>
                <option value="ecommerce">E-Commerce Store</option>
                <option value="portfolio">Portfolio Site</option>
                <option value="landing">Landing Page</option>
                <option value="redesign">Website Redesign</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                placeholder="Tell us about your project..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className={`btn-submit ${formState === 'success' ? 'success' : ''}`}
              id="submitBtn"
              disabled={formState !== 'idle'}
              style={formState === 'sending' ? { opacity: 0.7 } : {}}
            >
              <span>
                {formState === 'idle' && 'Send Message'}
                {formState === 'sending' && 'Sending...'}
                {formState === 'success' && '✓ Message Sent!'}
              </span>
              {formState === 'idle' && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
