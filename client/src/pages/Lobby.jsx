import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../utils/socket';
import './Lobby.css';

export default function Lobby() {
  const [activeTab, setActiveTab] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.length === 5) {
      navigate(`/room/${roomCode.toLowerCase()}`);
    }
  };

  return (
    <div className="lobby-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-brand">
            <img src="/image.png" alt="Logo" className="sidebar-logo" />
            business.io
          </h1>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveTab('maps')}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Maps</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="nav-icon">�</span>
            <span className="nav-text">Stats</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar-large">{user?.avatar || '🎩'}</div>
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-coins">💰 {user?.coins || 0} coins</div>
            </div>
          </div>
          <button onClick={logout} className="btn-logout-sidebar">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-section">
            <h1 className="section-title">Game Lobby</h1>
            
            <div className="game-actions">
              <div className="action-card-new">
                <div className="action-icon">🎮</div>
                <h2>Create New Game</h2>
                <p>Host a game and invite your friends</p>
                <button 
                  onClick={() => setShowCreateModal(true)} 
                  className="btn-action"
                >
                  Create Game
                </button>
              </div>

              <div className="action-card-new">
                <div className="action-icon">🔗</div>
                <h2>Join Game</h2>
                <p>Enter a 5-character room code</p>
                <form onSubmit={handleJoinRoom} className="join-form-new">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABC12"
                    maxLength="5"
                    className="room-code-input-new"
                  />
                  <button 
                    type="submit" 
                    className="btn-action"
                    disabled={roomCode.length !== 5}
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maps' && (
          <div className="content-section">
            <h1 className="section-title">Maps</h1>
            <p className="section-subtitle">Choose from 8 unique themed boards</p>
            <div className="maps-grid">
              <div className="map-card unlocked">
                <div className="map-icon">🏛️</div>
                <h3>Classic</h3>
                <p>Traditional Monopoly</p>
                <span className="map-badge">Free</span>
              </div>
              <div className="map-card unlocked">
                <div className="map-icon">💻</div>
                <h3>Tech Valley</h3>
                <p>Silicon Valley theme</p>
                <span className="map-badge">Free</span>
              </div>
              <div className="map-card unlocked">
                <div className="map-icon">🎓</div>
                <h3>Campus</h3>
                <p>College life</p>
                <span className="map-badge">Free</span>
              </div>
              <div className="map-card unlocked">
                <div className="map-icon">🏰</div>
                <h3>Fantasy</h3>
                <p>Magical realm</p>
                <span className="map-badge">Free</span>
              </div>
              <div className="map-card locked">
                <div className="map-icon">🚀</div>
                <h3>Space Station</h3>
                <p>Sci-fi adventure</p>
                <span className="map-badge">200 💰</span>
              </div>
              <div className="map-card locked">
                <div className="map-icon">🌊</div>
                <h3>Ocean World</h3>
                <p>Underwater cities</p>
                <span className="map-badge">350 💰</span>
              </div>
              <div className="map-card locked">
                <div className="map-icon">🎬</div>
                <h3>Movie Studios</h3>
                <p>Hollywood dreams</p>
                <span className="map-badge">500 💰</span>
              </div>
              <div className="map-card locked">
                <div className="map-icon">🌍</div>
                <h3>Historic Cities</h3>
                <p>World capitals</p>
                <span className="map-badge">750 💰</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="content-section">
            <h1 className="section-title">Your Statistics</h1>
            <div className="stats-grid">
              <div className="stat-card-large">
                <div className="stat-icon">🎮</div>
                <div className="stat-value">{user?.stats?.gamesPlayed || 0}</div>
                <div className="stat-label">Games Played</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{user?.stats?.gamesWon || 0}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">🥈</div>
                <div className="stat-value">{user?.stats?.gamesSecond || 0}</div>
                <div className="stat-label">2nd Place</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">🥉</div>
                <div className="stat-value">{user?.stats?.gamesThird || 0}</div>
                <div className="stat-label">3rd Place</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">🏨</div>
                <div className="stat-value">{user?.stats?.hotelsBuilt || 0}</div>
                <div className="stat-label">Hotels Built</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">💰</div>
                <div className="stat-value">{user?.stats?.totalCoinsEarned || 0}</div>
                <div className="stat-label">Total Coins Earned</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="content-section">
            <h1 className="section-title">Profile Settings</h1>
            <p className="section-subtitle">Customize your profile (Coming Soon)</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateGameModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateGameModal({ onClose }) {
  const [selectedMap, setSelectedMap] = useState('classic');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreate = () => {
    const socket = getSocket();
    socket.emit('create-room', {
      userId: user.id,
      username: user.username,
      mapId: selectedMap
    });

    socket.once('room-created', (data) => {
      navigate(`/room/${data.roomCode}`);
    });

    socket.once('error', (data) => {
      alert(`Error: ${data.message}`);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Game</h2>
        
        <div className="form-group">
          <label>Select Map</label>
          <select 
            value={selectedMap} 
            onChange={(e) => setSelectedMap(e.target.value)}
            className="map-select"
          >
            <option value="classic">Classic</option>
            <option value="techValley">Tech Valley</option>
            <option value="campus">College Campus</option>
            <option value="fantasy">Fantasy Realm</option>
          </select>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleCreate} className="btn-primary">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
