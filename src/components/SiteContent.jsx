import { useState, useEffect, useCallback } from 'react';
import CustomCursor from '../components/CustomCursor';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Process from '../components/Process';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.PROD ? 'https://aurexa-admin.onrender.com/api' : 'http://localhost:5002/api';

export default function SiteContent() {
  const [content, setContent] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/content`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error('Failed to connect to backend API:', err);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (!content) {
    return <Loader />;
  }

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Loader */}
      <Loader />

      {/* Navigation */}
      <Navbar />

      {/* 01. Hero Section */}
      <Hero content={content.hero} />

      {/* Marquee */}
      <Marquee />

      {/* 02. About Section */}
      <About content={content.about} />

      {/* 03. Services Section */}
      <Services services={content.services} />

      {/* 04. Portfolio / Work Section */}
      <Portfolio projects={content.projects} />

      {/* 05. Process Section */}
      <Process />

      {/* 06. Contact Section */}
      <Contact contact={content.contact} />

      {/* Footer */}
      <Footer />
    </>
  );
}
