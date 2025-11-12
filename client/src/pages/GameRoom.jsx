// client/src/pages/GameRoom.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket, ensureConnected } from '../utils/socket';
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
  const [currentSpace, setCurrentSpace] = useState(null); // Show current landed space
  const [message, setMessage] = useState('');

  const storedUser = sessionStorage.getItem('testUser');
  const testUser = user || (storedUser ? JSON.parse(storedUser) : { id: 'test-' + Math.random(), username: 'TestPlayer' });

  const socket = getSocket();

  useEffect(() => {
    let mounted = true;
    console.log('GameRoom mounted, roomCode:', roomCode);
    console.log('Using user:', testUser);
    console.log('Socket connected:', socket?.connected, 'Socket ID:', socket?.id);

    const activeRoom = sessionStorage.getItem('activeRoom');
    const isCreator = activeRoom === roomCode;

    const setupListeners = () => {
      socket.on('room-joined', (data) => {
        if (!mounted) return;
        setGameState(data.gameState);
        setPlayers(data.players);
        if (data.currentPlayer) {
          setCurrentPlayer(data.currentPlayer);
        }
        setMessage(`Joined room ${roomCode}`);
      });

      socket.on('game-started', (data) => {
        if (!mounted) return;
        setGameState(data.gameState);
        setPlayers(data.players);
        setCurrentPlayer(data.currentPlayer);
        const currentPlayerName = data.players.find(p => p.id === data.currentPlayer)?.username;
        setMessage(`Game started! ${currentPlayerName}'s turn - Roll the dice!`);
      });

      socket.on('player-joined', (data) => {
        if (!mounted) return;
        setPlayers(data.players);
        setMessage(`${data.username} joined the game`);
      });

      socket.on('player-left', (data) => {
        if (!mounted) return;
        setPlayers(data.players);
        setMessage(`${data.username} left the game`);
      });

      socket.on('dice-rolled', (data) => {
        if (!mounted) return;
        setDiceRoll(data.dice);
        setMessage(`${data.username} rolled ${data.dice[0]} + ${data.dice[1]} = ${data.total}`);
      });

      socket.on('player-moved', (data) => {
        if (!mounted) return;
        setGameState(data.gameState);
        setPlayers(data.players);
        // Show the space the player landed on
        if (data.space) {
          setCurrentSpace(data.space);
        }
      });

      socket.on('turn-changed', (data) => {
        if (!mounted) return;
        setCurrentPlayer(data.currentPlayer);
        setMessage(`${data.username}'s turn`);
        setDiceRoll([0, 0]); // Reset dice for new turn
      });

      socket.on('property-bought', (data) => {
        if (!mounted) return;
        setGameState(data.gameState);
        setPlayers(data.players);
        setMessage(`${data.username} bought ${data.property.name}`);
        setCurrentSpace(null); // Clear current space after buying
      });

      socket.on('special-space', (data) => {
        if (!mounted) return;
        setMessage(`${data.player} landed on ${data.space.name}`);
        if (data.space) {
          setCurrentSpace(data.space);
        }
      });

      socket.on('error', (data) => {
        if (!mounted) return;
        setMessage(`Error: ${data.message}`);
      });
    };

    const tryJoin = async () => {
      if (!socket.connected) {
        ensureConnected();
        await new Promise((res) => {
          const t = setTimeout(() => {
            socket.off('connect', onConnect);
            console.warn('Socket connect timeout (GameRoom)');
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

      // Setup listeners after connected
      setupListeners();

      if (isCreator) {
        // Creator already added to room, but we need to get the game state
        console.log('Fetching game state as creator');
        // Use rejoin to get current state without triggering player-joined event
        socket.emit('rejoin-room', { roomCode, userId: testUser.id, username: testUser.username });
        sessionStorage.removeItem('activeRoom'); // Clear flag after using it
      } else {
        // Join as normal
        console.log('Emitting join-room event');
        socket.emit('join-room', { roomCode, userId: testUser.id, username: testUser.username });
      }
    };

    tryJoin();

    // Rejoin on temporary reconnects (if server supports rejoin by player id)
    function onReconnect() {
      if (!mounted) return;
      console.debug('[socket] reconnect detected, attempting rejoin if needed');
      socket.emit('rejoin-room', { roomCode, userId: testUser.id, username: testUser.username });
    }
    socket.on('connect', () => console.debug('[socket] connected in GameRoom', socket.id));
    socket.on('reconnect', onReconnect);

    return () => {
      mounted = false;
      // Cleanup listeners
      socket.off('room-joined');
      socket.off('game-started');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('dice-rolled');
      socket.off('player-moved');
      socket.off('turn-changed');
      socket.off('property-bought');
      socket.off('special-space');
      socket.off('error');
      socket.off('reconnect');

      // Important: do NOT force leave-room when unmounting if you are the creator (avoid race)
      const wasCreator = sessionStorage.getItem('activeRoom') === roomCode;
      if (!wasCreator) {
        // If a normal participant unmounts (navigates away), emit leave-room
        try {
          socket.emit('leave-room', { roomCode });
        } catch (e) {
          console.warn('Error emitting leave-room on unmount', e);
        }
      } else {
        // For creators: remove activeRoom flag only if they explicitly left previously; keep room alive for short navigations
        sessionStorage.removeItem('activeRoom'); // we've moved into the room; clearing stored flag is safe
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]); // only re-run when roomCode changes

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
            myId={user?.id || testUser.id}
          />
        </div>

        <div className="game-main">
          <div className="board-container">
            <Board 
              spaces={gameState.map.spaces}
              players={players}
              onSpaceClick={setSelectedProperty}
            />
            
            {/* Game log in center of board */}
            {message && (
              <div className="game-log-center">
                {message}
              </div>
            )}
          </div>

          <GameControls
            isMyTurn={currentPlayer === (user?.id || testUser.id)}
            gameStarted={gameState.status === 'playing'}
            onRollDice={handleRollDice}
            onBuyProperty={handleBuyProperty}
            onEndTurn={handleEndTurn}
            onStartGame={handleStartGame}
            diceRoll={diceRoll}
            isHost={gameState.host === (user?.id || testUser.id)}
          />
        </div>

        <div className="game-info">
          {(selectedProperty || currentSpace) && (
            <PropertyCard 
              property={selectedProperty || currentSpace}
              owner={players.find(p => 
                p.properties?.includes((selectedProperty || currentSpace).id) ||
                p.railroads?.includes((selectedProperty || currentSpace).id) ||
                p.utilities?.includes((selectedProperty || currentSpace).id)
              )}
              onClose={() => {
                setSelectedProperty(null);
                setCurrentSpace(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
