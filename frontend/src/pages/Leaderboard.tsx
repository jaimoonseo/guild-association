import React, { useEffect, useState } from 'react';
import { userAPI } from '../api/users';
import { LeaderboardEntry } from '../types';
import { FaTrophy, FaCoins, FaStar } from 'react-icons/fa';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="rpg-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="rpg-container">
      <h1 style={{ color: 'var(--accent-gold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FaTrophy /> Leaderboard - Top Adventurers
      </h1>

      <div className="rpg-card">
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
            No adventurers yet. Be the first to complete a quest!
          </p>
        ) : (
          <div>
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`leaderboard-entry rank-${entry.rank <= 3 ? entry.rank : ''}`}
              >
                <div style={{ fontSize: '1.5em', minWidth: '60px', textAlign: 'center' }}>
                  {getRankIcon(entry.rank)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {entry.avatarUrl && (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-gold)' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{entry.username}</div>
                    <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                      <FaStar style={{ color: 'var(--accent-purple)' }} /> Level {entry.level}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>{entry.xp}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>XP</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                      <FaCoins /> {entry.gold}
                    </div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>Gold</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{entry.completedQuests}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>Quests</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
