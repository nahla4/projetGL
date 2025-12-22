'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
        setSuccess('Login successful!');
        // here you could save user data or token to context/localStorage
        // and redirect using next/navigation
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.blurLayer}></div>

      <div style={{ ...styles.card, position: 'relative', zIndex: 1 }}>
        <div style={styles.image}></div>

        <h1 style={styles.title}>Sign in</h1>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {error}
          </p>
        )}
        {success && (
          <p
            style={{
              color: 'green',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={styles.primaryButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.link}>Mot de passe oublié ?</p>

        <div style={styles.divider}>or</div>

        <button style={styles.secondaryButton}>Sign in with Google</button>

        <p style={styles.bottomText}>
          Vous n&apos;avez pas de compte ? <a href="/register">S’inscrire</a>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    minHeight: '100vh',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  blurLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(3px)',
    backgroundColor: 'rgba(0,0,0,0)',
  },

  card: {
    width: '420px',
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  image: {
    height: '140px',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '5px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  primaryButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#aaa',
  },
  link: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
  },
};
