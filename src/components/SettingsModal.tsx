import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetGame,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <h2 id="settings-title">Settings</h2>
        <div className="modal-content">
          <div className="setting-row">
            <span>Sound Effects & Clicks</span>
            <button
              type="button"
              className="toggle-button"
              onClick={onToggleSound}
            >
              {soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="setting-row">
            <span>Display Mode</span>
            <span className="setting-tag">Desktop View (Optimized)</span>
          </div>
          <div className="setting-row">
            <span>Reset Progress</span>
            <button
              type="button"
              className="danger-button"
              onClick={() => {
                onResetGame();
                onClose();
              }}
            >
              Restart Simulation
            </button>
          </div>
        </div>
        <button type="button" className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
