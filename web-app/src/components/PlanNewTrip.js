import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanNewTrip = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [privacy, setPrivacy] = useState('private');

  const handleStartPlanning = () => {
    navigate('/destinations');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="plan-new-trip">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="page-title">Plan a new trip</h1>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Destination Input */}
        <div className="input-section">
          <div className="destination-input">
            <label className="input-label">Where to?</label>
            <input
              type="text"
              value="Brisbane"
              readOnly
              className="destination-field"
            />
          </div>
        </div>

        {/* Date Section */}
        <div className="date-section">
          <h3 className="section-title">Dates (optional)</h3>
          <div className="date-inputs">
            <div className="date-input-container">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
                placeholder="Start date"
              />
              <div className="date-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{startDate || 'Start date'}</span>
              </div>
            </div>

            <div className="date-input-container">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
                placeholder="End date"
              />
              <div className="date-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{endDate || 'End date'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="options-section">
          <button
            className="option-button"
            onClick={() => setShowInviteFriends(!showInviteFriends)}
          >
            <span className="option-icon">+</span>
            <span>Invite your friends</span>
          </button>

          <div className="privacy-section">
            <div className="privacy-dropdown">
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="privacy-select"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
              </select>
              <div className="dropdown-display">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
                <span>Privacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Planning Button */}
        <button className="start-planning-btn" onClick={handleStartPlanning}>
          Start planning
        </button>
      </div>

      <style jsx>{`
        .plan-new-trip {
          height: 100vh;
          background-color: white;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow-x: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .back-btn {
          background: none;
          border: none;
          padding: 12px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 20px;
          top: 20px;
        }

        .back-btn:hover {
          background-color: rgba(0,0,0,0.1);
        }

        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: black;
          text-align: center;
          margin: 0;
          flex: 1;
        }

        .main-content {
          flex: 1;
          padding: 40px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          position: relative;
        }

        .input-section {
          width: 100%;
        }

        .destination-input {
          position: relative;
        }

        .input-label {
          position: absolute;
          top: -8px;
          left: 20px;
          background: white;
          padding: 0 8px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          z-index: 1;
        }

        .destination-field {
          width: 100%;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 18px;
          color: #999;
          background-color: #f8f8f8;
          outline: none;
          box-sizing: border-box;
        }

        .date-section {
          width: 100%;
        }

        .section-title {
          font-size: 18px;
          font-weight: 500;
          color: #333;
          margin: 0 0 16px 0;
        }

        .date-inputs {
          display: flex;
          gap: 16px;
        }

        .date-input-container {
          flex: 1;
          position: relative;
        }

        .date-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .date-placeholder {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background-color: white;
          cursor: pointer;
          min-height: 60px;
          box-sizing: border-box;
        }

        .date-placeholder:hover {
          border-color: #ccc;
        }

        .date-placeholder svg {
          color: #666;
          flex-shrink: 0;
        }

        .date-placeholder span {
          font-size: 16px;
          color: #999;
        }

        .options-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .option-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0;
          background: none;
          border: none;
          font-size: 16px;
          color: #666;
          cursor: pointer;
          text-align: left;
        }

        .option-icon {
          font-size: 20px;
          color: #999;
          font-weight: 300;
        }

        .privacy-section {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .privacy-dropdown {
          position: relative;
        }

        .privacy-select {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .dropdown-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: none;
          border: none;
          font-size: 16px;
          color: #666;
          cursor: pointer;
        }

        .dropdown-display svg {
          color: #999;
        }

        .start-planning-btn {
          width: 100%;
          padding: 20px;
          background-color: #666;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          margin-top: auto;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .start-planning-btn:hover {
          background-color: #555;
          transform: translateY(-1px);
        }

        .start-planning-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .header {
            padding: 16px;
          }

          .page-title {
            font-size: 20px;
          }

          .main-content {
            padding: 30px 16px 16px;
            gap: 24px;
          }

          .destination-field {
            padding: 16px;
            font-size: 16px;
          }

          .date-placeholder {
            padding: 16px;
            min-height: 54px;
          }

          .start-planning-btn {
            padding: 18px;
            font-size: 16px;
          }

          .date-inputs {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PlanNewTrip;