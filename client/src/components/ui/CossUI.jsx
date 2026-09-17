/**
 * Coss UI – Premium Component Library
 * =====================================
 * A complete set of reusable, accessible UI primitives styled with the
 * project's design system CSS variables.  Import individual components:
 *
 *   import { CossButton, CossInput, CossCard } from '../components/ui/CossUI';
 */

import { useState, useRef, useEffect, createContext, useContext } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────────────────────────────────────
export function CossButton({
  children, variant = 'primary', size = 'md', fullWidth = false,
  loading = false, disabled = false, icon, onClick, type = 'button', style = {}, className = '',
}) {
  const sizes = { sm: '0.4rem 0.9rem', md: '0.6rem 1.25rem', lg: '0.8rem 1.75rem' };
  const fontSize = { sm: '0.8rem', md: '0.9rem', lg: '1rem' };

  const variantStyles = {
    primary:   { background: 'var(--primary-600)', color: '#fff', border: '1.5px solid var(--primary-600)' },
    secondary: { background: 'var(--surface-100)', color: 'var(--text-800)', border: '1.5px solid var(--surface-300)' },
    danger:    { background: 'var(--danger-600)', color: '#fff', border: '1.5px solid var(--danger-600)' },
    ghost:     { background: 'transparent', color: 'var(--primary-600)', border: '1.5px solid transparent' },
    outline:   { background: 'transparent', color: 'var(--primary-600)', border: '1.5px solid var(--primary-600)' },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`coss-btn coss-btn--${variant} ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: sizes[size], fontSize: fontSize[size], fontWeight: '500',
        borderRadius: 'var(--radius-md)', cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.6 : 1,
        width: fullWidth ? '100%' : undefined,
        transition: 'all 0.2s ease', outline: 'none',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {loading && (
        <span style={{
          width: '14px', height: '14px', border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'coss-spin 0.6s linear infinite', display: 'inline-block',
        }} />
      )}
      {!loading && icon && icon}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────────────────────
export function CossInput({
  label, id, type = 'text', placeholder, value, onChange, required = false,
  error, hint, prefix, suffix, disabled = false, style = {}, inputStyle = {},
}) {
  return (
    <div className="coss-input-group" style={{ marginBottom: '1rem', ...style }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-700)' }}>
          {label}{required && <span style={{ color: 'var(--danger-500)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-400)', fontSize: '0.875rem', pointerEvents: 'none' }}>
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={{
            width: '100%', padding: `0.6rem ${suffix ? '2.5rem' : '0.875rem'} 0.6rem ${prefix ? '2.25rem' : '0.875rem'}`,
            border: `1.5px solid ${error ? 'var(--danger-400)' : 'var(--surface-300)'}`,
            borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-900)',
            background: disabled ? 'var(--surface-50)' : 'var(--surface-0)',
            transition: 'border-color 0.2s', outline: 'none',
            ...inputStyle,
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--primary-400)'; }}
          onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--danger-400)' : 'var(--surface-300)'; }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: '0.75rem', color: 'var(--text-400)', fontSize: '0.875rem', pointerEvents: 'none' }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <p style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: 'var(--danger-600)' }}>{error}</p>}
      {hint  && !error && <p style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: 'var(--text-400)' }}>{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────────────────────────────────────
export function CossTextarea({ label, id, placeholder, value, onChange, required, rows = 4, error, style = {} }) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-700)' }}>
          {label}{required && <span style={{ color: 'var(--danger-500)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <textarea
        id={id} rows={rows} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={{
          width: '100%', padding: '0.6rem 0.875rem', resize: 'vertical',
          border: `1.5px solid ${error ? 'var(--danger-400)' : 'var(--surface-300)'}`,
          borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-900)',
          background: 'var(--surface-0)', transition: 'border-color 0.2s', outline: 'none',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--primary-400)'; }}
        onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--danger-400)' : 'var(--surface-300)'; }}
      />
      {error && <p style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: 'var(--danger-600)' }}>{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECT / DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
export function CossSelect({ label, id, value, onChange, options = [], placeholder, required, style = {} }) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-700)' }}>
          {label}{required && <span style={{ color: 'var(--danger-500)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <select
        id={id} value={value} onChange={onChange} required={required}
        style={{
          width: '100%', padding: '0.6rem 2rem 0.6rem 0.875rem',
          border: '1.5px solid var(--surface-300)', borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem', color: 'var(--text-900)', background: 'var(--surface-0)',
          cursor: 'pointer', appearance: 'none', outline: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────
export function CossCard({ children, hoverable = false, padding = '1.5rem', style = {}, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface-0)', border: '1px solid var(--surface-200)',
        borderRadius: 'var(--radius-lg)', padding,
        boxShadow: hovered && hoverable ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered && hoverable ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease', cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────
export function CossBadge({ children, variant = 'default', style = {} }) {
  const variants = {
    default:  { background: 'var(--surface-100)', color: 'var(--text-600)' },
    success:  { background: 'var(--success-50)',  color: 'var(--success-700)' },
    warning:  { background: 'var(--warning-50)',  color: 'var(--warning-700)' },
    danger:   { background: 'var(--danger-50)',   color: 'var(--danger-700)' },
    primary:  { background: 'var(--primary-50)',  color: 'var(--primary-700)' },
    info:     { background: '#e0f2fe',            color: '#0369a1' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem',
      borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.02em',
      ...variants[variant], ...style,
    }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────────────────
export function CossTabs({ tabs = [], active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--surface-200)', marginBottom: '1.5rem' }}>
      {tabs.map((tab) => {
        const isActive = active === (tab.value ?? tab);
        return (
          <button
            key={tab.value ?? tab}
            onClick={() => onChange(tab.value ?? tab)}
            style={{
              padding: '0.6rem 1.1rem', border: 'none', background: 'transparent',
              fontWeight: isActive ? '600' : '400', fontSize: '0.875rem',
              color: isActive ? 'var(--primary-600)' : 'var(--text-500)',
              borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent',
              marginBottom: '-1px', cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            {tab.label ?? tab}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIALOG / MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function CossDialog({ open, onClose, title, children, maxWidth = '480px' }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        animation: 'coss-fade-in 0.15s ease',
      }}
    >
      <div style={{
        background: 'var(--surface-0)', borderRadius: 'var(--radius-xl)', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        width: '100%', maxWidth, maxHeight: '90vh', overflow: 'auto',
        animation: 'coss-slide-up 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--surface-200)' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-900)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-400)', fontSize: '1.25rem', lineHeight: 1 }}>&times;</button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST / NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);

export function CossToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  };

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const colors = {
    success: { bg: 'var(--success-50)',  border: 'var(--success-300)',  text: 'var(--success-800)'  },
    error:   { bg: 'var(--danger-50)',   border: 'var(--danger-300)',   text: 'var(--danger-800)'   },
    warning: { bg: 'var(--warning-50)',  border: 'var(--warning-300)',  text: 'var(--warning-800)'  },
    info:    { bg: '#e0f2fe',            border: '#7dd3fc',             text: '#0c4a6e'             },
  };

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.info;
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '280px', maxWidth: '400px',
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
              background: c.bg, border: `1px solid ${c.border}`, color: c.text,
              fontSize: '0.875rem', fontWeight: '500', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              animation: 'coss-slide-up 0.25s ease',
            }}>
              <span>{icons[t.type]}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useCossToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useCossToast must be used inside CossToastProvider');
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
export function CossForm({ onSubmit, children, style = {} }) {
  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT BOX
// ─────────────────────────────────────────────────────────────────────────────
export function CossAlert({ message, type = 'error', style = {} }) {
  if (!message) return null;
  const colors = {
    error:   { bg: 'var(--danger-50)',  border: 'var(--danger-200)',  text: 'var(--danger-700)'  },
    success: { bg: 'var(--success-50)', border: 'var(--success-200)', text: 'var(--success-700)' },
    info:    { bg: '#e0f2fe',           border: '#bae6fd',            text: '#0369a1'            },
  };
  const c = colors[type] || colors.error;
  return (
    <div style={{
      padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text, ...style,
    }}>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────────────────────────
export function CossSpinner({ size = 32 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{
        width: size, height: size, border: '3px solid var(--surface-200)',
        borderTopColor: 'var(--primary-500)', borderRadius: '50%',
        animation: 'coss-spin 0.7s linear infinite',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
export function CossDivider({ label, style = {} }) {
  if (!label) return <hr style={{ border: 'none', borderTop: '1px solid var(--surface-200)', margin: '1.5rem 0', ...style }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0', ...style }}>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--surface-200)' }} />
      <span style={{ fontSize: '0.78rem', color: 'var(--text-400)', whiteSpace: 'nowrap' }}>{label}</span>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--surface-200)' }} />
    </div>
  );
}
