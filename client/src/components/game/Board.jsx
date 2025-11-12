import './Board.css';

export default function Board({ spaces, players, onSpaceClick }) {
  const getPlayersOnSpace = (spaceId) => {
    return players.filter(p => p.position === spaceId);
  };

  const getSpaceColor = (space) => {
    if (space.color) return space.color;
    return 'transparent';
  };

  return (
    <div className="board">
      {/* Bottom row (0-10) */}
      <div className="board-row board-bottom">
        {spaces.slice(0, 11).map(space => (
          <div 
            key={space.id}
            className={`board-space space-${space.type}`}
            onClick={() => onSpaceClick(space)}
            style={{ borderTopColor: getSpaceColor(space) }}
          >
            <div className="space-name">{space.name}</div>
            {space.price && (
              <div className="space-price">${space.price}</div>
            )}
            <div className="space-players">
              {getPlayersOnSpace(space.id).map(player => (
                <div 
                  key={player.id}
                  className="player-token"
                  style={{ backgroundColor: player.color }}
                  title={player.username}
                >
                  {player.username[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Middle section */}
      <div className="board-middle">
        {/* Left column (11-19) */}
        <div className="board-column board-left">
          {spaces.slice(11, 20).reverse().map(space => (
            <div 
              key={space.id}
              className={`board-space space-${space.type}`}
              onClick={() => onSpaceClick(space)}
              style={{ borderRightColor: getSpaceColor(space) }}
            >
              <div className="space-name">{space.name}</div>
              {space.price && (
                <div className="space-price">${space.price}</div>
              )}
              <div className="space-players">
                {getPlayersOnSpace(space.id).map(player => (
                  <div 
                    key={player.id}
                    className="player-token"
                    style={{ backgroundColor: player.color }}
                    title={player.username}
                  >
                    {player.username[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center area */}
        <div className="board-center">
          <div className="board-logo">
            <img src="/image.png" alt="Logo" className="board-logo-img" />
            <h1>business.io</h1>
          </div>
        </div>

        {/* Right column (29-21) */}
        <div className="board-column board-right">
          {spaces.slice(21, 30).map(space => (
            <div 
              key={space.id}
              className={`board-space space-${space.type}`}
              onClick={() => onSpaceClick(space)}
              style={{ borderLeftColor: getSpaceColor(space) }}
            >
              <div className="space-name">{space.name}</div>
              {space.price && (
                <div className="space-price">${space.price}</div>
              )}
              <div className="space-players">
                {getPlayersOnSpace(space.id).map(player => (
                  <div 
                    key={player.id}
                    className="player-token"
                    style={{ backgroundColor: player.color }}
                    title={player.username}
                  >
                    {player.username[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top row (30-40) */}
      <div className="board-row board-top">
        {spaces.slice(30, 40).reverse().map(space => (
          <div 
            key={space.id}
            className={`board-space space-${space.type}`}
            onClick={() => onSpaceClick(space)}
            style={{ borderBottomColor: getSpaceColor(space) }}
          >
            <div className="space-name">{space.name}</div>
            {space.price && (
              <div className="space-price">${space.price}</div>
            )}
            <div className="space-players">
              {getPlayersOnSpace(space.id).map(player => (
                <div 
                  key={player.id}
                  className="player-token"
                  style={{ backgroundColor: player.color }}
                  title={player.username}
                >
                  {player.username[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
