// client/src/pages/TestLobby.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket, ensureConnected } from '../utils/socket';
import './TestLobby.css';

export default function TestLobby() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async () => {
    setCreating(true);
    console.log('Creating room...');

    // Test user (persisted for GameRoom)
    const testUser = { id: 'test-' + Math.random().toString(36).slice(2, 9), username: 'TestPlayer' };
    sessionStorage.setItem('testUser', JSON.stringify(testUser));

    const socket = getSocket();
    // Ensure socket connected (will create singleton and connect once)
    if (!socket.connected) {
      ensureConnected();
      await new Promise((res) => {
        const t = setTimeout(() => {
          socket.off('connect', onConnect);
          console.warn('Socket connect timeout');
          res();
        }, 4000);
        function onConnect() {
          clearTimeout(t);
          socket.off('connect', onConnect);
          res();
        }
        socket.once('connect', onConnect);
      });
    }

    // Listen for room-created or failure (use once handlers)
    const onCreated = (data) => {
      console.log('Room created:', data);
      sessionStorage.setItem('activeRoom', data.roomCode);
      // navigate only after ack and small safety delay
      setTimeout(() => {
        setCreating(false);
        navigate(`/game/${data.roomCode}`);
      }, 80);
    };

    const onError = (err) => {
      console.error('Socket error on create-room:', err);
      alert('Error creating room: ' + (err?.message || 'Unknown'));
      setCreating(false);
    };

    socket.once('room-created', onCreated);
    socket.once('error', onError);

    // Emit create-room
    socket.emit('create-room', {
      userId: testUser.id,
      username: testUser.username,
      mapId: 'classic'
    });

    // safety timeout: remove listeners in case no response
    setTimeout(() => {
      socket.off('room-created', onCreated);
      socket.off('error', onError);
      if (creating) {
        setCreating(false);
        alert('Room creation timed out. Check server logs.');
      }
    }, 8000);
  };

  const handleJoinRoom = () => {
    if (!roomCode) {
      alert('Please enter a room code');
      return;
    }
    // store testUser if none
    if (!sessionStorage.getItem('testUser')) {
      const t = { id: 'test-' + Math.random().toString(36).slice(2, 9), username: 'TestPlayer' };
      sessionStorage.setItem('testUser', JSON.stringify(t));
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
