import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

export default function EmbedModal({ space, onClose }) {
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('grid');
  const [copied, setCopied] = useState(false);

  // Use the actual hostname in production, but for now use localhost or VITE_CLIENT_URL
  const baseUrl = import.meta.env.VITE_CLIENT_URL || window.location.origin;
  const iframeSrc = `${baseUrl}/wall/${space.slug}?theme=${theme}&layout=${layout}`;
  
  const embedCode = `<iframe 
  src="${iframeSrc}"
  width="100%" 
  height="600px" 
  frameborder="0" 
  scrolling="yes" 
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--surface-0)', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-500)' }}>
          <X size={24} />
        </button>
        
        <h2 className="heading-md" style={{ marginBottom: '1.5rem' }}>Generate Embed for {space.name}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Theme</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
                Light
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                Dark
              </label>
            </div>
          </div>
          
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Layout</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="layout" checked={layout === 'grid'} onChange={() => setLayout('grid')} />
                Grid
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="layout" checked={layout === 'carousel'} onChange={() => setLayout('carousel')} />
                Carousel
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Embed Code</label>
          <div style={{ position: 'relative' }}>
            <textarea 
              readOnly
              value={embedCode}
              style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--surface-50)', border: '1px solid var(--surface-200)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-700)', resize: 'none' }}
              rows={6}
            />
            <button 
              onClick={handleCopy}
              className="btn"
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'var(--surface-0)', border: '1px solid var(--surface-200)', padding: '0.5rem' }}
            >
              {copied ? <Check size={16} color="var(--success-500)" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary">Done</button>
        </div>
      </div>
    </div>
  );
}
