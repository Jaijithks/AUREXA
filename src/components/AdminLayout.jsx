import { useState, useEffect, useCallback } from 'react';
import LoginForm from './LoginForm';
import AdminPanel from './AdminPanel';

const API_BASE = import.meta.env.PROD ? 'https://aurexa-admin.onrender.com/api' : 'http://localhost:5002/api';

export default function AdminLayout() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('aurexa_token');
    if (savedToken) {
      // Verify the token is still valid
      fetch(`${API_BASE}/auth/verify`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setToken(savedToken);
            setAuth(true);
          } else {
            localStorage.removeItem('aurexa_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('aurexa_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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
    if (auth) {
      fetchContent();
    }
  }, [auth, fetchContent]);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    setAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('aurexa_token');
    setToken(null);
    setAuth(false);
    setContent(null);
  };

  // Show nothing while checking saved token
  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#1a1826' }}>Checking session...</div>;
  }

  // If not authenticated, show login form
  if (!auth) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  if (!content) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#1a1826' }}>Loading content...</div>;
  }

  // Once logged in, show the full admin UI
  return (
    <AdminPanel
      content={content || { hero: {}, about: {}, contact: {}, services: [], projects: [] }}
      isOpen={true}
      onClose={handleLogout}
      onUpdate={fetchContent}
      token={token}
    />
  );
}
