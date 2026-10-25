import React, { useState } from 'react';
import { CharityWaterLogo } from './CharityWaterLogo';
import { SettingsModal } from './SettingsModal';
import { FeedbackModal } from './FeedbackModal';

interface MainMenuProps {
  onStartGame: () => void;
  onResetGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onResetGame,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="main-menu-shell">
      <div className="main-menu-card">
        {/* Version label in top right */}
        <div className="menu-version">Version 1.0</div>

        <div className="menu-header">
          <h1 className="menu-title">Water Extract</h1>
          <p className="menu-subtitle">Game inspired by and for Charity: Water</p>
        </div>

        <div className="menu-actions">
          <button
            type="button"
            className="menu-button primary-play-button"
            onClick={onStartGame}
          >
            New game / Play
          </button>

          <div className="menu-sub-actions">
            <button
              type="button"
              className="menu-button secondary-button"
              onClick={() => setIsSettingsOpen(true)}
            >
              Settings
            </button>
            <button
              type="button"
              className="menu-button secondary-button"
              onClick={() => setIsFeedbackOpen(true)}
            >
              Feedback
            </button>
          </div>
        </div>

        {/* Charity: Water logo in bottom-left */}
        <div className="menu-logo-container">
          <CharityWaterLogo size="responsive" />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetGame={onResetGame}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};
