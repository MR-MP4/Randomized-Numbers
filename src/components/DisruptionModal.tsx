import React from 'react';
import { DisruptionEvent } from '../types';

interface DisruptionModalProps {
  event: DisruptionEvent | null;
  budget: number;
  education: number;
  onRepair: (event: DisruptionEvent, cost: number) => void;
  onPostpone: () => void;
}

export const DisruptionModal: React.FC<DisruptionModalProps> = ({
  event,
  budget,
  education,
  onRepair,
  onPostpone,
}) => {
  if (!event) return null;

  // Each point of education provides a 5% discount (capped at 60%)
  const discountPercent = Math.min(60, education * 5);
  const discountAmount = Math.round((event.baseCost * discountPercent) / 100);
  const finalCost = Math.max(5, event.baseCost - discountAmount);
  const canAfford = budget >= finalCost;

  const facilityLabel =
    event.facilityType === 'waterPump' ? 'Water Pump' : 'Sanitation Station';

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card disruption-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disruption-title"
      >
        <div className="disruption-header">
          <span className="disruption-alert-badge">⚠️ Facility Disruption</span>
          <span className="disruption-facility-tag">{facilityLabel}</span>
        </div>

        <h2 id="disruption-title" className="disruption-event-title">
          {event.title}
        </h2>

        <div className="disruption-cause-box">
          <span className="cause-heading">Reported Cause:</span>
          <p className="cause-text">{event.cause}</p>
        </div>

        <div className="disruption-impact-note">
          {event.facilityType === 'waterPump' ? (
            <span>Impact: -2 Sanitation & -2 Agriculture until repaired.</span>
          ) : (
            <span>Impact: -3 Sanitation until repaired.</span>
          )}
        </div>

        <div className="repair-cost-breakdown">
          <div className="cost-row">
            <span>Base Repair Cost:</span>
            <strong>${event.baseCost}</strong>
          </div>
          <div className="cost-row discount-row">
            <span>
              Education Discount ({education} Edu · {discountPercent}%):
            </span>
            <strong className="discount-value">-${discountAmount}</strong>
          </div>
          <div className="cost-row total-row">
            <span>Final Repair Cost:</span>
            <strong className="final-price">${finalCost}</strong>
          </div>

          <div className="education-perk-explanation">
            💡 Local maintenance training: High education enables community members to service facilities with local parts!
          </div>
        </div>

        {!canAfford && (
          <div className="disruption-budget-warning">
            ⚠️ Insufficient budget (${budget}). You can postpone and repair this from the Builds panel once you have enough funds.
          </div>
        )}

        <div className="modal-actions disruption-actions">
          <button
            type="button"
            className="close-modal-btn secondary"
            onClick={onPostpone}
          >
            {canAfford ? 'Repair Later' : 'Dismiss & Repair Later'}
          </button>

          {canAfford && (
            <button
              type="button"
              className="close-modal-btn repair-confirm-btn"
              onClick={() => onRepair(event, finalCost)}
            >
              Repair Facility (${finalCost})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
