import React from 'react';

interface ActionPanelProps {
  onBuildPump: () => void;
  onBuildSanitation: () => void;
  onAdvertise: () => void;
  onEducate: () => void;
  pumpRef: React.RefObject<HTMLButtonElement | null>;
  sanitationRef: React.RefObject<HTMLButtonElement | null>;
  educateRef: React.RefObject<HTMLButtonElement | null>;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onBuildPump,
  onBuildSanitation,
  onAdvertise,
  onEducate,
  pumpRef,
  sanitationRef,
  educateRef,
}) => {
  return (
    <section className="bottom-panel">
      <div className="category-panel">
        <h2>Builds and Facilities</h2>
        <p>Build infrastructure to improve access to clean water and sanitation.</p>
        <div className="action-grid">
          <button
            type="button"
            className="action-button"
            id="build-pump"
            ref={pumpRef}
            onClick={onBuildPump}
          >
            <span className="action-icon">＋</span>
            <span>
              <strong>Water Pump</strong>
              <small>Cost: $40 · +Sanitation · +Agriculture</small>
            </span>
          </button>
          <button
            type="button"
            className="action-button"
            id="build-sanitation"
            ref={sanitationRef}
            onClick={onBuildSanitation}
          >
            <span className="action-icon">＋</span>
            <span>
              <strong>Sanitation Station</strong>
              <small>Cost: $30 · +Sanitation</small>
            </span>
          </button>
        </div>
      </div>
      <div className="category-panel">
        <h2>Advertise and Educate</h2>
        <p>Raise awareness and help the community learn.</p>
        <div className="action-grid">
          <button
            type="button"
            className="action-button"
            id="advertise"
            onClick={onAdvertise}
          >
            <span className="action-icon">↗</span>
            <span>
              <strong>Advertise</strong>
              <small>Cost: $15 · +Budget</small>
            </span>
          </button>
          <button
            type="button"
            className="action-button"
            id="educate"
            ref={educateRef}
            onClick={onEducate}
          >
            <span className="action-icon">＋</span>
            <span>
              <strong>Educate</strong>
              <small>Cost: $20 · +Education</small>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
