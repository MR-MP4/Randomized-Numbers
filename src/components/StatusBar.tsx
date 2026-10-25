import React from 'react';

interface StatusBarProps {
  statusMessage: string;
  onNextDay: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ statusMessage, onNextDay }) => {
  return (
    <footer className="status-bar" aria-live="polite">
      <span id="status-message">{statusMessage}</span>
      <button type="button" id="next-day" onClick={onNextDay}>
        Next Day →
      </button>
    </footer>
  );
};
