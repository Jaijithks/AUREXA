import { useState, useEffect, useCallback } from 'react';
import LoginForm from './LoginForm';
import AdminPanel from './AdminPanel';

const API_BASE = 'http://localhost:5002/api';

export default function AdminLayout() {
  const [auth, setAuth] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error('Failed to connect to backend API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth) {
      fetchContent();
    }
  }, [auth, fetchContent]);

  const handleLoginSuccess = () => {
    setAuth(true);
  };

  // If not authenticated, show login form
  if (!auth) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  if (loading && !content) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#1a1826' }}>Loading content...</div>;
  }

  // Once logged in, show the full admin UI
  return (
    <AdminPanel
      content={content || { hero: {}, about: {}, contact: {}, services: [], projects: [] }}
      isOpen={true}
      onClose={() => setAuth(false)}
      onUpdate={fetchContent}
    />
  );
}
