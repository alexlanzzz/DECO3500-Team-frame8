import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    navigate('/plan-trip');
  };

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="header">
        <h1 className="greeting">Hello, NAME</h1>
        <p className="welcome">Welcome to Cotrip</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="search for something" />
          <button className="filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Explore New Section */}
        <div className="section">
          <h2 className="section-title">Explore new</h2>
          <div className="explore-grid">
            <div className="explore-card city">
              <img src="https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=200&fit=crop" alt="City" />
            </div>
            <div className="explore-card nature">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Nature" />
            </div>
          </div>
        </div>

        {/* Recent Trips Section */}
        <div className="section">
          <h2 className="section-title">Recent Trips</h2>
          <div className="recent-trips">
            <div className="trip-card">
              <img src="https://images.unsplash.com/photo-1513326738677-b964603b136d?w=300&h=200&fit=crop" alt="Moscow" />
              <div className="trip-info">
                <h3>Moscow</h3>
              </div>
            </div>
            <div className="trip-card">
              <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=300&h=200&fit=crop" alt="Beijing" />
              <div className="trip-info">
                <h3>Beijing</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Route Section */}
        <div className="section">
          <h2 className="section-title">Trip Route</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>VIEW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="floating-add-btn" onClick={handleCreatePlan}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          position: relative;
        }

        .header {
          padding: 50px 20px 20px;
          text-align: left;
        }

        .greeting {
          font-size: 28px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px 0;
        }

        .welcome {
          font-size: 16px;
          color: #8e8e93;
          margin: 0;
        }

        .search-section {
          padding: 0 20px 20px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 25px;
          padding: 12px 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          gap: 12px;
        }

        .search-bar svg {
          color: #8e8e93;
          flex-shrink: 0;
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #8e8e93;
          background: none;
        }

        .search-bar input::placeholder {
          color: #8e8e93;
        }

        .filter-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #8e8e93;
        }

        .main-content {
          flex: 1;
          padding: 0 20px 100px 20px;
          overflow-y: auto;
        }

        .section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
        }

        .explore-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .explore-card {
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .explore-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recent-trips {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .trip-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .trip-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .trip-info {
          padding: 12px;
        }

        .trip-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .map-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          min-height: 200px;
        }

        .map-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #8e8e93;
        }

        .map-placeholder svg {
          margin-bottom: 8px;
        }

        .map-placeholder span {
          font-size: 18px;
          font-weight: 600;
        }

        .floating-add-btn {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 56px;
          height: 56px;
          background-color: #F4A460;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(244, 164, 96, 0.4);
          transition: all 0.2s ease;
          color: white;
        }

        .floating-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(244, 164, 96, 0.5);
        }

        .floating-add-btn:active {
          transform: translateY(0);
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: white;
          padding: 12px 0 20px;
          border-top: 1px solid #f0f0f0;
          z-index: 100;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          color: #8e8e93;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
          text-decoration: none;
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
          .greeting {
            font-size: 24px;
          }

          .header {
            padding: 40px 16px 16px;
          }

          .search-section {
            padding: 0 16px 16px;
          }

          .main-content {
            padding: 0 16px 100px 16px;
          }

          .floating-add-btn {
            right: 16px;
            bottom: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;