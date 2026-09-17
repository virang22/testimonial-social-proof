import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api, { setAccessToken } from '../services/api';
import { CossButton, CossInput, CossForm, CossAlert, CossCard } from '../components/ui/CossUI';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) {
        setNeedsVerify(true);
        setError('Please verify your email before logging in.');
      } else {
        setError(data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CossCard style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>

        <div className="text-center" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', marginBottom: '1rem' }}>
            <LogIn size={22} />
          </div>
          <h2 className="heading-md" style={{ marginBottom: '0.25rem' }}>Welcome back</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Enter your credentials to continue</p>
        </div>

        <CossAlert message={error} type={needsVerify ? 'info' : 'error'} />

        {needsVerify && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Link to="/signup" style={{ color: 'var(--primary-600)', fontSize: '0.875rem', fontWeight: '500' }}>
              → Go to email verification
            </Link>
          </div>
        )}

        <CossForm onSubmit={handleSubmit}>
          <CossInput
            id="email" label="Email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-700)' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: '500' }}>Forgot password?</Link>
            </div>
            <CossInput
              id="password" type="password" required
              value={password} onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••" style={{ marginBottom: 0 }}
            />
          </div>

          <CossButton type="submit" fullWidth loading={loading} style={{ marginTop: '0.5rem' }}>
            Sign in
          </CossButton>
        </CossForm>

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-500)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-600)', fontWeight: '500' }}>Sign up</Link>
        </div>
      </CossCard>
    </div>
  );
}
