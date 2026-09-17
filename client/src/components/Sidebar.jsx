import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, BarChart2, Settings, LogOut } from 'lucide-react';
import api, { setAccessToken } from '../services/api';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setAccessToken(null);
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Spaces', path: '/dashboard/spaces', icon: <FolderKanban size={20} /> },
    { name: 'Reviews', path: '/dashboard/reviews', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: 'var(--surface-0)', 
      borderRight: '1px solid var(--surface-200)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-200)' }}>
        <h2 className="heading-md" style={{ color: 'var(--primary-600)' }}>Testimonial</h2>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--primary-700)' : 'var(--text-700)',
              backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
              fontWeight: isActive ? '600' : '500',
              transition: 'all var(--transition-fast)'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--surface-200)' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            color: 'var(--text-500)', 
            padding: '0.75rem 1rem', 
            width: '100%', 
            borderRadius: 'var(--radius-md)',
            fontWeight: '500' 
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-50)'; e.currentTarget.style.color = 'var(--danger-600)' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-500)' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
