import React from 'react';

export const World: React.FC = () => {
  return (
    <section className="world" aria-label="Game map">
      <div className="sky"></div>
      <div className="ground"></div>
      <div className="background-placeholder">Background image here</div>
      <div className="water-pump-art" aria-hidden="true">
        <div className="pump-roof"></div>
        <div className="pump-post post-left"></div>
        <div className="pump-post post-right"></div>
        <div className="pump-base"></div>
      </div>
      <div className="sanitation-art" aria-hidden="true">
        <div className="station-roof"></div>
        <div className="station-body"></div>
      </div>
      <div className="worker-placeholder">Worker image here</div>
      <div className="charity-placeholder">Charity: Water image here</div>
      <div className="map-caption">Background of game map</div>
    </section>
  );
};
