import './GameControls.css';

export default function GameControls({ 
  isMyTurn, 
  gameStarted, 
  onRollDice, 
  onBuyProperty, 
  onEndTurn, 
  onStartGame,
  diceRoll,
  isHost 
}) {
  return (
    <div className="game-controls">
      {!gameStarted && isHost && (
        <button className="btn-control btn-start" onClick={onStartGame}>
          Start Game
        </button>
      )}

      {gameStarted && (
        <>
          <div className="dice-display">
            <div className="dice">{diceRoll[0] || '?'}</div>
            <div className="dice">{diceRoll[1] || '?'}</div>
          </div>

          <div className="control-buttons">
            <button 
              className="btn-control btn-roll" 
              onClick={onRollDice}
              disabled={!isMyTurn}
            >
              🎲 Roll Dice
            </button>

            <button 
              className="btn-control btn-buy" 
              onClick={onBuyProperty}
              disabled={!isMyTurn}
            >
              💰 Buy Property
            </button>

            <button 
              className="btn-control btn-end" 
              onClick={onEndTurn}
              disabled={!isMyTurn}
            >
              ✓ End Turn
            </button>
          </div>

          {!isMyTurn && (
            <div className="turn-indicator">
              Waiting for other player...
            </div>
          )}
        </>
      )}
    </div>
  );
}
