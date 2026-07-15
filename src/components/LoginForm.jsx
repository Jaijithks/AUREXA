import { useState } from 'react';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hard‑coded admin credentials as per backend
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      setError('');
      onSuccess();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Admin Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

// Simple inline CSS – you can move these to index.css for a nicer theme
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' },
  form: { background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '300px' },
  title: { marginBottom: '20px', textAlign: 'center' },
  field: { marginBottom: '15px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '10px', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: '#e74c3c', marginBottom: '10px', textAlign: 'center' },
};
