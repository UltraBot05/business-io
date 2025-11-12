import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';
import Board from '../components/game/Board';
import PlayerList from '../components/game/PlayerList';
import GameControls from '../components/game/GameControls';
import PropertyCard from '../components/game/PropertyCard';
import './GameRoom.css';

export default function GameRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [diceRoll, setDiceRoll] = useState([0, 0]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [message, setMessage] = useState('');

  // Get test user from sessionStorage or create new one
  const storedUser = sessionStorage.getItem('testUser');
  const testUser = user || (storedUser ? JSON.parse(storedUser) : { id: 'test-' + Math.random(), username: 'TestPlayer' });

  useEffect(() => {
    console.log('GameRoom mounted, roomCode:', roomCode);
    console.log('Using user:', testUser);
    console.log('Socket connected:', socket.connected, 'Socket ID:', socket.id);
    
    // Check if we just created this room
    const activeRoom = sessionStorage.getItem('activeRoom');
    const isCreator = activeRoom === roomCode;
    
    if (isCreator) {
      console.log('User is room creator, already joined');
      // Clear the flag
      sessionStorage.removeItem('activeRoom');
    } else {
      console.log('User is joining existing room');
      
      // Connect socket if not connected
      if (!socket.connected) {
        console.log('Connecting socket in GameRoom...');
        socket.connect();
      }

      // Join the room
      const joinRoom = () => {
        console.log('Emitting join-room event');
        socket.emit('join-room', { roomCode, userId: testUser.id, username: testUser.username });
      };

      if (socket.connected) {
        joinRoom();
      } else {
        socket.once('connect', () => {
          console.log('Socket connected in GameRoom');
          joinRoom();
        });
      }
    }

    // Socket listeners
    socket.on('room-joined', (data) => {
      setGameState(data.gameState);
      setPlayers(data.players);
      setMessage(`Joined room ${roomCode}`);
    });

    socket.on('game-started', (data) => {
      setGameState(data.gameState);
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setMessage('Game started! Roll the dice!');
    });

    socket.on('player-joined', (data) => {
      setPlayers(data.players);
      setMessage(`${data.username} joined the game`);
    });

    socket.on('player-left', (data) => {
      setPlayers(data.players);
      setMessage(`${data.username} left the game`);
    });

    socket.on('dice-rolled', (data) => {
      setDiceRoll(data.dice);
      setMessage(`${data.username} rolled ${data.dice[0]} + ${data.dice[1]} = ${data.total}`);
    });

    socket.on('player-moved', (data) => {
      setGameState(data.gameState);
      setPlayers(data.players);
    });

    socket.on('turn-changed', (data) => {
      setCurrentPlayer(data.currentPlayer);
      setMessage(`${data.username}'s turn`);
    });

    socket.on('property-bought', (data) => {
      setGameState(data.gameState);
      setPlayers(data.players);
      setMessage(`${data.username} bought ${data.property.name}`);
    });

    socket.on('error', (data) => {
      setMessage(`Error: ${data.message}`);
    });

    return () => {
      socket.off('room-joined');
      socket.off('game-started');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('dice-rolled');
      socket.off('player-moved');
      socket.off('turn-changed');
      socket.off('property-bought');
      socket.off('error');
      // Don't leave room or disconnect on unmount - let user explicitly leave
    };
  }, [roomCode]);

  const handleRollDice = () => {
    socket.emit('roll-dice', { roomCode });
  };

  const handleBuyProperty = () => {
    socket.emit('buy-property', { roomCode });
  };

  const handleEndTurn = () => {
    socket.emit('end-turn', { roomCode });
  };

  const handleStartGame = () => {
    socket.emit('start-game', { roomCode });
  };

  if (!gameState) {
    return (
      <div className="game-room">
        <div className="loading">
          <h2>Loading game...</h2>
          <p>Room code: {roomCode}</p>
          <p>Connecting to server...</p>
          {message && <p style={{color: '#ef4444', marginTop: '20px'}}>{message}</p>}
          <button onClick={() => navigate('/')} style={{marginTop: '20px', padding: '10px 20px', background: '#0891b2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-room">
      <div className="game-header">
        <h2>Room: {roomCode}</h2>
        <button onClick={() => navigate('/lobby')} className="btn-leave">
          Leave Game
        </button>
      </div>

      <div className="game-layout">
        <div className="game-sidebar">
          <PlayerList 
            players={players} 
            currentPlayer={currentPlayer}
            myId={user.id}
          />
          
          <div className="game-message">
            {message}
          </div>
        </div>

        <div className="game-main">
          <Board 
            spaces={gameState.map.spaces}
            players={players}
            onSpaceClick={setSelectedProperty}
          />

          <GameControls
            isMyTurn={currentPlayer === user.id}
            gameStarted={gameState.status === 'playing'}
            onRollDice={handleRollDice}
            onBuyProperty={handleBuyProperty}
            onEndTurn={handleEndTurn}
            onStartGame={handleStartGame}
            diceRoll={diceRoll}
            isHost={gameState.host === user.id}
          />
        </div>

        <div className="game-info">
          {selectedProperty && (
            <PropertyCard 
              property={selectedProperty}
              owner={players.find(p => p.properties?.includes(selectedProperty.id))}
              onClose={() => setSelectedProperty(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
