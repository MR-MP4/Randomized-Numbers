import React from 'react';
import { GameState } from '../types';
import { CharityWaterLogo } from './CharityWaterLogo';

interface AccomplishmentModalProps {
  isOpen: boolean;
  gameState: GameState;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export const AccomplishmentModal: React.FC<AccomplishmentModalProps> = ({
  isOpen,
  gameState,
  onRestart,
  onReturnToMenu,
}) => {
  if (!isOpen) return null;

  const peopleServed =
    gameState.waterPumps * 250 + gameState.sanitationStations * 150;
  const waterDeliveredLiters =
    gameState.waterPumps * 12500 + gameState.agriculture * 750;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card accomplishment-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accomplishment-title"
      >
        <div className="accomplishment-header">
          <span className="accomplishment-tag">🏁 Simulation Concluded</span>
          <span className="budget-depleted-badge">Budget Exhausted (${gameState.budget})</span>
        </div>

        <h2 id="accomplishment-title" className="accomplishment-title">
          Community Accomplishments
        </h2>

        <p className="accomplishment-intro">
          You don't have enough budget remaining to purchase or build any more facilities or campaigns. Look at everything you built and achieved for the community:
        </p>

        {/* Highlight Impact Numbers */}
        <div className="impact-hero-banner">
          <div className="impact-hero-item">
            <span className="impact-hero-num">
              {peopleServed > 0 ? peopleServed.toLocaleString() : '0'}
            </span>
            <span className="impact-hero-label">People Gained Clean Water & Hygiene</span>
          </div>
          <div className="impact-hero-item">
            <span className="impact-hero-num">Day {gameState.day}</span>
            <span className="impact-hero-label">Community Days Managed</span>
          </div>
        </div>

        {/* Accomplishment breakdown grid */}
        <div className="accomplishment-grid">
          <div className="accomplishment-item">
            <span className="item-icon">🚰</span>
            <div className="item-details">
              <strong>{gameState.waterPumps} Water Pumps Built</strong>
              <small>Delivered ~{waterDeliveredLiters.toLocaleString()} L of clean groundwater</small>
            </div>
          </div>

          <div className="accomplishment-item">
            <span className="item-icon">🧼</span>
            <div className="item-details">
              <strong>{gameState.sanitationStations} Sanitation Stations</strong>
              <small>Sanitation Level: {gameState.sanitation} · Prevented waterborne disease</small>
            </div>
          </div>

          <div className="accomplishment-item">
            <span className="item-icon">🌾</span>
            <div className="item-details">
              <strong>Agriculture Level: {gameState.agriculture}</strong>
              <small>Clean irrigation supported local crops & food security</small>
            </div>
          </div>

          <div className="accomplishment-item">
            <span className="item-icon">📚</span>
            <div className="item-details">
              <strong>Education Level: {gameState.education}</strong>
              <small>Community hygiene & local water maintenance technician training</small>
            </div>
          </div>
        </div>

        {/* Charity Water tribute footer */}
        <div className="charity-mission-card">
          <CharityWaterLogo size="sm" />
          <div className="charity-mission-text">
            <strong>Every Project Counts</strong>
            <span>
              In real life, 100% of public donations to Charity: Water directly fund sustainable clean water projects in developing communities.
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="modal-actions accomplishment-actions">
          <button
            type="button"
            className="close-modal-btn secondary"
            onClick={onReturnToMenu}
          >
            Main Menu
          </button>
          <button
            type="button"
            className="close-modal-btn restart-action-btn"
            onClick={onRestart}
          >
            Start Over / Play Again ↺
          </button>
        </div>
      </div>
    </div>
  );
};
