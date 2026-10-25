import React, { useState, useRef, useEffect } from 'react';
import {
  GameState,
  INITIAL_STATE,
  COSTS,
  REWARDS,
  DisruptionEvent,
  PUMP_DISRUPTIONS,
  SANITATION_DISRUPTIONS,
} from '../types';
import { CharityWaterLogo } from './CharityWaterLogo';
import { DisruptionModal } from './DisruptionModal';
import { AccomplishmentModal } from './AccomplishmentModal';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  statusMessage: string;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
  onReturnToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  setGameState,
  statusMessage,
  setStatusMessage,
  onReturnToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'builds' | 'other'>('builds');
  const [todayActions, setTodayActions] = useState<string[]>([]);
  const [currentDisruption, setCurrentDisruption] = useState<DisruptionEvent | null>(
    null
  );
  const [isGameOver, setIsGameOver] = useState(false);

  const pumpBtnRef = useRef<HTMLButtonElement | null>(null);
  const sanitationBtnRef = useRef<HTMLButtonElement | null>(null);
  const educateBtnRef = useRef<HTMLButtonElement | null>(null);
  const advertiseBtnRef = useRef<HTMLButtonElement | null>(null);

  // Calculate repair cost with education discount
  const getEducationDiscountPercent = () => {
    return Math.min(60, gameState.education * 5);
  };

  const calculateRepairCost = (baseCost: number) => {
    const discountPercent = getEducationDiscountPercent();
    const discountAmount = Math.round((baseCost * discountPercent) / 100);
    return Math.max(5, baseCost - discountAmount);
  };

  const pumpRepairPrice = calculateRepairCost(20);
  const sanitationRepairPrice = calculateRepairCost(20);

  // Check if budget is zero or not enough to buy anything
  useEffect(() => {
    const availableCosts: number[] = [COSTS.advertise];
    if (gameState.damagedPumps > 0) availableCosts.push(pumpRepairPrice);
    if (gameState.damagedSanitation > 0) availableCosts.push(sanitationRepairPrice);
    const minActionCost = Math.min(...availableCosts);

    if (gameState.budget === 0 || gameState.budget < minActionCost) {
      const timer = setTimeout(() => {
        setIsGameOver(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsGameOver(false);
    }
  }, [
    gameState.budget,
    gameState.damagedPumps,
    gameState.damagedSanitation,
    pumpRepairPrice,
    sanitationRepairPrice,
  ]);

  const handleBuildPump = () => {
    if (gameState.budget < COSTS.waterPump) {
      setStatusMessage(
        `Not enough budget. You need $${COSTS.waterPump}, but have $${gameState.budget}.`
      );
      return;
    }

    setGameState((prev) => ({
      ...prev,
      budget: prev.budget - COSTS.waterPump,
      builds: prev.builds + 1,
      waterPumps: prev.waterPumps + 1,
      sanitation: prev.sanitation + REWARDS.waterPump.sanitation,
      agriculture: prev.agriculture + REWARDS.waterPump.agriculture,
    }));
    setTodayActions((prev) => [...prev, 'Water Pump (+$2 San, +$2 Agr)']);
    setStatusMessage('Water pump built! Sanitation (+2) and agriculture (+2) increased.');
  };

  const handleBuildSanitation = () => {
    if (gameState.budget < COSTS.sanitationStation) {
      setStatusMessage(
        `Not enough budget. You need $${COSTS.sanitationStation}, but have $${gameState.budget}.`
      );
      return;
    }

    setGameState((prev) => ({
      ...prev,
      budget: prev.budget - COSTS.sanitationStation,
      builds: prev.builds + 1,
      sanitationStations: prev.sanitationStations + 1,
      sanitation: prev.sanitation + REWARDS.sanitationStation.sanitation,
    }));
    setTodayActions((prev) => [...prev, 'Sanitation Station (+$3 San)']);
    setStatusMessage('Sanitation station built! Sanitation (+3) increased.');
  };

  const handleAdvertise = () => {
    if (gameState.budget < COSTS.advertise) {
      setStatusMessage(
        `Not enough budget. You need $${COSTS.advertise}, but have $${gameState.budget}.`
      );
      return;
    }

    const netGain = REWARDS.advertise.budget - COSTS.advertise;
    setGameState((prev) => ({
      ...prev,
      budget: prev.budget - COSTS.advertise + REWARDS.advertise.budget,
    }));
    setTodayActions((prev) => [...prev, `Advertised (+$${netGain} net)`]);
    setStatusMessage(
      `Advertising campaign complete. Budget increased by $${netGain} net.`
    );
  };

  const handleEducate = () => {
    if (gameState.budget < COSTS.educate) {
      setStatusMessage(
        `Not enough budget. You need $${COSTS.educate}, but have $${gameState.budget}.`
      );
      return;
    }

    setGameState((prev) => ({
      ...prev,
      budget: prev.budget - COSTS.educate,
      education: prev.education + REWARDS.educate.education,
    }));
    setTodayActions((prev) => [...prev, 'Educated (+$2 Edu)']);
    setStatusMessage('Education campaign complete! Education (+2) increased.');
  };

  const handleRepairFacility = (event: DisruptionEvent, cost: number) => {
    if (gameState.budget < cost) {
      setStatusMessage(
        `Not enough budget to repair. You need $${cost}, but have $${gameState.budget}.`
      );
      return;
    }

    const facLabel =
      event.facilityType === 'waterPump' ? 'Water Pump' : 'Sanitation Station';

    setGameState((prev) => {
      if (event.facilityType === 'waterPump') {
        return {
          ...prev,
          budget: prev.budget - cost,
          damagedPumps: Math.max(0, prev.damagedPumps - 1),
          sanitation: prev.sanitation + REWARDS.waterPump.sanitation,
          agriculture: prev.agriculture + REWARDS.waterPump.agriculture,
        };
      } else {
        return {
          ...prev,
          budget: prev.budget - cost,
          damagedSanitation: Math.max(0, prev.damagedSanitation - 1),
          sanitation: prev.sanitation + REWARDS.sanitationStation.sanitation,
        };
      }
    });

    setTodayActions((prev) => [...prev, `Repaired ${facLabel} (-$${cost})`]);
    setStatusMessage(`${facLabel} repaired! Restored community output.`);
    setCurrentDisruption(null);
  };

  const handleQuickRepair = (type: 'waterPump' | 'sanitationStation') => {
    const cost = type === 'waterPump' ? pumpRepairPrice : sanitationRepairPrice;
    if (gameState.budget < cost) {
      setStatusMessage(
        `Not enough budget to repair. You need $${cost}, but have $${gameState.budget}.`
      );
      return;
    }

    const facLabel =
      type === 'waterPump' ? 'Water Pump' : 'Sanitation Station';

    setGameState((prev) => {
      if (type === 'waterPump') {
        return {
          ...prev,
          budget: prev.budget - cost,
          damagedPumps: Math.max(0, prev.damagedPumps - 1),
          sanitation: prev.sanitation + REWARDS.waterPump.sanitation,
          agriculture: prev.agriculture + REWARDS.waterPump.agriculture,
        };
      } else {
        return {
          ...prev,
          budget: prev.budget - cost,
          damagedSanitation: Math.max(0, prev.damagedSanitation - 1),
          sanitation: prev.sanitation + REWARDS.sanitationStation.sanitation,
        };
      }
    });

    setTodayActions((prev) => [...prev, `Repaired ${facLabel} (-$${cost})`]);
    setStatusMessage(`${facLabel} repaired! Community output restored.`);
  };

  const handleNextDay = () => {
    setTodayActions([]);
    const nextDay = gameState.day + 1;

    // Check if disruption event can happen:
    // Only happens if there is one or more buildings already built!
    const activePumps = gameState.waterPumps - gameState.damagedPumps;
    const activeSanitation =
      gameState.sanitationStations - gameState.damagedSanitation;
    const totalActive = activePumps + activeSanitation;

    // Low chance (25% chance) per day if buildings exist
    const willDisrupt = totalActive >= 1 && Math.random() < 0.25;

    if (willDisrupt) {
      let facilityType: 'waterPump' | 'sanitationStation';
      if (activePumps > 0 && activeSanitation > 0) {
        facilityType = Math.random() < 0.5 ? 'waterPump' : 'sanitationStation';
      } else if (activePumps > 0) {
        facilityType = 'waterPump';
      } else {
        facilityType = 'sanitationStation';
      }

      const pool =
        facilityType === 'waterPump'
          ? PUMP_DISRUPTIONS
          : SANITATION_DISRUPTIONS;
      const template = pool[Math.floor(Math.random() * pool.length)];
      const event: DisruptionEvent = {
        ...template,
        id: `disruption-${Date.now()}`,
        facilityType,
      };

      setGameState((prev) => {
        if (facilityType === 'waterPump') {
          return {
            ...prev,
            day: nextDay,
            damagedPumps: prev.damagedPumps + 1,
            sanitation: Math.max(0, prev.sanitation - REWARDS.waterPump.sanitation),
            agriculture: Math.max(0, prev.agriculture - REWARDS.waterPump.agriculture),
          };
        } else {
          return {
            ...prev,
            day: nextDay,
            damagedSanitation: prev.damagedSanitation + 1,
            sanitation: Math.max(
              0,
              prev.sanitation - REWARDS.sanitationStation.sanitation
            ),
          };
        }
      });

      setCurrentDisruption(event);
      const facName =
        facilityType === 'waterPump' ? 'Water Pump' : 'Sanitation Station';
      setStatusMessage(
        `⚠️ Day ${nextDay} Event: ${facName} disrupted! ${event.title}.`
      );
    } else {
      setGameState((prev) => ({
        ...prev,
        day: nextDay,
      }));
      setStatusMessage(`Day ${nextDay} started. Choose your next action.`);
    }
  };

  const handleResetGame = () => {
    setTodayActions([]);
    setCurrentDisruption(null);
    setIsGameOver(false);
    setGameState(INITIAL_STATE);
    setStatusMessage('Game reset to Day 1 with $100 budget. Started over!');
  };

  const totalDamaged = gameState.damagedPumps + gameState.damagedSanitation;

  return (
    <div className="game-desktop-shell">
      <div className="game-container">
        {/* Top Bar matching mockup */}
        <header className="mockup-top-bar">
          <div className="top-tab budget-tab">
            <span className="tab-label">Budget</span>
            <strong className="tab-value">${gameState.budget}</strong>
          </div>

          <nav className="top-nav-group" aria-label="Game resource metrics">
            <div className="top-nav-stat">
              <span className="stat-label">Builds</span>
              <strong className="stat-value">
                {gameState.builds}
                {totalDamaged > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#b91c1c',
                      marginLeft: '3px',
                    }}
                    title={`${totalDamaged} facility needs repair`}
                  >
                    ({totalDamaged}⚠️)
                  </span>
                )}
              </strong>
            </div>
            <div className="top-nav-stat">
              <span className="stat-label">Sanitation</span>
              <strong className="stat-value">{gameState.sanitation}</strong>
            </div>
            <div className="top-nav-stat">
              <span className="stat-label">Agriculture</span>
              <strong className="stat-value">{gameState.agriculture}</strong>
            </div>
            <div className="top-nav-stat">
              <span className="stat-label">Education</span>
              <strong className="stat-value">{gameState.education}</strong>
            </div>
          </nav>

          <div className="top-tab day-tab">
            <span className="tab-label">Day</span>
            <strong className="tab-value">{gameState.day}</strong>
          </div>

          <button
            type="button"
            className="game-reset-btn"
            onClick={handleResetGame}
            title="Reset game and start over"
          >
            Reset
          </button>

          <button
            type="button"
            className="menu-return-btn"
            onClick={onReturnToMenu}
            title="Return to Main Menu"
          >
            ⌂ Menu
          </button>
        </header>

        {/* World Screen Area matching mockup (No worker, No background texture) */}
        <div className="mockup-world">
          <div className="mockup-sky" />
          <div className="mockup-ground" />

          {/* Left building: Well / Water Pump */}
          <div
            className="mockup-pump-art"
            onClick={handleBuildPump}
            title="Water Pump (Click to build - Cost: $40)"
          >
            {gameState.damagedPumps > 0 && (
              <div className="building-damage-badge">
                ⚠️ {gameState.damagedPumps} Disrupted
              </div>
            )}
            <div className="mockup-pump-roof" />
            <div className="mockup-pump-post post-left" />
            <div className="mockup-pump-post post-right" />
            <div className="mockup-pump-base" />
            <div className="building-badge">
              <span>Water Pump ({gameState.waterPumps})</span>
              <small>Cost $40</small>
            </div>
          </div>

          {/* Right building: Sanitation Station / House */}
          <div
            className="mockup-sanitation-art"
            onClick={handleBuildSanitation}
            title="Sanitation Station (Click to build - Cost: $30)"
          >
            {gameState.damagedSanitation > 0 && (
              <div className="building-damage-badge">
                ⚠️ {gameState.damagedSanitation} Disrupted
              </div>
            )}
            <div className="mockup-station-roof" />
            <div className="mockup-station-body" />
            <div className="building-badge">
              <span>Sanitation Station ({gameState.sanitationStations})</span>
              <small>Cost $30</small>
            </div>
          </div>

          {/* Charity: Water logo in lower right corner of game screen */}
          <div className="world-corner-logo">
            <CharityWaterLogo size="sm" />
          </div>
        </div>

        {/* Bottom Category Tab Bar matching mockup */}
        <div className="mockup-category-tabs">
          <button
            type="button"
            className={`category-tab-btn ${
              activeTab === 'other' ? 'active-cat-tab' : ''
            }`}
            onClick={() => setActiveTab('other')}
          >
            Other like Advertise and Educate
          </button>
          <button
            type="button"
            className={`category-tab-btn ${
              activeTab === 'builds' ? 'active-cat-tab' : ''
            }`}
            onClick={() => setActiveTab('builds')}
          >
            Builds and Facilities {totalDamaged > 0 ? `(⚠️ ${totalDamaged})` : ''}
          </button>
        </div>

        {/* Bottom Action Area */}
        <div className="mockup-bottom-panel">
          {activeTab === 'builds' ? (
            <div className="category-action-container">
              {/* If any facilities are disrupted, show quick repair maintenance card */}
              {totalDamaged > 0 && (
                <div className="repair-banner-card">
                  <div className="repair-banner-info">
                    <strong>⚠️ Facility Maintenance Needed ({totalDamaged})</strong>
                    <span>
                      Education Discount: -{getEducationDiscountPercent()}% (saves{' '}
                      {getEducationDiscountPercent()}% on repair labor)
                    </span>
                  </div>
                  <div className="repair-banner-actions">
                    {gameState.damagedPumps > 0 && (
                      <button
                        type="button"
                        className="quick-repair-btn"
                        onClick={() => handleQuickRepair('waterPump')}
                        disabled={gameState.budget < pumpRepairPrice}
                      >
                        Repair Water Pump (${pumpRepairPrice})
                      </button>
                    )}
                    {gameState.damagedSanitation > 0 && (
                      <button
                        type="button"
                        className="quick-repair-btn"
                        onClick={() => handleQuickRepair('sanitationStation')}
                        disabled={gameState.budget < sanitationRepairPrice}
                      >
                        Repair Station (${sanitationRepairPrice})
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="category-header-info">
                <h3>Builds and Facilities</h3>
                <p>Construct vital infrastructure to supply clean water and sanitary waste management.</p>
              </div>
              <div className="action-buttons-row">
                <button
                  type="button"
                  ref={pumpBtnRef}
                  className="mockup-action-card"
                  onClick={handleBuildPump}
                  disabled={gameState.budget < COSTS.waterPump}
                >
                  <div className="action-card-icon">＋</div>
                  <div className="action-card-text">
                    <strong>Water Pump ({gameState.waterPumps} built)</strong>
                    <span>Cost: $40</span>
                    <small>+2 Sanitation · +2 Agriculture</small>
                  </div>
                </button>

                <button
                  type="button"
                  ref={sanitationBtnRef}
                  className="mockup-action-card"
                  onClick={handleBuildSanitation}
                  disabled={gameState.budget < COSTS.sanitationStation}
                >
                  <div className="action-card-icon">＋</div>
                  <div className="action-card-text">
                    <strong>Sanitation Station ({gameState.sanitationStations} built)</strong>
                    <span>Cost: $30</span>
                    <small>+3 Sanitation</small>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="category-action-container">
              <div className="category-header-info">
                <h3>Other like Advertise and Educate</h3>
                <p>Empower local leaders with hygiene education and run fundraising campaigns for fresh funds.</p>
              </div>
              <div className="action-buttons-row">
                <button
                  type="button"
                  ref={advertiseBtnRef}
                  className="mockup-action-card"
                  onClick={handleAdvertise}
                  disabled={gameState.budget < COSTS.advertise}
                >
                  <div className="action-card-icon">↗</div>
                  <div className="action-card-text">
                    <strong>Advertise Campaign</strong>
                    <span>Cost: $15</span>
                    <small>+$30 return (+$15 net budget)</small>
                  </div>
                </button>

                <button
                  type="button"
                  ref={educateBtnRef}
                  className="mockup-action-card"
                  onClick={handleEducate}
                  disabled={gameState.budget < COSTS.educate}
                >
                  <div className="action-card-icon">＋</div>
                  <div className="action-card-text">
                    <strong>Community Education</strong>
                    <span>Cost: $20 · Discount Level: -{getEducationDiscountPercent()}%</span>
                    <small>+2 Education (increases facility repair discounts)</small>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar: displays only what is being done that day */}
        <footer className="mockup-status-bar">
          <div className="status-feedback">
            <span className="status-indicator-dot" />
            <div className="daily-activity-content">
              <span className="daily-label">Day {gameState.day} Activity:</span>
              <span className="status-text">
                {statusMessage.startsWith('Not enough') ||
                statusMessage.startsWith('⚠️')
                  ? statusMessage
                  : todayActions.length > 0
                  ? todayActions.join(' · ')
                  : 'No actions taken yet today.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="next-day-btn"
            onClick={handleNextDay}
          >
            Next Day →
          </button>
        </footer>
      </div>

      {/* Disruption Pop-up Modal */}
      <DisruptionModal
        event={currentDisruption}
        budget={gameState.budget}
        education={gameState.education}
        onRepair={handleRepairFacility}
        onPostpone={() => setCurrentDisruption(null)}
      />

      {/* Accomplishment / Out of Budget Modal */}
      <AccomplishmentModal
        isOpen={isGameOver}
        gameState={gameState}
        onRestart={handleResetGame}
        onReturnToMenu={onReturnToMenu}
      />
    </div>
  );
};
