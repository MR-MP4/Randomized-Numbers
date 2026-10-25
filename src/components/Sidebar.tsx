import React from 'react';

interface SidebarProps {
  sanitation: number;
  agriculture: number;
  education: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sanitation,
  agriculture,
  education,
}) => {
  return (
    <aside className="sidebar">
      <div className="brand-placeholder">
        Charity: Water
        <br />
        <small>Image here</small>
      </div>
      <h1>Water Extract</h1>
      <p className="subtitle">Game inspired by and for Charity: Water</p>
      <div className="stats">
        <div>
          <span>Sanitation</span>
          <strong id="sanitation-value">{sanitation}</strong>
        </div>
        <div>
          <span>Agriculture</span>
          <strong id="agriculture-value">{agriculture}</strong>
        </div>
        <div>
          <span>Education</span>
          <strong id="education-value">{education}</strong>
        </div>
      </div>
      <div className="worker-card">
        <div className="worker-card-placeholder">Worker image here</div>
        <p>MC / Worker from Charity: Water</p>
      </div>
      <div className="version">Version 1.0</div>
    </aside>
  );
};
