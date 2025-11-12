import './PlayerList.css';

export default function PlayerList({ players, currentPlayer, myId }) {
  return (
    <div className="player-list">
      <h3>Players</h3>
      <div className="players">
        {players.map(player => (
          <div 
            key={player.id}
            className={`player-card ${currentPlayer === player.id ? 'active' : ''} ${myId === player.id ? 'me' : ''}`}
          >
            <div 
              className="player-avatar"
              style={{ backgroundColor: player.color }}
            >
              {player.username[0].toUpperCase()}
            </div>
            <div className="player-info">
              <div className="player-name">
                {player.username}
                {myId === player.id && <span className="badge-me">You</span>}
              </div>
              <div className="player-money">${player.money}</div>
              <div className="player-properties">
                {player.properties?.length || 0} properties
              </div>
            </div>
            {currentPlayer === player.id && (
              <div className="turn-badge">🎲</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
