import React from 'react';

interface TopBarProps {
  budget: number;
  day: number;
  onNavigate: (section: 'builds' | 'sanitation' | 'agriculture' | 'education') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ budget, day, onNavigate }) => {
  return (
    <header className="top-bar">
      <div className="resource resource-budget">
        Budget <strong id="budget-value">${budget}</strong>
      </div>
      <div className="top-nav">
        <button
          type="button"
          className="nav-button"
          onClick={() => onNavigate('builds')}
          data-scroll="builds"
        >
          Builds
        </button>
        <button
          type="button"
          className="nav-button"
          onClick={() => onNavigate('sanitation')}
          data-scroll="sanitation"
        >
          Sanitation
        </button>
        <button
          type="button"
          className="nav-button"
          onClick={() => onNavigate('agriculture')}
          data-scroll="agriculture"
        >
          Agriculture
        </button>
        <button
          type="button"
          className="nav-button"
          onClick={() => onNavigate('education')}
          data-scroll="education"
        >
          Education
        </button>
      </div>
      <div className="resource resource-day">
        Day <strong id="day-value">{day}</strong>
      </div>
    </header>
  );
};
