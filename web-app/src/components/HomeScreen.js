import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    navigate('/plan-trip');
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
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <button className="create-trip-button" onClick={handleCreatePlan}>
          Create a new trip! 🚀
        </button>
        
        <button className="join-team-button" onClick={handleJoinTeam}>
          Join a team
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </div>
        <Link to="/my-journey" className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>My Journey</span>
        </Link>
        <div className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Profile</span>
        </div>
      </div>

      <style jsx>{`
        .home-screen {
          height: 100vh;
          background-color: white;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .header {
          padding: 40px 20px 20px;
          text-align: center;
        }

        .app-title {
          font-size: 48px;
          font-weight: 700;
          color: black;
          margin: 0;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          gap: 40px;
        }

        .create-trip-button {
          width: 100%;
          max-width: 350px;
          padding: 20px 40px;
          background-color: #F4A460;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(244, 164, 96, 0.3);
        }

        .create-trip-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 164, 96, 0.4);
        }

        .create-trip-button:active {
          transform: translateY(0);
        }

        .join-team-button {
          width: 100%;
          max-width: 280px;
          padding: 16px 32px;
          background-color: #F4A460;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(244, 164, 96, 0.3);
        }

        .join-team-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 164, 96, 0.4);
        }

        .join-team-button:active {
          transform: translateY(0);
        }

        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: white;
          padding: 12px 0 20px;
          border-top: 1px solid #f0f0f0;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          color: #999;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-item.active {
          color: #007AFF;
        }

        .nav-item svg {
          margin-bottom: 4px;
        }

        .nav-item:hover {
          color: #007AFF;
        }

        @media (max-width: 480px) {
          .app-title {
            font-size: 40px;
          }
          
          .header {
            padding: 30px 20px 15px;
          }
          
          .main-content {
            gap: 30px;
            padding: 15px;
          }
          
          .create-trip-button {
            font-size: 18px;
            padding: 18px 36px;
          }
          
          .join-team-button {
            font-size: 16px;
            padding: 14px 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;