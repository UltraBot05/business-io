import { useState } from 'react';
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
  const [rolling, setRolling] = useState(false);

  const handleRollDice = () => {
    setRolling(true);
    onRollDice();
    setTimeout(() => setRolling(false), 600);
  };

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
            <div className={`dice ${rolling ? 'rolling' : ''}`}>{diceRoll[0] || '?'}</div>
            <div className={`dice ${rolling ? 'rolling' : ''}`}>{diceRoll[1] || '?'}</div>
          </div>

          <div className="control-buttons">
            <button 
              className="btn-control btn-roll" 
              onClick={handleRollDice}
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
