import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Heart, Award } from 'lucide-react';
import api from '../services/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved, Archived

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials');
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/testimonials/${id}/${action}`);
      // Optimistically update the UI
      setReviews(reviews.map(r => {
        if (r._id === id) {
          if (action === 'approve') return { ...r, status: 'Approved' };
          if (action === 'reject') return { ...r, status: 'Archived' };
          if (action === 'feature') return { ...r, isFeatured: !r.isFeatured };
          if (action === 'like') return { ...r, isLiked: !r.isLiked };
        }
        return r;
      }));
    } catch (err) {
      console.error(`Failed to ${action} review`, err);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg">Reviews</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--surface-200)' }}>
        {['All', 'Pending', 'Approved', 'Archived'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              fontWeight: filter === tab ? '600' : '500', 
              color: filter === tab ? 'var(--primary-600)' : 'var(--text-500)',
              borderBottom: filter === tab ? '2px solid var(--primary-600)' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted">No {filter.toLowerCase()} reviews found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {filteredReviews.map(review => (
            <div key={review._id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-900)' }}>{review.clientName}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-500)' }}>{review.companyRole} • {review.email}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className={`badge ${review.status === 'Approved' ? 'badge-success' : review.status === 'Archived' ? 'badge-danger' : 'badge-warning'}`}>
                      {review.status}
                    </span>
                    {review.space && (
                      <span className="badge" style={{ backgroundColor: 'var(--surface-100)', color: 'var(--text-700)' }}>
                        Space: {review.space.name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={star <= review.rating ? 'var(--warning-500)' : 'transparent'} 
                      color={star <= review.rating ? 'var(--warning-500)' : 'var(--surface-300)'} 
                    />
                  ))}
                </div>

                <p style={{ color: 'var(--text-700)', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{review.reviewText}"</p>
                
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--surface-100)', paddingTop: '1rem' }}>
                  {review.status !== 'Approved' && (
                    <button onClick={() => handleAction(review._id, 'approve')} className="btn" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-500)' }}>
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  {review.status !== 'Archived' && (
                    <button onClick={() => handleAction(review._id, 'reject')} className="btn" style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)' }}>
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                  
                  <div style={{ flex: 1 }}></div>

                  <button 
                    onClick={() => handleAction(review._id, 'like')} 
                    className="btn" 
                    style={{ backgroundColor: review.isLiked ? 'var(--danger-50)' : 'var(--surface-50)', color: review.isLiked ? 'var(--danger-500)' : 'var(--text-500)' }}
                  >
                    <Heart size={16} fill={review.isLiked ? 'currentColor' : 'transparent'} /> Like
                  </button>
                  
                  <button 
                    onClick={() => handleAction(review._id, 'feature')} 
                    className="btn" 
                    style={{ backgroundColor: review.isFeatured ? 'var(--warning-50)' : 'var(--surface-50)', color: review.isFeatured ? 'var(--warning-500)' : 'var(--text-500)' }}
                  >
                    <Award size={16} fill={review.isFeatured ? 'currentColor' : 'transparent'} /> Feature
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
