import { Link } from 'react-router-dom';
import { FaTrophy, FaScroll, FaSignOutAlt } from 'react-icons/fa';
import { User } from '../types';
import { authAPI } from '../api/auth';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="rpg-navbar">
      <div className="rpg-navbar-content">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="rpg-logo">⚔️ Guild Association</div>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaScroll /> Quests
          </Link>
          <Link to="/leaderboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaTrophy /> Leaderboard
          </Link>

          {user ? (
            <>
              <Link to={`/profile/${user.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.avatarUrl && (
                  <img src={user.avatarUrl} alt={user.username} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                )}
                <div>
                  <div style={{ fontSize: '0.9em' }}>{user.username}</div>
                  <div style={{ fontSize: '0.75em', color: 'var(--accent-gold)' }}>Lv.{user.level}</div>
                </div>
              </Link>
              <button onClick={onLogout} className="rpg-button-secondary" style={{ padding: '8px 16px' }}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => authAPI.loginWithGitHub()} className="rpg-button" style={{ padding: '8px 16px' }}>
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
