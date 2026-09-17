import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload } from 'lucide-react';
import api from '../services/api';

export default function CollectReview() {
  const { spaceSlug } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.get(`/public/spaces/${spaceSlug}`);
        setSpace(response.data);
      } catch (err) {
        setError('Space not found');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('email', email);
      formData.append('companyRole', companyRole);
      formData.append('reviewText', reviewText);
      formData.append('rating', rating.toString());
      if (avatar) formData.append('avatar', avatar);

      await api.post(`/public/spaces/${spaceSlug}/testimonials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (error && !space) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 className="heading-md" style={{ color: 'var(--danger-600)' }}>Oops!</h2>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--success-50)', color: 'var(--success-500)', margin: '0 auto 1.5rem' }}>
            <Star size={32} fill="currentColor" />
          </div>
          <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Thank you!</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>We appreciate your feedback and support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '3rem 1.5rem', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          {space?.logo ? (
            <img src={space.logo} alt={space.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
              {space?.name?.charAt(0) || spaceSlug.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="heading-lg" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{space?.name || 'Company'}</h1>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>{space?.prompt || "We'd love your feedback!"}</p>
        </div>

        {error && <div style={{ padding: '1rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="clientName">Name</label>
            <input 
              id="clientName"
              type="text" 
              className="input-field" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="companyRole">Company Role (e.g. CEO at Acme)</label>
            <input 
              id="companyRole"
              type="text" 
              className="input-field" 
              value={companyRole}
              onChange={(e) => setCompanyRole(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={32}
                  fill={star <= rating ? 'var(--warning-500)' : 'transparent'}
                  color={star <= rating ? 'var(--warning-500)' : 'var(--surface-300)'}
                  onClick={() => setRating(star)}
                  style={{ transition: 'all 0.2s' }}
                />
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reviewText">Your Review</label>
            <textarea 
              id="reviewText"
              className="input-field" 
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Upload Avatar (Optional)</label>
            <label htmlFor="avatar-upload" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px dashed var(--surface-300)', 
              borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'var(--surface-50)', color: 'var(--text-500)'
            }}>
              <Upload size={20} />
              <span>{avatar ? avatar.name : 'Choose File'}</span>
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '0.875rem' }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
