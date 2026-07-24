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
import fallbackContent from '../data/fallbackContent';

const API_BASE = import.meta.env.PROD ? 'https://aurexa-admin.onrender.com/api' : 'http://localhost:5002/api';
const API_FALLBACK = 'https://aurexa-admin.onrender.com/api';

export default function SiteContent() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      let res;
      try {
        res = await fetch(`${API_BASE}/content`);
      } catch (localErr) {
        if (!import.meta.env.PROD) {
          console.warn('Failed to fetch from local API, trying production backend...', localErr);
          res = await fetch(`${API_FALLBACK}/content`);
        } else {
          throw localErr;
        }
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && typeof data === 'object' && data.hero && data.about) {
        setContent(data);
      } else {
        console.warn('Received invalid data structure from API, using fallback content.');
        setContent(fallbackContent);
      }
    } catch (err) {
      console.error('Failed to connect to backend API, using fallback content:', err);
      setContent(fallbackContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Loader */}
      <Loader isDataLoaded={!isLoading} />

      {content && (
        <>
          {/* Navigation */}
          <Navbar />

          {/* 01. Hero Section */}
          <Hero content={content.hero} stats={content.about?.stats} />

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
      )}
    </>
  );
}
