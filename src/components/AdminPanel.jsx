import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = 'http://localhost:5002/api';

const PREDEFINED_ICONS = [
  { value: 'design', label: 'Design (Pencil/Brush)' },
  { value: 'dev', label: 'Development (Code Brackets)' },
  { value: 'responsive', label: 'Responsive (Mobile Phone)' },
  { value: 'maintenance', label: 'Maintenance (Gear)' },
];

export default function AdminPanel({ content, onUpdate, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [heroForm, setHeroForm] = useState({
    eyebrow: '',
    titleLine1: '',
    titleHighlight: '',
    titleLine2: '',
    subtitle: '',
    image: '',
    statusCard1: { label: '', value: '' },
    statusCard2: { label: '', value: '' },
  });

  const [aboutForm, setAboutForm] = useState({
    sectionLabel: '',
    titleLine1: '',
    titleHighlight: '',
    desc1: '',
    desc2: '',
    image: '',
    stats: [],
  });

  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    location: '',
    socials: { instagram: '', github: '', twitter: '', linkedin: '' },
  });

  const [newProject, setNewProject] = useState({
    name: '',
    category: 'business',
    tag: '',
    type: '',
    image: '',
  });

  const [newService, setNewService] = useState({
    name: '',
    desc: '',
    iconType: 'design',
  });

  // Load content into forms when content changes
  useEffect(() => {
    if (content) {
      if (content.hero) setHeroForm({ ...content.hero });
      if (content.about) setAboutForm({ ...content.about });
      if (content.contact) {
        setContactForm({
          email: content.contact.email || '',
          phone: content.contact.phone || '',
          location: content.contact.location || '',
          socials: {
            instagram: content.contact.socials?.instagram || '',
            github: content.contact.socials?.github || '',
            twitter: content.contact.socials?.twitter || '',
            linkedin: content.contact.socials?.linkedin || '',
          },
        });
      }
    }
  }, [content]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const fullUrl = `http://localhost:5002${data.url}`;
        if (type === 'hero') {
          setHeroForm((prev) => ({ ...prev, image: fullUrl }));
        } else if (type === 'about') {
          setAboutForm((prev) => ({ ...prev, image: fullUrl }));
        } else if (type === 'project') {
          setNewProject((prev) => ({ ...prev, image: fullUrl }));
        }
        showNotification('Image uploaded successfully');
      } else {
        showNotification(data.message || 'Upload failed', true);
      }
    } catch (err) {
      showNotification('Failed to connect to backend', true);
    } finally {
      setIsUploading(false);
    }
  };

  // Save Hero contents
  const saveHero = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: heroForm }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        showNotification('Hero section saved successfully');
      } else {
        showNotification('Failed to save Hero section', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Save About contents
  const saveAbout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about: aboutForm }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        showNotification('About section saved successfully');
      } else {
        showNotification('Failed to save About section', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Save Contact contents
  const saveContact = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: contactForm }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        showNotification('Contact details saved successfully');
      } else {
        showNotification('Failed to save Contact details', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Add new service
  const addService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        setNewService({ name: '', desc: '', iconType: 'design' });
        showNotification('Service added successfully');
      } else {
        showNotification('Failed to add service', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Delete service
  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        showNotification('Service deleted successfully');
      } else {
        showNotification('Failed to delete service', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Add new project
  const addProject = async (e) => {
    e.preventDefault();
    if (!newProject.image) {
      showNotification('Please upload an image first', true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        setNewProject({ name: '', category: 'business', tag: '', type: '', image: '' });
        showNotification('Project added successfully');
      } else {
        showNotification('Failed to add project', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        showNotification('Project deleted successfully');
      } else {
        showNotification('Failed to delete project', true);
      }
    } catch (err) {
      showNotification('Server communication error', true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay" style={styles.overlay}>
      <div className="admin-sidebar" style={styles.sidebar}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <svg style={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Aurexa Dashboard</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {/* Tab Headers */}
        <div style={styles.tabs}>
          {['hero', 'about', 'services', 'projects', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab ? styles.activeTabBtn : {}),
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Success/Error Toast */}
        {successMsg && <div style={styles.successToast}>{successMsg}</div>}
        {errorMsg && <div style={styles.errorToast}>{errorMsg}</div>}

        {/* Tab Body */}
        <div style={styles.tabBody}>
          {/* 1. HERO TAB */}
          {activeTab === 'hero' && (
            <form onSubmit={saveHero} style={styles.form}>
              <h3>Hero Settings</h3>
              <div style={styles.formGroup}>
                <label>Eyebrow Tagline</label>
                <input
                  type="text"
                  value={heroForm.eyebrow}
                  onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Title Line 1</label>
                <input
                  type="text"
                  value={heroForm.titleLine1}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Highlight Title</label>
                <input
                  type="text"
                  value={heroForm.titleHighlight}
                  onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Title Line 2</label>
                <input
                  type="text"
                  value={heroForm.titleLine2}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Subtitle / Pitch</label>
                <textarea
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Mockup Image URL or File Upload</label>
                <div style={styles.uploadRow}>
                  <input
                    type="text"
                    value={heroForm.image}
                    onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <label style={styles.fileLabel}>
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label>Status Card 1 (Value)</label>
                  <input
                    type="text"
                    value={heroForm.statusCard1?.value || ''}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        statusCard1: { ...heroForm.statusCard1, value: e.target.value },
                      })
                    }
                    style={styles.input}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label>Status Card 2 (Value)</label>
                  <input
                    type="text"
                    value={heroForm.statusCard2?.value || ''}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        statusCard2: { ...heroForm.statusCard2, value: e.target.value },
                      })
                    }
                    style={styles.input}
                  />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Save Hero Settings</button>
            </form>
          )}

          {/* 2. ABOUT TAB */}
          {activeTab === 'about' && (
            <form onSubmit={saveAbout} style={styles.form}>
              <h3>About Settings</h3>
              <div style={styles.formGroup}>
                <label>Section Label</label>
                <input
                  type="text"
                  value={aboutForm.sectionLabel}
                  onChange={(e) => setAboutForm({ ...aboutForm, sectionLabel: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Title Text</label>
                <input
                  type="text"
                  value={aboutForm.titleLine1}
                  onChange={(e) => setAboutForm({ ...aboutForm, titleLine1: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Highlight Title</label>
                <input
                  type="text"
                  value={aboutForm.titleHighlight}
                  onChange={(e) => setAboutForm({ ...aboutForm, titleHighlight: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Paragraph Description 1</label>
                <textarea
                  value={aboutForm.desc1}
                  onChange={(e) => setAboutForm({ ...aboutForm, desc1: e.target.value })}
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Paragraph Description 2</label>
                <textarea
                  value={aboutForm.desc2}
                  onChange={(e) => setAboutForm({ ...aboutForm, desc2: e.target.value })}
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.formGroup}>
                <label>About Image URL or File Upload</label>
                <div style={styles.uploadRow}>
                  <input
                    type="text"
                    value={aboutForm.image}
                    onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <label style={styles.fileLabel}>
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'about')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Stats Editor */}
              <h4 style={{ margin: '15px 0 10px', color: '#1a1826' }}>Counters &amp; Statistics</h4>
              {aboutForm.stats?.map((stat, index) => (
                <div key={stat.id} style={{ ...styles.row, marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px' }}>Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...aboutForm.stats];
                        newStats[index].label = e.target.value;
                        setAboutForm({ ...aboutForm, stats: newStats });
                      }}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ width: '80px' }}>
                    <label style={{ fontSize: '11px' }}>Number</label>
                    <input
                      type="number"
                      value={stat.target}
                      onChange={(e) => {
                        const newStats = [...aboutForm.stats];
                        newStats[index].target = parseInt(e.target.value) || 0;
                        setAboutForm({ ...aboutForm, stats: newStats });
                      }}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ width: '60px' }}>
                    <label style={{ fontSize: '11px' }}>Suffix</label>
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => {
                        const newStats = [...aboutForm.stats];
                        newStats[index].suffix = e.target.value;
                        setAboutForm({ ...aboutForm, stats: newStats });
                      }}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ width: '60px' }}>
                    <label style={{ fontSize: '11px' }}>Prefix</label>
                    <input
                      type="text"
                      value={stat.prefix}
                      onChange={(e) => {
                        const newStats = [...aboutForm.stats];
                        newStats[index].prefix = e.target.value;
                        setAboutForm({ ...aboutForm, stats: newStats });
                      }}
                      style={styles.input}
                    />
                  </div>
                </div>
              ))}

              <button type="submit" style={styles.submitBtn}>Save About Settings</button>
            </form>
          )}

          {/* 3. SERVICES TAB */}
          {activeTab === 'services' && (
            <div style={styles.form}>
              <h3>Manage Services</h3>

              <form onSubmit={addService} style={styles.subForm}>
                <h4>Add New Service</h4>
                <div style={styles.formGroup}>
                  <label>Service Name</label>
                  <input
                    type="text"
                    required
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. SEO Marketing"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    required
                    value={newService.desc}
                    onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
                    style={styles.textarea}
                    placeholder="Describe what you offer..."
                    rows={2}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Icon Style Choice</label>
                  <select
                    value={newService.iconType}
                    onChange={(e) => setNewService({ ...newService, iconType: e.target.value })}
                    style={styles.select}
                  >
                    {PREDEFINED_ICONS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" style={styles.submitBtn}>Add Service</button>
              </form>

              <h4 style={{ margin: '20px 0 10px', color: '#1a1826' }}>Active Services</h4>
              <div style={styles.itemList}>
                {content.services?.map((s) => (
                  <div key={s.id} style={styles.itemRow}>
                    <div>
                      <strong>{s.name}</strong>
                      <p style={{ margin: 0, fontSize: '12px', color: '#7c7991' }}>{s.desc}</p>
                    </div>
                    <button onClick={() => deleteService(s.id)} style={styles.deleteBtn}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div style={styles.form}>
              <h3>Manage Portfolio</h3>

              <form onSubmit={addProject} style={styles.subForm}>
                <h4>Add New Project</h4>
                <div style={styles.formGroup}>
                  <label>Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. FitZone App"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Category Filter</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    style={styles.select}
                  >
                    <option value="business">Business</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="landing">Landing Page</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>Card Tag</label>
                  <input
                    type="text"
                    required
                    value={newProject.tag}
                    onChange={(e) => setNewProject({ ...newProject, tag: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. GYM & FITNESS"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Subtitle / Type</label>
                  <input
                    type="text"
                    required
                    value={newProject.type}
                    onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Gym Landing Page"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Project Image Upload</label>
                  <div style={styles.uploadRow}>
                    <input
                      type="text"
                      readOnly
                      value={newProject.image}
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="Upload project card image"
                    />
                    <label style={styles.fileLabel}>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'project')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn} disabled={isUploading}>
                  Add Project
                </button>
              </form>

              <h4 style={{ margin: '20px 0 10px', color: '#1a1826' }}>Active Portfolio</h4>
              <div style={styles.itemList}>
                {content.projects?.map((p) => (
                  <div key={p.id} style={styles.itemRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: '11px', color: '#7c7991' }}>{p.tag} &bull; {p.category}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteProject(p.id)} style={styles.deleteBtn}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. CONTACT TAB */}
          {activeTab === 'contact' && (
            <form onSubmit={saveContact} style={styles.form}>
              <h3>Contact Details Settings</h3>
              <div style={styles.formGroup}>
                <label>Contact Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Office Location</label>
                <input
                  type="text"
                  value={contactForm.location}
                  onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                  style={styles.input}
                />
              </div>

              <h4 style={{ margin: '15px 0 10px', color: '#1a1826' }}>Social Links (URLs)</h4>
              <div style={styles.formGroup}>
                <label>Instagram URL</label>
                <input
                  type="text"
                  value={contactForm.socials.instagram}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      socials: { ...contactForm.socials, instagram: e.target.value },
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>GitHub URL</label>
                <input
                  type="text"
                  value={contactForm.socials.github}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      socials: { ...contactForm.socials, github: e.target.value },
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Twitter / X URL</label>
                <input
                  type="text"
                  value={contactForm.socials.twitter}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      socials: { ...contactForm.socials, twitter: e.target.value },
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  value={contactForm.socials.linkedin}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      socials: { ...contactForm.socials, linkedin: e.target.value },
                    })
                  }
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.submitBtn}>Save Contact Settings</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15, 14, 23, 0.4)',
    backdropFilter: 'blur(10px)',
    zIndex: 10002,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.3s ease',
  },
  sidebar: {
    width: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '-10px 0 40px rgba(124, 58, 237, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderLeft: '1px solid rgba(124, 58, 237, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e8e6f0',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 700,
    color: '#7c3aed',
  },
  headerIcon: {
    width: '20px',
    height: '20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#7c7991',
    lineHeight: 1,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e8e6f0',
    backgroundColor: '#faf9ff',
  },
  tabBtn: {
    flex: 1,
    padding: '12px 6px',
    border: 'none',
    background: 'none',
    fontSize: '11px',
    fontWeight: 600,
    color: '#7c7991',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
  },
  activeTabBtn: {
    color: '#7c3aed',
    borderBottom: '2.5px solid #7c3aed',
    backgroundColor: '#ffffff',
  },
  tabBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  subForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#faf9ff',
    border: '1px solid #e8e6f0',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    padding: '10px 14px',
    border: '1.5px solid #d4d2de',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    color: '#1a1826',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    padding: '10px 14px',
    border: '1.5px solid #d4d2de',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    color: '#1a1826',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
  },
  select: {
    padding: '10px 14px',
    border: '1.5px solid #d4d2de',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    color: '#1a1826',
    backgroundColor: '#ffffff',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  uploadRow: {
    display: 'flex',
    gap: '10px',
  },
  fileLabel: {
    padding: '10px 18px',
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(124, 58, 237, 0.2)',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  successToast: {
    margin: '10px 24px 0',
    padding: '10px 16px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    color: '#047857',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
  },
  errorToast: {
    margin: '10px 24px 0',
    padding: '10px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e8e6f0',
  },
  deleteBtn: {
    padding: '4px 8px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
