import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/testimonials');
        const reviews = response.data.filter(r => r.status === 'Approved');
        
        if (reviews.length === 0) {
          setLoading(false);
          return;
        }

        const total = reviews.length;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = (sum / total).toFixed(1);
        
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
          dist[r.rating] = (dist[r.rating] || 0) + 1;
        });

        setStats({
          averageRating: avg,
          totalReviews: total,
          distribution: dist
        });
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Average Rating</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Star size={40} fill="var(--warning-500)" color="var(--warning-500)" />
            <span style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--text-900)' }}>
              {stats.averageRating}
            </span>
          </div>
        </div>
        
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Total Reviews</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--text-900)', lineHeight: '1' }}>
            {stats.totalReviews}
          </div>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>Approved testimonials</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Rating Distribution</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = stats.distribution[star];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '40px' }}>
                  <span style={{ fontWeight: '600' }}>{star}</span>
                  <Star size={16} fill="var(--warning-500)" color="var(--warning-500)" />
                </div>
                
                <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--surface-100)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: 'var(--warning-500)', 
                    width: `${percentage}%`,
                    transition: 'width 1s ease-in-out'
                  }}></div>
                </div>
                
                <div style={{ width: '40px', textAlign: 'right', fontWeight: '500', color: 'var(--text-700)' }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
