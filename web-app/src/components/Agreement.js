import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Agreement = () => {
  const [locations, setLocations] = useState([]);
  const [confirmedLocations, setConfirmedLocations] = useState([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("frame8.myJourney.v1");
    if (stored) {
      try {
        // Ensure it’s parsed as array (or wrap single object into array)
        const parsed = JSON.parse(stored);
        setLocations(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (err) {
        console.error("Invalid localStorage data", err);
      }
    }
  }, []);

  const handleConfirm = (loc) => {
    setConfirmedLocations((prev) => [...prev, loc]);
    setLocations((prev) => prev.filter((l) => l.name !== loc.name));
  };

  const handleReject = (loc) => {
    setLocations((prev) => prev.filter((l) => l.name !== loc.name));
  };

    return (
    <div className="container mt-4">
      <div className="row">
        {locations.map((loc, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div className="card h-100 shadow-sm">
              {loc.image && (
                <img
                  src={loc.image}
                  className="card-img-top"
                  alt={loc.name}
                  style={{ objectFit: "cover", height: "200px" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{loc.name}</h5>
                <p className="card-text">{loc.description}</p>
                <p className="text-muted small">{loc.address}</p>
                <p>
                  <strong>{loc.price}</strong> | ⭐ {loc.rating}
                </p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleConfirm(loc)}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(loc)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Debug / Show confirmed list */}
      {confirmedLocations.length > 0 && (
        <div className="mt-5">
          <h4>✅ Confirmed Locations</h4>
          <ul>
            {confirmedLocations.map((loc, idx) => (
              <li key={idx}>{loc.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Agreement;