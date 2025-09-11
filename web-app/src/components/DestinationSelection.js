import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import infoIcon from '../assets/icons/info.png';
import purseIcon from '../assets/icons/purse.png';

const DestinationSelection = () => {
  const navigate = useNavigate();
  const [currentSwipeCount, setCurrentSwipeCount] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const cardRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const MAX_SWIPES = 20;
  const SWIPE_THRESHOLD = 100;

  // Brisbane destination data
  const destinations = [
    {
      name: "Sunnybank Hotel",
      description: "Unassuming roadside property featuring a steakhouse with a sports bar, as well as free parking.",
      rating: 4.9,
      price: "AU$100",
      address: "555 Lang St, St Lucia",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
    },
    {
      name: "Brisbane River Cruise",
      description: "Scenic river cruise showcasing Brisbane's iconic landmarks and beautiful cityscape views.",
      rating: 4.7,
      price: "AU$45",
      address: "Brisbane River",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=800&h=600&fit=crop"
    },
    {
      name: "Story Bridge Adventure",
      description: "Thrilling bridge climb experience offering panoramic views of Brisbane city and surrounds.",
      rating: 4.8,
      price: "AU$89",
      address: "Story Bridge",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Queensland Museum",
      description: "Fascinating museum with natural history exhibits, planetarium shows and interactive displays.",
      rating: 4.5,
      price: "AU$25",
      address: "South Bank",
      image: "https://images.unsplash.com/photo-1565204189813-68fe0aa8c8be?w=800&h=600&fit=crop"
    },
    {
      name: "Lone Pine Koala Sanctuary",
      description: "World-famous koala sanctuary where you can cuddle koalas and hand-feed kangaroos.",
      rating: 4.6,
      price: "AU$35",
      address: "Lone Pine Sanctuary",
      image: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&h=600&fit=crop"
    },
    {
      name: "South Bank Parklands",
      description: "Contemporary art gallery featuring modern exhibitions and creative displays.",
      rating: 4.3,
      price: "AU$15",
      address: "South Bank Parklands",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Mount Coot-tha Lookout",
      description: "Stunning panoramic views of Brisbane city and surrounding landscapes.",
      rating: 4.8,
      price: "AU$12",
      address: "Mount Coot-tha",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "GOMA Gallery",
      description: "Interactive science museum with planetarium and educational exhibits.",
      rating: 4.4,
      price: "AU$20",
      address: "Stanley Place",
      image: "https://images.unsplash.com/photo-1565204189813-68fe0aa8c8be?w=800&h=600&fit=crop"
    },
    {
      name: "Brisbane Botanic Gardens",
      description: "Beautiful botanical gardens with diverse plant collections and peaceful walks.",
      rating: 4.7,
      price: "AU$8",
      address: "Brisbane Botanic Gardens",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    },
    {
      name: "Kangaroo Point Cliffs",
      description: "Adventure climbing experience with breathtaking river and city views.",
      rating: 4.9,
      price: "AU$75",
      address: "Kangaroo Point",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Eagle Street Pier",
      description: "Vibrant dining and entertainment precinct along the Brisbane River.",
      rating: 4.2,
      price: "AU$50",
      address: "Eagle Street Pier",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=800&h=600&fit=crop"
    },
    {
      name: "Queen Street Mall",
      description: "Premier shopping destination in the heart of Brisbane's CBD.",
      rating: 4.1,
      price: "AU$0",
      address: "Queen Street Mall",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
    },
    {
      name: "Roma Street Parkland",
      description: "Large parkland featuring gardens, lakes and recreational facilities.",
      rating: 4.5,
      price: "AU$6",
      address: "Roma Street",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    },
    {
      name: "Fortitude Valley",
      description: "Trendy entertainment district known for live music and nightlife.",
      rating: 4.0,
      price: "AU$30",
      address: "Fortitude Valley",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop"
    },
    {
      name: "New Farm Park",
      description: "Riverside park perfect for picnics, walks and outdoor activities.",
      rating: 4.6,
      price: "AU$5",
      address: "New Farm Park",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    },
    {
      name: "Redcliffe Peninsula",
      description: "Coastal peninsula offering beaches, seafood and seaside attractions.",
      rating: 4.3,
      price: "AU$40",
      address: "Redcliffe Peninsula",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Moreton Island",
      description: "World's third largest sand island with unique ecosystems and adventures.",
      rating: 4.8,
      price: "AU$120",
      address: "Moreton Island",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Gold Coast Day Trip",
      description: "Day trip to famous beaches, theme parks and coastal attractions.",
      rating: 4.4,
      price: "AU$85",
      address: "Gold Coast",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Sunshine Coast Tour",
      description: "Scenic coastal region with beaches, markets and natural beauty.",
      rating: 4.7,
      price: "AU$60",
      address: "Sunshine Coast",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      name: "Lamington National Park",
      description: "UNESCO World Heritage rainforest with hiking trails and wildlife.",
      rating: 4.9,
      price: "AU$25",
      address: "Lamington National Park",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    }
  ];

  const currentDestination = destinations[(currentSwipeCount - 1) % destinations.length];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 4.0) return '#FF9800';
    if (rating >= 3.0) return '#FF5722';
    return '#F44336';
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleSwipe = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const card = cardRef.current;
    
    if (card) {
      const translateX = direction === 'right' ? 1000 : -1000;
      const rotation = direction === 'right' ? 30 : -30;
      
      card.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
      card.style.opacity = '0';
      
      setTimeout(() => {
        if (direction === 'right') {
          showToast('Added to your trip!');
        } else {
          showToast('Not interested');
        }
        
        setTimeout(() => {
          if (currentSwipeCount >= MAX_SWIPES) {
            showToast('All destinations selected! Planning complete.');
            setTimeout(() => navigate('/'), 2000);
          } else {
            setCurrentSwipeCount(prev => prev + 1);
            card.style.transform = 'translateX(0px) rotate(0deg)';
            card.style.opacity = '1';
            setIsAnimating(false);
          }
        }, 500);
      }, 300);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || isAnimating) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const card = cardRef.current;
      if (card) {
        const rotation = deltaX * 0.1;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / 300;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDraggingRef.current || isAnimating) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = Math.abs(touch.clientY - startPosRef.current.y);
    
    isDraggingRef.current = false;
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > deltaY) {
      handleSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
      // Reset card position
      const card = cardRef.current;
      if (card) {
        card.style.transform = 'translateX(0px) rotate(0deg)';
        card.style.opacity = '1';
      }
    }
  };

  return (
    <div className="destination-selection">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div className="header-center">
          <h2>Brisbane</h2>
          <p>01/09/25 - 07/09/25</p>
        </div>
        
        <div className="counter">
          {currentSwipeCount}/{MAX_SWIPES}
        </div>
      </div>

      {/* Card Container */}
      <div className="card-container">
        <div 
          ref={cardRef}
          className="destination-card no-select"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card-image">
            <img src={currentDestination.image} alt={currentDestination.name} />
          </div>
          
          <div className="card-content">
            <div className="header-row">
              <h3>{currentDestination.name}</h3>
              <div className="rating">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill={getRatingColor(currentDestination.rating)}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span style={{ color: getRatingColor(currentDestination.rating) }}>
                  {currentDestination.rating}
                </span>
              </div>
            </div>
            
            <p className="description">{currentDestination.description}</p>
            
            <div className="bottom-row">
              <div className="details">
                <div className="price-row">
                  <img src={purseIcon} alt="Price" width="16" height="16" />
                  <span>{currentDestination.price} / person</span>
                </div>
                <div className="address-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{currentDestination.address}</span>
                </div>
              </div>
              
              <button className="info-btn" onClick={(e) => { e.stopPropagation(); showToast('Detail page coming soon!'); }}>
                <img src={infoIcon} alt="Info" width="20" height="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="instructions">
        <span className="swipe-left">← Not interested</span>
        <span className="swipe-divider"> | </span>
        <span className="swipe-right">Interested →</span>
      </div>

      {/* Toast */}
      {toastMessage && <div className="toast">{toastMessage}</div>}

      <style jsx>{`
        .destination-selection {
          height: 100vh;
          background-color: white;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background-color: white;
          z-index: 10;
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
        }

        .back-btn:hover {
          background-color: rgba(0,0,0,0.1);
        }

        .header-center {
          text-align: center;
          flex: 1;
        }

        .header-center h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #000;
        }

        .header-center p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        .counter {
          font-size: 18px;
          font-weight: 700;
          color: #000;
          min-width: 50px;
          text-align: right;
        }

        .card-container {
          flex: 1;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .destination-card {
          width: 100%;
          max-width: 400px;
          height: 80vh;
          max-height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          overflow: hidden;
          transition: transform 0.3s ease, opacity 0.3s ease;
          cursor: grab;
          position: relative;
        }

        .destination-card:active {
          cursor: grabbing;
        }

        .card-image {
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
          color: white;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 200px;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .header-row h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          flex: 1;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 16px;
          font-weight: 700;
        }

        .description {
          margin: 0 0 16px 0;
          font-size: 14px;
          line-height: 1.4;
          color: #E0E0E0;
        }

        .bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .details {
          flex: 1;
        }

        .price-row, .address-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .price-row {
          font-weight: 700;
          color: white;
        }

        .address-row {
          font-size: 12px;
          color: #E0E0E0;
        }

        .info-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(10px);
          color: white;
        }

        .info-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .instructions {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666;
          opacity: 0.7;
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
        }

        .swipe-left {
          color: #FF5722
        }
        .swipe-right {
          color: #4CAF50
        }
        .swipe-divider {
          color: #999;
        }

        @media (max-width: 480px) {
          .header {
            padding: 12px;
          }
          
          .card-container {
            padding: 12px;
          }
          
          .destination-card {
            height: 70vh;
          }
          
          .card-content {
            padding: 16px;
          }
          
          .header-row h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationSelection;