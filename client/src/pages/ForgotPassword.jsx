import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../services/api';
import { CossButton, CossInput, CossForm, CossAlert, CossCard } from '../components/ui/CossUI';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [devToken, setDevToken] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setDevToken(res.data.devResetToken || '');
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CossCard style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>

        <div className="text-center" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--warning-50)', color: '#d97706', marginBottom: '1rem' }}>
            <KeyRound size={22} />
          </div>
          <h2 className="heading-md" style={{ marginBottom: '0.25rem' }}>Forgot password?</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <>
            <CossAlert message="A password reset link has been prepared. Check the server console (or the dev token below)." type="success" />
            {devToken && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--warning-50)', border: '1px solid var(--warning-300)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                🧪 <strong>Dev token:</strong>
                <br />
                <code style={{ fontSize: '0.75rem' }}>{devToken}</code>
                <br />
                <Link to={`/reset-password?token=${devToken}`} style={{ color: 'var(--primary-600)', fontWeight: '500', fontSize: '0.8rem' }}>
                  → Click here to reset password
                </Link>
              </div>
            )}
            <Link to="/login" style={{ display: 'block', textAlign: 'center', color: 'var(--primary-600)', fontSize: '0.875rem' }}>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <CossAlert message={error} type="error" />
            <CossForm onSubmit={handleSubmit}>
              <CossInput
                id="email" label="Email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <CossButton type="submit" fullWidth loading={loading} style={{ marginTop: '0.5rem' }}>
                Send Reset Link
              </CossButton>
            </CossForm>
            <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '500' }}>← Back to Login</Link>
            </div>
          </>
        )}
      </CossCard>
    </div>
  );
}
