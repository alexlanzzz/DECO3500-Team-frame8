import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    navigate('/destinations');
  };

  const handleJoinTeam = () => {
    // Placeholder for join team functionality
    alert('Join team functionality coming soon!');
  };

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="header">
        <h1 className="app-title">CoTrip</h1>
        <button className="settings-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Create Trip Card */}
        <div className="feature-card" onClick={handleCreatePlan}>
          <div className="card-content">
            <div className="go-chip">Go</div>
            <div className="card-text">
              <h2>Create new trip plan</h2>
              <p>Start a collaborative itinerary</p>
            </div>
          </div>
        </div>

        {/* Join Team Card */}
        <div className="feature-card" onClick={handleJoinTeam}>
          <div className="card-content">
            <div className="go-chip">Go</div>
            <div className="card-text">
              <h2>Join a team</h2>
              <p>Enter a code or accept an invite</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-screen {
          height: 100vh;
          background-color: #F5F5F5;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: white;
        }

        .app-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: #000;
        }

        .settings-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .main-content {
          padding: 16px;
          flex: 1;
        }

        .feature-card {
          width: 100%;
          height: 170px;
          background: linear-gradient(135deg, #324B86 0%, #6BA4FF 100%);
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease;
          user-select: none;
        }

        .feature-card:hover {
          transform: translateY(-2px);
        }

        .feature-card:active {
          transform: translateY(0);
        }

        .card-content {
          height: 100%;
          position: relative;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .go-chip {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .card-text {
          margin-top: auto;
        }

        .card-text h2 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .card-text p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .header {
            padding: 8px 12px;
          }
          
          .app-title {
            font-size: 24px;
          }
          
          .main-content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;