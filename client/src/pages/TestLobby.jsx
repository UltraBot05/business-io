import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import './TestLobby.css';

export default function TestLobby() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = () => {
    setCreating(true);
    console.log('Creating room...');
    
    const testUser = { id: 'test-' + Math.random(), username: 'TestPlayer' };
    
    // Store user in sessionStorage for GameRoom to use
    sessionStorage.setItem('testUser', JSON.stringify(testUser));
    
    // Connect socket if not connected
    if (!socket.connected) {
      console.log('Connecting socket...');
      socket.connect();
      
      socket.once('connect', () => {
        console.log('Socket connected:', socket.id);
        createRoom(testUser);
      });
    } else {
      console.log('Socket already connected');
      createRoom(testUser);
    }
  };

  const createRoom = (testUser) => {
    // Create room
    socket.emit('create-room', { 
      userId: testUser.id, 
      username: testUser.username, 
      mapId: 'classic' 
    });
    console.log('Emitted create-room event');

    socket.once('room-created', (data) => {
      console.log('Room created:', data);
      // Store room code and navigate without disconnecting
      sessionStorage.setItem('activeRoom', data.roomCode);
      // Small delay to ensure socket is stable before navigation
      setTimeout(() => {
        navigate(`/game/${data.roomCode}`);
      }, 100);
    });

    socket.once('error', (error) => {
      console.error('Socket error:', error);
      alert('Error creating room: ' + error.message);
      setCreating(false);
    });
  };

  const handleJoinRoom = () => {
    if (!roomCode) {
      alert('Please enter a room code');
      return;
    }
    navigate(`/game/${roomCode.toUpperCase()}`);
  };

  return (
    <div className="test-lobby">
      <div className="test-lobby-content">
        <img src="/image.png" alt="Logo" className="test-logo" />
        <h1>business.io</h1>
        <p>Test Game Room</p>

        <div className="test-actions">
          <button 
            onClick={handleCreateRoom} 
            disabled={creating}
            className="btn-test btn-create"
          >
            {creating ? 'Creating...' : 'Create New Room'}
          </button>

          <div className="divider">OR</div>

          <div className="join-section">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="input-code"
            />
            <button 
              onClick={handleJoinRoom}
              className="btn-test btn-join"
            >
              Join Room
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="btn-back"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
