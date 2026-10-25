import React, { useState } from 'react';
import { GameState, INITIAL_STATE } from './types';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import './styles.css';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Welcome! Choose an action to get started.'
  );

  const handleResetGame = () => {
    setGameState(INITIAL_STATE);
    setStatusMessage('Game reset to Day 1.');
  };

  return (
    <div className="app-viewport">
      {screen === 'menu' ? (
        <MainMenu
          onStartGame={() => setScreen('game')}
          onResetGame={handleResetGame}
        />
      ) : (
        <GameScreen
          gameState={gameState}
          setGameState={setGameState}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
          onReturnToMenu={() => setScreen('menu')}
        />
      )}
    </div>
  );
};

export default App;
