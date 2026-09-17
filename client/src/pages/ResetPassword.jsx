import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { CossButton, CossInput, CossForm, CossAlert, CossCard } from '../components/ui/CossUI';

export default function ResetPassword() {
  const [params]       = useSearchParams();
  const [token, setToken]   = useState(params.get('token') || '');
  const [password, setPass] = useState('');
  const [confirm, setConf]  = useState('');
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CossCard style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>

        <div className="text-center" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--success-50)', color: 'var(--success-700)', marginBottom: '1rem' }}>
            <ShieldCheck size={22} />
          </div>
          <h2 className="heading-md" style={{ marginBottom: '0.25rem' }}>Reset Password</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Choose a strong new password</p>
        </div>

        {success ? (
          <CossAlert message="✅ Password reset successfully! Redirecting to login..." type="success" />
        ) : (
          <>
            <CossAlert message={error} type="error" />
            <CossForm onSubmit={handleSubmit}>
              {!params.get('token') && (
                <CossInput
                  id="token" label="Reset Token" required
                  value={token} onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your reset token"
                />
              )}
              <CossInput
                id="password" label="New Password" type="password" required
                value={password} onChange={(e) => setPass(e.target.value)}
                placeholder="Min. 8 characters"
              />
              <CossInput
                id="confirm" label="Confirm Password" type="password" required
                value={confirm} onChange={(e) => setConf(e.target.value)}
                placeholder="Re-enter new password"
              />
              <CossButton type="submit" fullWidth loading={loading} style={{ marginTop: '0.5rem' }}>
                Reset Password
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
