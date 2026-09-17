import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center" style={{ maxWidth: '600px' }}>
        <h1 className="heading-xl" style={{ marginBottom: '1rem' }}>Testimonial Social Proof</h1>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>
          Collect, manage, and showcase customer love with beautiful widgets.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
