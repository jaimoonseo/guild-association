import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questAPI } from '../api/quests';
import { Quest, User } from '../types';
import QuestCard from '../components/QuestCard';
import { FaPlus, FaFilter } from 'react-icons/fa';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ status?: string; difficulty?: string }>({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadQuests();
  }, [filter]);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await questAPI.getAll(filter);
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await questAPI.create({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        difficulty: formData.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD',
        reward: Number(formData.get('reward')),
        githubIssueUrl: formData.get('githubIssueUrl') as string || undefined,
      });
      setShowCreateForm(false);
      loadQuests();
    } catch (error) {
      console.error('Failed to create quest:', error);
      alert('Failed to create quest. Please login first.');
    }
  };

  return (
    <div className="rpg-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--accent-gold)' }}>📜 Quest Board</h1>
        {user && (
          <button className="rpg-button" onClick={() => setShowCreateForm(!showCreateForm)}>
            <FaPlus /> Post New Quest
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="rpg-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <FaFilter /> <strong>Filters:</strong>

          <select
            className="rpg-select"
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            style={{ padding: '8px', minWidth: '150px' }}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="rpg-select"
            value={filter.difficulty || ''}
            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value || undefined })}
            style={{ padding: '8px', minWidth: '150px' }}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <button className="rpg-button-secondary" onClick={() => setFilter({})} style={{ padding: '8px 16px' }}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Create Quest Form */}
      {showCreateForm && (
        <div className="rpg-card">
          <h2>Create New Quest</h2>
          <form onSubmit={handleCreateQuest} className="rpg-form">
            <input
              type="text"
              name="title"
              placeholder="Quest Title"
              required
              className="rpg-input"
            />
            <textarea
              name="description"
              placeholder="Quest Description"
              required
              className="rpg-textarea"
            />
            <select name="difficulty" required className="rpg-select">
              <option value="">Select Difficulty</option>
              <option value="EASY">Easy (⭐)</option>
              <option value="MEDIUM">Medium (⭐⭐)</option>
              <option value="HARD">Hard (⭐⭐⭐)</option>
            </select>
            <input
              type="number"
              name="reward"
              placeholder="Gold Reward"
              required
              min="1"
              className="rpg-input"
            />
            <input
              type="url"
              name="githubIssueUrl"
              placeholder="GitHub Issue URL (optional)"
              className="rpg-input"
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="rpg-button">Create Quest</button>
              <button type="button" className="rpg-button-secondary" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quest List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : quests.length === 0 ? (
        <div className="rpg-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2em', color: 'var(--text-secondary)' }}>
            No quests found. Be the first to post a quest!
          </p>
        </div>
      ) : (
        <div className="quest-grid">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => navigate(`/quest/${quest.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
