import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questAPI } from '../api/quests';
import { Quest, User } from '../types';
import { FaStar, FaCoins, FaGithub, FaCheckCircle } from 'react-icons/fa';

interface QuestDetailProps {
  user: User | null;
}

const QuestDetail: React.FC<QuestDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [prUrl, setPrUrl] = useState('');

  useEffect(() => {
    if (id) loadQuest();
  }, [id]);

  const loadQuest = async () => {
    try {
      setLoading(true);
      const data = await questAPI.getById(id!);
      setQuest(data);
    } catch (error) {
      console.error('Failed to load quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuest = async () => {
    try {
      await questAPI.accept(id!);
      loadQuest();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to accept quest');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await questAPI.submit(id!, prUrl);
      setPrUrl('');
      loadQuest();
      alert('Solution submitted! Waiting for client review.');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit solution');
    }
  };

  const handleComplete = async () => {
    if (!confirm('Mark this quest as completed? This will award gold and XP to the adventurer.')) {
      return;
    }
    try {
      await questAPI.complete(id!);
      loadQuest();
      alert('Quest completed! Rewards have been awarded.');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to complete quest');
    }
  };

  if (loading) {
    return (
      <div className="rpg-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="rpg-container">
        <div className="rpg-card">Quest not found</div>
      </div>
    );
  }

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 2 : 3;
    return Array(count).fill(0).map((_, i) => <FaStar key={i} />);
  };

  const canAccept = user && quest.status === 'OPEN' && !quest.assignedToId;
  const canSubmit = user && quest.assignedToId === user.id && quest.status === 'IN_PROGRESS';
  const canComplete = user && quest.createdById === user.id && quest.status === 'IN_PROGRESS';

  return (
    <div className="rpg-container">
      <button onClick={() => navigate('/')} className="rpg-button-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Quest Board
      </button>

      <div className="rpg-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>{quest.title}</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ display: 'flex', gap: '4px', color: 'var(--accent-gold)' }}>
                {getDifficultyStars(quest.difficulty)}
              </span>
              <span className={`status-badge ${quest.status.toLowerCase().replace('_', '-')}`}>
                {quest.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="gold" style={{ fontSize: '1.5em' }}>
            <FaCoins /> {quest.reward}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{quest.description}</p>
        </div>

        {quest.githubIssueUrl && (
          <div style={{ marginBottom: '24px' }}>
            <a href={quest.githubIssueUrl} target="_blank" rel="noopener noreferrer" className="rpg-button-secondary">
              <FaGithub /> View GitHub Issue
            </a>
          </div>
        )}

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div>
            <strong>Posted by:</strong>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {quest.createdBy.avatarUrl && (
                <img src={quest.createdBy.avatarUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              )}
              <span>{quest.createdBy.username}</span>
            </div>
          </div>

          {quest.assignedTo && (
            <div>
              <strong>Assigned to:</strong>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {quest.assignedTo.avatarUrl && (
                  <img src={quest.assignedTo.avatarUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                )}
                <span>{quest.assignedTo.username} (Lv.{quest.assignedTo.level})</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {canAccept && (
          <button onClick={handleAcceptQuest} className="rpg-button">
            Accept Quest
          </button>
        )}

        {canSubmit && (
          <div className="rpg-card" style={{ marginTop: '20px' }}>
            <h3>Submit Your Solution</h3>
            <form onSubmit={handleSubmit} className="rpg-form">
              <input
                type="url"
                placeholder="GitHub Pull Request URL"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                required
                className="rpg-input"
              />
              <button type="submit" className="rpg-button">
                Submit Solution
              </button>
            </form>
          </div>
        )}

        {canComplete && (
          <button onClick={handleComplete} className="rpg-button">
            <FaCheckCircle /> Mark as Completed
          </button>
        )}

        {/* Submissions */}
        {quest.submissions && quest.submissions.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3>Submissions</h3>
            {quest.submissions.map((submission) => (
              <div key={submission.id} className="rpg-card" style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a href={submission.githubPrUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)' }}>
                    <FaGithub /> View Pull Request
                  </a>
                  <span className={`status-badge ${submission.status.toLowerCase()}`}>
                    {submission.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestDetail;
