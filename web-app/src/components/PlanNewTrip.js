import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanNewTrip = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('start'); // 'start' or 'end'
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inviteEmail, setInviteEmail] = useState('');
  const [privacy, setPrivacy] = useState('private');

  const handleStartPlanning = () => {
    navigate('/destinations');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDateClick = (type) => {
    setDatePickerType(type);
    setSelectedDate(type === 'start' ? startDate : endDate);
    setShowDatePicker(true);
  };

  const handleDateSave = () => {
    if (datePickerType === 'start') {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setSelectedDate('');
    setShowDatePicker(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isDateSelected = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return selectedDate === dateString;
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleInviteEmailSubmit = () => {
    if (inviteEmail.trim()) {
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://cotrip.app/invite/xyz123');
    alert('Invite link copied to clipboard!');
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <div className="date-input-container" onClick={() => handleDateClick('start')}>
              <div className="date-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{formatDate(startDate) || 'Start date'}</span>
              </div>
            </div>

            <div className="date-input-container" onClick={() => handleDateClick('end')}>
              <div className="date-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{formatDate(endDate) || 'End date'}</span>
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

      {/* Date Picker Popup */}
      {showDatePicker && (
        <div className="popup-overlay" onClick={handleDateCancel}>
          <div className="date-picker-popup" onClick={(e) => e.stopPropagation()}>
            <div className="date-picker-header">
              <button
                className="month-nav"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              >
                ‹
              </button>
              <span className="month-year">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                className="month-nav"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              >
                ›
              </button>
            </div>

            <div className="calendar-grid">
              <div className="day-names">
                {dayNames.map(day => (
                  <div key={day} className={`day-name ${day === 'Sun' || day === 'Sat' ? 'weekend' : ''}`}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-dates">
                {generateCalendar().map((date, index) => (
                  <button
                    key={index}
                    className={`calendar-date ${
                      !isCurrentMonth(date) ? 'other-month' : ''
                    } ${isDateSelected(date) ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>

            <div className="date-picker-actions">
              <button className="date-action cancel" onClick={handleDateCancel}>
                Cancel
              </button>
              <button className="date-action save" onClick={handleDateSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Friends Popup */}
      {showInviteFriends && (
        <div className="popup-overlay" onClick={() => setShowInviteFriends(false)}>
          <div className="invite-popup" onClick={(e) => e.stopPropagation()}>
            <div className="invite-header">
              <h3>Invite your friends</h3>
              <button
                className="close-btn"
                onClick={() => setShowInviteFriends(false)}
              >
                ✕
              </button>
            </div>

            <div className="invite-content">
              <div className="email-input-section">
                <input
                  type="email"
                  placeholder="Enter an email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="email-input"
                />
                <button className="send-invite-btn" onClick={handleInviteEmailSubmit}>
                  Send
                </button>
              </div>

              <div className="invite-option" onClick={() => alert('Contact search coming soon!')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Search from your contact</span>
              </div>

              <div className="invite-option" onClick={handleCopyLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>Copy link</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        /* Date Picker Popup */
        .date-picker-popup {
          background: white;
          border-radius: 16px;
          padding: 20px;
          max-width: 320px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .date-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .month-nav {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .month-nav:hover {
          background-color: #f0f0f0;
        }

        .month-year {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .calendar-grid {
          margin-bottom: 20px;
        }

        .day-names {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }

        .day-name {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          padding: 8px 0;
        }

        .day-name.weekend {
          color: #ff6b6b;
        }

        .calendar-dates {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-date {
          aspect-ratio: 1;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .calendar-date:hover {
          background-color: #f0f0f0;
        }

        .calendar-date.other-month {
          color: #ccc;
        }

        .calendar-date.selected {
          background-color: #6366f1;
          color: white;
        }

        .date-picker-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .date-action {
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .date-action.cancel {
          background: none;
          color: #666;
        }

        .date-action.cancel:hover {
          background-color: #f0f0f0;
        }

        .date-action.save {
          background-color: #6366f1;
          color: white;
        }

        .date-action.save:hover {
          background-color: #5856eb;
        }

        /* Invite Friends Popup */
        .invite-popup {
          background: white;
          border-radius: 16px;
          padding: 0;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .invite-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .invite-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .close-btn:hover {
          background-color: #f0f0f0;
        }

        .invite-content {
          padding: 20px;
        }

        .email-input-section {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .email-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .email-input:focus {
          border-color: #6366f1;
        }

        .send-invite-btn {
          padding: 12px 20px;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .send-invite-btn:hover {
          background-color: #5856eb;
        }

        .invite-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          margin-bottom: 8px;
        }

        .invite-option:hover {
          background-color: #f8f9ff;
        }

        .invite-option svg {
          color: #666;
          flex-shrink: 0;
        }

        .invite-option span {
          font-size: 16px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default PlanNewTrip;