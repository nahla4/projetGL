'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
  const [role, setRole] = useState<'tourist' | 'guide'>('tourist');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);

     const res = await fetch('http://localhost:5000/api/users/register', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
          // optional fields if you add inputs later:
          photoURL: null,
          phoneNumber: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        setSuccess('Account created successfully!');
        // optional: clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
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
        <div style={styles.imageHeader}></div>

        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>
          Register as a {role === 'tourist' ? 'tourist' : 'guide'}.
        </p>

        {/* Role selection */}
        <div style={styles.roleContainer}>
          <button
            style={{
              ...styles.roleButton,
              backgroundColor: role === 'tourist' ? '#000' : '#eee',
              color: role === 'tourist' ? '#fff' : '#000',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5C518';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                role === 'tourist' ? '#000' : '#eee';
              e.currentTarget.style.color =
                role === 'tourist' ? '#fff' : '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => setRole('tourist')}
          >
            Tourist
          </button>

          <button
            style={{
              ...styles.roleButton,
              backgroundColor: role === 'guide' ? '#000' : '#eee',
              color: role === 'guide' ? '#fff' : '#000',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5C518';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                role === 'guide' ? '#000' : '#eee';
              e.currentTarget.style.color =
                role === 'guide' ? '#fff' : '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => setRole('guide')}
          >
            Guide
          </button>
        </div>

        {/* Error / success messages */}
        {error && (
          <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        {success && (
          <p
            style={{
              color: 'green',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {success}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First name"
            style={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last name"
            style={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

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

          <button
            type="submit"
            style={styles.primaryButton}
            disabled={loading}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5C518';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account? <a href="/login">Sign in</a>
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
  imageHeader: {
    height: '120px',
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
  roleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  roleButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
  },
  input: {
  width: '94%',
  padding: '8px',
  marginBottom: '12px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
  },
};
