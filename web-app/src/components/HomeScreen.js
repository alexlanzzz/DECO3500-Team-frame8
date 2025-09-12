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
      {/* Centered Content */}
      <div className="centered-content">
        {/* Centered Header */}
        <div className="header-content">
          <h1 className="app-title">CoTrip</h1>
          <p className="app-subtitle">Plan your perfect Brisbane adventure</p>
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          {/* Create Trip Card */}
          <div className="content-card">
            <h2 className="card-title">Ready to explore Brisbane?</h2>
            <p className="card-text">
              Discover amazing hotels, restaurants, and attractions
            </p>
            <button className="action-button primary" onClick={handleCreatePlan}>
              Create New Trip Plan
            </button>
          </div>

          {/* Join Team Card */}
          <div className="content-card">
            <h2 className="card-title">Join a team</h2>
            <p className="card-text">
              Enter a code or accept an invite
            </p>
            <button className="action-button secondary" onClick={handleJoinTeam}>
              Join Team
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span>Discover</span>
        </div>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .centered-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .header-content {
          text-align: center;
          margin-bottom: 40px;
        }

        .app-title {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .app-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.9);
          margin: 10px 0 0 0;
        }

        .main-content {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .content-card {
          background-color: white;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 15px 0;
        }

        .card-text {
          font-size: 16px;
          color: #666;
          margin: 0 0 25px 0;
          line-height: 1.5;
        }

        .action-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.primary {
          background-color: #667eea;
          color: white;
        }

        .action-button.primary:hover {
          background-color: #5a6fd8;
          transform: translateY(-1px);
        }

        .action-button.secondary {
          background-color: #764ba2;
          color: white;
        }

        .action-button.secondary:hover {
          background-color: #663d91;
          transform: translateY(-1px);
        }

        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: white;
          padding: 8px 0;
          border-top: 1px solid #e0e0e0;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          color: #666;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-item.active {
          color: #667eea;
        }

        .nav-item svg {
          margin-bottom: 4px;
        }

        .nav-item:hover {
          color: #667eea;
        }

        @media (max-width: 480px) {
          .app-title {
            font-size: 40px;
          }
          
          .app-subtitle {
            font-size: 16px;
          }
          
          .main-content {
            padding: 0 10px;
          }
          
          .content-card {
            padding: 25px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;