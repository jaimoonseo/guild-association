import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../api/users';
import { FaCoins, FaStar, FaTrophy } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile(id!);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rpg-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rpg-container">
        <div className="rpg-card">User not found</div>
      </div>
    );
  }

  const xpToNextLevel = 1000;
  const currentLevelXP = profile.xp % xpToNextLevel;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="rpg-container">
      <div className="rpg-card">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              style={{ width: '120px', height: '120px', borderRadius: '12px', border: '3px solid var(--accent-gold)' }}
            />
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>{profile.username}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Role: <strong>{profile.role}</strong>
            </p>

            <div className="character-stats" style={{ marginBottom: '20px' }}>
              <div className="stat-item">
                <div className="stat-value">{profile.level}</div>
                <div className="stat-label">Level</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  <FaCoins style={{ color: 'var(--accent-gold)' }} /> {profile.gold}
                </div>
                <div className="stat-label">Gold</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{profile.completedQuestsCount}</div>
                <div className="stat-label">Quests</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>XP Progress</span>
                <span style={{ color: 'var(--accent-gold)' }}>
                  {currentLevelXP} / {xpToNextLevel} XP
                </span>
              </div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rpg-card" style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '16px' }}>🏆 Achievements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
            <FaTrophy style={{ fontSize: '2em', color: 'var(--accent-gold)', marginBottom: '8px' }} />
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{profile.completedQuestsCount}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>Completed Quests</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
            <FaCoins style={{ fontSize: '2em', color: 'var(--accent-gold)', marginBottom: '8px' }} />
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{profile.gold}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>Total Gold Earned</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
            <FaStar style={{ fontSize: '2em', color: 'var(--accent-purple)', marginBottom: '8px' }} />
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{profile.level}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
