import { Link } from 'react-router-dom';
import { Users, Star, MessageSquare } from 'lucide-react';

export default function Overview() {
  return (
    <div>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Link to="/dashboard/spaces" className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: 'var(--radius-lg)' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>Manage Spaces</h3>
            <p className="text-muted">Create or configure your spaces</p>
          </div>
        </Link>
        
        <Link to="/dashboard/reviews" className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--success-50)', color: 'var(--success-500)', borderRadius: 'var(--radius-lg)' }}>
            <MessageSquare size={32} />
          </div>
          <div>
            <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>Moderate Reviews</h3>
            <p className="text-muted">Approve or reject testimonials</p>
          </div>
        </Link>
        
        <Link to="/dashboard/analytics" className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--warning-50)', color: 'var(--warning-500)', borderRadius: 'var(--radius-lg)' }}>
            <Star size={32} />
          </div>
          <div>
            <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>View Analytics</h3>
            <p className="text-muted">See your ratings and performance</p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Welcome to Testimonial!</h2>
        <p style={{ color: 'var(--text-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
          This is your central hub for collecting, managing, and showcasing customer love. Start by creating a Space.
          Share the public link with your customers, and watch the reviews roll in.
        </p>
        <Link to="/dashboard/spaces/new" className="btn btn-primary">Create Your First Space</Link>
      </div>
    </div>
  );
}
