import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../services/api';

export default function WallOfLove() {
  const { spaceSlug } = useParams();
  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWall = async () => {
      try {
        const response = await api.get(`/public/spaces/${spaceSlug}/wall`);
        setSpace(response.data.space);
        setTestimonials(response.data.testimonials);
      } catch (err) {
        setError('Wall of love not found or space does not exist');
      } finally {
        setLoading(false);
      }
    };
    fetchWall();
  }, [spaceSlug]);

  if (loading) return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (error) return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>{error}</div>;

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--surface-0)' }}>
      <header style={{ padding: '4rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--surface-50)', borderBottom: '1px solid var(--surface-200)' }}>
        <h1 className="heading-xl" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          WALL OF LOVE <span style={{ color: 'var(--danger-500)' }}>❤️</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem' }}>See what people are saying about {space?.name}</p>
      </header>

      <main className="container" style={{ padding: '4rem 1.5rem' }}>
        {testimonials.length === 0 ? (
          <div className="text-center text-muted">No testimonials yet. Be the first to leave one!</div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem',
            alignItems: 'start'
          }}>
            {testimonials.map(t => (
              <div key={t._id} className="card" style={{ padding: '1.5rem', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= t.rating ? 'var(--warning-500)' : 'transparent'} 
                      color={star <= t.rating ? 'var(--warning-500)' : 'var(--surface-300)'} 
                    />
                  ))}
                </div>
                
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-700)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{t.reviewText}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div 
                    style={{ 
                      width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', 
                      color: 'var(--primary-700)', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', fontWeight: 'bold' 
                    }}
                  >
                    {t.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-900)' }}>{t.clientName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-500)' }}>{t.companyRole}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
