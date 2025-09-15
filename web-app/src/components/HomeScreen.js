import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA5XARq7HWdb2_qRBQB3bPTP_ZKJoaIJeM';
const JOURNEY_STORAGE_KEY = 'frame8.myJourney.v1';
const MAP_CACHE_KEY = 'frame8.mapGeocodeCache.v1';
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const DEFAULT_CENTER = { lat: -27.4698, lng: 153.0251 };

const loadGoogleMapsScript = (() => {
  let loaderPromise;
  return (apiKey) => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Window is undefined'));
    }

    if (window.google && window.google.maps) {
      return Promise.resolve(window.google.maps);
    }

    if (loaderPromise) {
      return loaderPromise;
    }

    loaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-google-maps-loader]');

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google.maps));
        existingScript.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsLoader = 'true';
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error('Failed to load Google Maps script'));
      document.head.appendChild(script);
    });

    return loaderPromise;
  };
})();

const readJSON = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Failed to read localStorage key ${key}:`, error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key ${key}:`, error);
  }
};

const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = await response.json();
  const location = data.results?.[0]?.geometry?.location;

  if (!location) {
    throw new Error('No geometry returned for address');
  }

  return { lat: location.lat, lng: location.lng };
};

const getJourneyLocations = async () => {
  const journeyItems = readJSON(JOURNEY_STORAGE_KEY, []);
  const cache = readJSON(MAP_CACHE_KEY, {});
  const now = Date.now();
  const seen = new Set();
  const locations = [];
  let cacheUpdated = false;

  journeyItems.forEach((item) => {
    const address = item.address || item.formattedAddress || item.vicinity;
    if (!address) return;
    const cacheKey = address.trim().toLowerCase();
    if (seen.has(cacheKey)) return;
    seen.add(cacheKey);
    const name = item.name || item.displayName?.text || 'Saved place';
    const cachedEntry = cache[cacheKey];

    if (cachedEntry && now - cachedEntry.timestamp < FIFTEEN_MINUTES) {
      locations.push({
        name,
        address,
        lat: cachedEntry.lat,
        lng: cachedEntry.lng,
      });
      return;
    }

    locations.push({ name, address, needsLookup: true, cacheKey });
  });

  const finalLocations = [];

  for (const location of locations.slice(0, 8)) {
    if (!location.needsLookup) {
      finalLocations.push(location);
      continue;
    }

    try {
      const coords = await geocodeAddress(location.address);
      cache[location.cacheKey] = { lat: coords.lat, lng: coords.lng, timestamp: now };
      finalLocations.push({ name: location.name, address: location.address, ...coords });
      cacheUpdated = true;
    } catch (error) {
      console.error(`Failed to geocode address ${location.address}:`, error);
    }
  }

  if (cacheUpdated) {
    writeJSON(MAP_CACHE_KEY, cache);
  }

  if (!finalLocations.length) {
    return [
      {
        name: 'Brisbane CBD',
        address: 'Brisbane City QLD',
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng,
      },
    ];
  }

  return finalLocations;
};

const HomeScreen = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState('');

  const handleCreatePlan = () => {
    navigate('/plan-trip');
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadLocations = async () => {
      setIsMapLoading(true);
      try {
        const locations = await getJourneyLocations();
        if (!isSubscribed) return;
        setMapLocations(locations);
        setMapError('');
      } catch (error) {
        console.error('Unable to resolve map locations:', error);
        if (isSubscribed) {
          setMapError('Unable to load map locations right now.');
          setMapLocations([]);
        }
      } finally {
        if (isSubscribed) {
          setIsMapLoading(false);
        }
      }
    };

    loadLocations();

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!mapLocations.length || typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    const renderMap = async () => {
      setIsMapLoading(true);
      try {
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
        if (!isMounted || !mapRef.current) return;

        const map =
          mapInstanceRef.current ||
          new window.google.maps.Map(mapRef.current, {
            center: mapLocations[0] || DEFAULT_CENTER,
            zoom: 12,
            disableDefaultUI: true,
          });

        mapInstanceRef.current = map;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        mapLocations.forEach((loc) => {
          const marker = new window.google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map,
            title: loc.name,
          });
          markersRef.current.push(marker);
          bounds.extend(marker.getPosition());
        });

        if (mapLocations.length > 1) {
          map.fitBounds(bounds, 48);
        } else {
          map.setCenter(mapLocations[0]);
          map.setZoom(13);
        }

        setMapError('');
      } catch (error) {
        console.error('Failed to initialise Google Map:', error);
        if (isMounted) {
          setMapError('Failed to load Google Map.');
        }
      } finally {
        if (isMounted) {
          setIsMapLoading(false);
        }
      }
    };

    renderMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapLocations]);

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
            <div ref={mapRef} className="map-canvas" />
            {(isMapLoading || mapError) && (
              <div className="map-overlay">
                {mapError ? mapError : 'Loading map...'}
              </div>
            )}
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
      <BottomNav active="home" />

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
          position: relative;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          min-height: 220px;
        }

        .map-canvas {
          width: 100%;
          height: 100%;
          min-height: 220px;
        }

        .map-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 249, 250, 0.85);
          color: #6c757d;
          font-weight: 600;
          text-align: center;
          padding: 0 16px;
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

        /* bottom-nav styles moved to shared BottomNav component */

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
