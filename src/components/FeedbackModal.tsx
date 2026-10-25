import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackText('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <h2 id="feedback-title">Feedback</h2>
        {submitted ? (
          <div className="feedback-thankyou">
            <p>Thank you for helping support clean water communities!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-content">
            <p className="modal-description">
              Have suggestions for improving the Charity: Water simulation? Let us know below:
            </p>
            <textarea
              className="feedback-textarea"
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your suggestions or comments..."
              required
            />
            <div className="modal-actions">
              <button
                type="button"
                className="close-modal-btn secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="close-modal-btn">
                Send Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
