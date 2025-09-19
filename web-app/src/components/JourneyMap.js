import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA5XARq7HWdb2_qRBQB3bPTP_ZKJoaIJeM';
const JOURNEY_STORAGE_KEY = 'frame8.myJourney.v1';
const MAP_CACHE_KEY = 'frame8.mapGeocodeCache.v1';
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const DEFAULT_CENTER = { lat: -27.4698, lng: 153.0251 };
const MAX_RENDER_MARKERS = 8;

// 不同日期的配色（循环使用）
const ROUTE_COLORS = ['#2563eb', '#16a34a', '#e11d48', '#9333ea', '#f59e0b', '#0891b2', '#be123c'];

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

    // 带上 day（YYYY-MM-DD），供“按日期分色”使用
    const iso = item.start || item.addedAt;
    const day = iso ? String(iso).slice(0, 10) : 'Unscheduled';

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
        day,
      });
      return;
    }

    locations.push({ name, address, needsLookup: true, cacheKey, day });
  });

  const finalLocations = [];

  for (const location of locations.slice(0, MAX_RENDER_MARKERS)) {
    if (!location.needsLookup) {
      finalLocations.push(location);
      continue;
    }

    try {
      const coords = await geocodeAddress(location.address);
      cache[location.cacheKey] = { lat: coords.lat, lng: coords.lng, timestamp: now };
      finalLocations.push({ name: location.name, address: location.address, day: location.day, ...coords });
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
        day: 'Unscheduled',
      },
    ];
  }

  return finalLocations;
};

export default function JourneyMap({ height = 220, className = '', style = {} }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const [mapLocations, setMapLocations] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState('');

  // ▼ 筛选模式：'directions'（真实路线）| 'basic'（多日多色 polyline）| 'markers'（多日多色圆点）
  const [filterMode, setFilterMode] = useState('directions');

  // Basic Trip View 可能产生多条 polyline（按日期一条）
  const polylineRefs = useRef([]);

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

        const bounds = new window.google.maps.LatLngBounds();

        // 清空旧 markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 清空旧 polylines
        polylineRefs.current.forEach((pl) => pl.setMap(null));
        polylineRefs.current = [];

        // --------- 绘制 markers（Markers only 模式下按日期上色）---------
        // 构建日期 → 颜色映射（稳定：日期字典序）
        let dayColorMap = {};
        if (filterMode === 'markers') {
          const dayKeys = Array.from(new Set(mapLocations.map((l) => l.day || 'Unscheduled'))).sort();
          dayKeys.forEach((d, i) => {
            dayColorMap[d] = ROUTE_COLORS[i % ROUTE_COLORS.length];
          });
        }

        mapLocations.forEach((loc) => {
          const color =
            filterMode === 'markers' ? dayColorMap[loc.day || 'Unscheduled'] : undefined;

          const marker = new window.google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map,
            title: loc.name,
            ...(color
              ? {
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  },
                }
              : {}),
          });
          markersRef.current.push(marker);
          bounds.extend(marker.getPosition());
        });

        // --------- Directions 服务/渲染器（保留原有逻辑）---------
        if (!directionsServiceRef.current) {
          directionsServiceRef.current = new window.google.maps.DirectionsService();
        }
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
              strokeColor: '#2563eb',
              strokeOpacity: 0.9,
              strokeWeight: 5,
            },
          });
        }
        directionsRendererRef.current.setMap(map);

        const totalLocations = mapLocations.length;

        if (filterMode === 'directions' && totalLocations > 1) {
          const origin = mapLocations[0];
          const destination = mapLocations[totalLocations - 1];
          const waypoints = mapLocations.slice(1, totalLocations - 1).map((loc) => ({
            location: { lat: loc.lat, lng: loc.lng },
            stopover: true,
          }));

          directionsServiceRef.current.route(
            {
              origin: { lat: origin.lat, lng: origin.lng },
              destination: { lat: destination.lat, lng: destination.lng },
              travelMode: window.google.maps.TravelMode.DRIVING,
              waypoints,
              optimizeWaypoints: false,
            },
            (result, status) => {
              const okStatus = window.google?.maps?.DirectionsStatus?.OK || 'OK';
              if (status === okStatus) {
                directionsRendererRef.current.setDirections(result);
                const routeBounds = result.routes?.[0]?.bounds;
                if (routeBounds) {
                  map.fitBounds(routeBounds, 48);
                }
              } else {
                console.warn('Directions request failed:', status);
                directionsRendererRef.current.set('directions', null);
                map.fitBounds(bounds, 48);
              }
            }
          );
        } else if (filterMode === 'basic' && totalLocations > 1) {
          // Basic Trip View：按日期分组，多条不同颜色的 polyline
          directionsRendererRef.current.set('directions', null);

          const groups = mapLocations.reduce((acc, loc) => {
            const d = loc.day || 'Unscheduled';
            (acc[d] = acc[d] || []).push(loc);
            return acc;
          }, {});

          let colorIdx = 0;
          Object.values(groups).forEach((pts) => {
            if (pts.length < 2) return;
            const path = pts.map((p) => ({ lat: p.lat, lng: p.lng }));
            const polyline = new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: ROUTE_COLORS[colorIdx % ROUTE_COLORS.length],
              strokeOpacity: 0.9,
              strokeWeight: 5,
            });
            polyline.setMap(map);
            polylineRefs.current.push(polyline);
            colorIdx++;
          });

          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, 48);
          }
        } else {
          // Markers only 或 只有 0/1 个点：不显示路线
          directionsRendererRef.current.set('directions', null);

          if (totalLocations === 1) {
            map.setCenter(mapLocations[0]);
            map.setZoom(13);
          } else if (!bounds.isEmpty()) {
            map.fitBounds(bounds, 48);
          } else {
            map.setCenter(DEFAULT_CENTER);
            map.setZoom(12);
          }
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
      // 清理 markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      // 清理 directions
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      // 清理 polylines
      polylineRefs.current.forEach((pl) => pl.setMap(null));
      polylineRefs.current = [];
    };
  }, [mapLocations, filterMode]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        minHeight: height,
        ...style,
      }}
    >
      {/* 右上角筛选器（缩窄并与日期对齐） */}
      <div style={{ position: 'absolute', top: 24, right: 16, zIndex: 1000 }}>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          title={filterMode}
          style={{
            width: 150,
            height: 32,
            padding: '0 8px',
            borderRadius: 12,
            border: '1px solid #d1d5db',
            background: 'white',
            fontWeight: 600,
            fontSize: 12,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <option value="directions">Real Routes (drive-able)</option>
          <option value="basic">Basic Trip View</option>
          <option value="markers">Markers only</option>
        </select>
      </div>

      <div
        ref={mapRef}
        style={{ width: '100%', height: '100%', minHeight: height }}
      />
      {(isMapLoading || mapError) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(248, 249, 250, 0.85)',
            color: '#6c757d',
            fontWeight: 600,
            textAlign: 'center',
            padding: '0 16px',
          }}
        >
          {mapError ? mapError : 'Loading map...'}
        </div>
      )}
    </div>
  );
}
