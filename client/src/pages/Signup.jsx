import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';
import { CossButton, CossInput, CossForm, CossAlert, CossCard } from '../components/ui/CossUI';

const STEPS = { SIGNUP: 'signup', VERIFY: 'verify' };

export default function Signup() {
  const [step, setStep]       = useState(STEPS.SIGNUP);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [code, setCode]       = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Step 1: Create account ────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      setDevCode(res.data.devVerificationCode || '');
      setStep(STEPS.VERIFY);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify email code ─────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { email, code });
      localStorage.setItem('accessToken', res.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      setDevCode(res.data.devVerificationCode || '');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code.');
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CossCard style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', marginBottom: '1rem' }}>
            <UserPlus size={22} />
          </div>
          <h2 className="heading-md" style={{ marginBottom: '0.25rem' }}>
            {step === STEPS.SIGNUP ? 'Create an account' : 'Verify your email'}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            {step === STEPS.SIGNUP
              ? 'Start collecting testimonials today'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <CossAlert message={error} type="error" />

        {/* Step 1 – Signup form */}
        {step === STEPS.SIGNUP && (
          <CossForm onSubmit={handleSignup}>
            <CossInput id="name"     label="Full Name" value={name}     onChange={(e) => setName(e.target.value)}     placeholder="Virang Baldaniya" required />
            <CossInput id="email"    label="Email"     value={email}    onChange={(e) => setEmail(e.target.value)}    type="email" placeholder="name@example.com" required />
            <CossInput id="password" label="Password"  value={password} onChange={(e) => setPass(e.target.value)}    type="password" placeholder="Min. 8 characters" required hint="Must be at least 8 characters." />
            <CossButton type="submit" fullWidth loading={loading} style={{ marginTop: '0.5rem' }}>
              Create Account
            </CossButton>
          </CossForm>
        )}

        {/* Step 2 – Verification form */}
        {step === STEPS.VERIFY && (
          <>
            {devCode && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--primary-700)' }}>
                🧪 <strong>Dev mode:</strong> Your code is <strong style={{ letterSpacing: '0.15em' }}>{devCode}</strong>
              </div>
            )}
            <CossForm onSubmit={handleVerify}>
              <CossInput
                id="code" label="Verification Code" value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code" required
              />
              <CossButton type="submit" fullWidth loading={loading}>
                Verify & Sign In
              </CossButton>
            </CossForm>
            <button
              onClick={handleResend}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-600)', fontSize: '0.875rem', width: '100%', marginTop: '0.75rem' }}
            >
              Didn't receive it? Resend code
            </button>
          </>
        )}

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '500' }}>Sign in</Link>
        </div>
      </CossCard>
    </div>
  );
}
