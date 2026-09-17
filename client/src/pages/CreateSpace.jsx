import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateSpace() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [prompt, setPrompt] = useState('We would love to hear your feedback!');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/spaces', { name, slug, prompt });
      navigate('/dashboard/spaces');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create space');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Create a new Space</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Space Name</label>
            <input 
              id="name"
              type="text" 
              className="input-field" 
              placeholder="Acme Corp"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="slug">Space URL</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ padding: '0.625rem 0.75rem', backgroundColor: 'var(--surface-100)', border: '1px solid var(--surface-200)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', color: 'var(--text-500)', fontSize: '0.875rem' }}>
                /collect/
              </span>
              <input 
                id="slug"
                type="text" 
                className="input-field" 
                style={{ flex: 1, borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="prompt">Custom Prompt</label>
            <textarea 
              id="prompt"
              className="input-field" 
              rows="3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/spaces')}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
