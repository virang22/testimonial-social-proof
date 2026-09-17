import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Link as LinkIcon, Trash2, Code } from 'lucide-react';
import api from '../services/api';
import EmbedModal from '../components/EmbedModal';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [embedSpace, setEmbedSpace] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await api.get('/spaces');
        setSpaces(response.data);
      } catch (err) {
        console.error('Failed to fetch spaces', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this space? All associated reviews will also be removed.')) return;
    try {
      await api.delete(`/spaces/${id}`);
      setSpaces(spaces.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to delete space', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg">Spaces</h1>
        <Link to="/dashboard/spaces/new" className="btn btn-primary">
          <Plus size={18} />
          Create Space
        </Link>
      </div>

      {spaces.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--surface-100)', color: 'var(--text-400)', marginBottom: '1rem' }}>
            <Plus size={32} />
          </div>
          <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>No spaces yet</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Create your first space to start collecting testimonials.</p>
          <Link to="/dashboard/spaces/new" className="btn btn-primary">
            Create your first space
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {spaces.map(space => (
            <div key={space._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                {space.logo ? (
                  <img src={space.logo} alt={space.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {space.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{space.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-500)' }}>/{space.slug}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-200)', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <a 
                  href={`/collect/${space.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                  title="Collection Form"
                >
                  <LinkIcon size={14} />
                  Form
                </a>
                <a 
                  href={`/wall/${space.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderColor: 'var(--danger-100)' }}
                  title="Wall of Love"
                >
                  ❤️ Wall
                </a>
                <button 
                  onClick={() => setEmbedSpace(space)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                  title="Generate Embed Code"
                >
                  <Code size={14} />
                  Embed
                </button>
                <button 
                  onClick={() => handleDelete(space._id)}
                  className="btn btn-secondary"
                  style={{ color: 'var(--danger-500)', padding: '0.5rem' }}
                  title="Delete Space"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {embedSpace && (
        <EmbedModal space={embedSpace} onClose={() => setEmbedSpace(null)} />
      )}
    </div>
  );
}
