import React from 'react';
import { Quest } from '../types';
import { FaStar, FaCoins, FaUser } from 'react-icons/fa';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 2 : 3;
    return (
      <div className={`difficulty-stars ${difficulty.toLowerCase()}`}>
        {Array(count).fill(0).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
    );
  };

  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace('_', '-');
  };

  return (
    <div className="quest-card" onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>{quest.title}</h3>
        {getDifficultyStars(quest.difficulty)}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95em', marginBottom: '12px' }}>
        {quest.description.length > 100
          ? `${quest.description.substring(0, 100)}...`
          : quest.description}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={`status-badge ${getStatusClass(quest.status)}`}>
          {quest.status.replace('_', ' ')}
        </span>

        <span className="gold">
          <FaCoins /> {quest.reward} Gold
        </span>

        {quest.assignedTo && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9em' }}>
            <FaUser />
            {quest.assignedTo.username} (Lv.{quest.assignedTo.level})
          </span>
        )}
      </div>

      {quest.githubIssueUrl && (
        <div style={{ marginTop: '12px' }}>
          <a
            href={quest.githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-blue)', fontSize: '0.9em' }}
            onClick={(e) => e.stopPropagation()}
          >
            View GitHub Issue →
          </a>
        </div>
      )}
    </div>
  );
};

export default QuestCard;
