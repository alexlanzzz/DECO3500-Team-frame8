import React, { useMemo } from "react";
import BottomNav from "./BottomNav";

// Must match the key used when saving journey items
const LS_JOURNEY_KEY = "frame8.myJourney.v1";

// Read your Google Places key from env or replace with your constant
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

/* ---------- utils ---------- */

// Build a Places API v1 photo URL from a photo name
function buildPhotoUrl(photoName, { maxHeight = 600, maxWidth = 800 } = {}) {
  if (!photoName) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${GOOGLE_PLACES_API_KEY}`;
}

// Default/fallback image (adjust to your project path)
function getDefaultImage(type) {
  return `/images/defaults/${type || "place"}.jpg`;
}

// Prefer English fields when available
function getTitle(item) {
  return item.title_en || item.name_en || item.title || item.name || "Untitled";
}
function getAddress(item) {
  return item.address_en || item.address || "";
}

// Resolve an image URL for a journey item
function resolveImage(item) {
  // 1) already computed fields
  if (item.img) return item.img;
  if (item.image) return item.image;

  // 2) Google Places v1 photo name present on item
  if (item.photo_name) {
    const url = buildPhotoUrl(item.photo_name);
    if (url) return url;
  }

  // 3) Original PlaceResult shape with photos[0].name
  const photoName = item.photos?.[0]?.name;
  if (photoName) {
    const url = buildPhotoUrl(photoName);
    if (url) return url;
  }

  // 4) fallback
  return getDefaultImage(item.type);
}

// Group items by YYYY-MM-DD; prefer scheduled `start`, fallback to `addedAt`
function groupByDate(items) {
  return items.reduce((acc, it) => {
    const iso = it.start || it.addedAt;
    const day = iso ? iso.slice(0, 10) : "Unscheduled";
    (acc[day] = acc[day] || []).push(it);
    return acc;
  }, {});
}

function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/* ---------- component ---------- */

export default function MyJourney() {
  // 1) read raw data from localStorage
  const journey = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_JOURNEY_KEY)) || [];
    } catch {
      return [];
    }
  }, []);

  // 2) early empty state
  if (!journey.length) {
    return (
      <div style={{ padding: 16, paddingBottom: 100 }}>
        <h2 style={{ marginTop: 0 }}>My Journey</h2>
        <p>No places yet. Swipe right on destinations to add them here.</p>
        <BottomNav active="journey" />
      </div>
    );
  }

  // 3) group by day and sort by time
  const buckets = groupByDate(journey);
  const days = Object.keys(buckets).sort();

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Brisbane</h2>
        {/* optional overall range */}
        <span style={{ color: "#6b7280" }}>
          {days[0] !== "Unscheduled" && days[days.length - 1] !== "Unscheduled"
            ? `${days[0]} — ${days[days.length - 1]}`
            : ""}
        </span>
      </div>

      <div style={{ marginTop: 16, position: "relative", paddingLeft: 56 }}>
        {/* vertical timeline */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 26,
            width: 4,
            background: "#e5e7eb",
            borderRadius: 2,
          }}
        />

        {days.map((day) => {
          const items = buckets[day].sort(
            (a, b) =>
              new Date(a.start || a.addedAt) - new Date(b.start || b.addedAt)
          );

          return (
            <section key={day} style={{ marginBottom: 24 }}>
              {/* date tick on the left */}
              <div style={{ position: "relative", margin: "12px 0 8px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -56,
                    top: 0,
                    width: 48,
                    textAlign: "right",
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  {day === "Unscheduled" ? "—" : day.slice(5).replace("-", "/")}
                </div>
              </div>

              {items.map((a, idx) => {
                const title = getTitle(a);
                const addr = getAddress(a);
                const img = resolveImage(a);

                return (
                  <article
                    key={`${day}-${idx}-${a.id || a.place_id || title}`}
                    style={{
                      margin: "12px 0 18px 0",
                      background: "white",
                      borderRadius: 12,
                      boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                      overflow: "hidden",
                      width: "min(760px, 100%)",
                    }}
                  >
                    {/* timeline dot */}
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: -38,
                          top: 18,
                          width: 18,
                          height: 18,
                          background: "#3b82f6",
                          borderRadius: "50%",
                          boxShadow: "0 0 0 4px #dbeafe",
                        }}
                      />
                    </div>

                    {/* cover image (with onError fallback) */}
                        {(a.img || a.image) && (
                        <img
                            src={a.img || a.image}
                            alt={title}
                            onError={(e) => (e.currentTarget.src = getDefaultImage(a.type))}
                            style={{ width: "100%", height: 160, objectFit: "cover" }}
                        />
                        )}

                    {/* content row */}
                    <div style={{ padding: "14px 16px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {a.start && a.end
                            ? `${fmtTime(a.start)} — ${fmtTime(a.end)} `
                            : ""}
                          {title}
                        </div>

                        {/* right side meta / actions */}
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                          {addr && (
                            <span style={{ color: "#6b7280", fontSize: 12 }}>
                              {addr}
                            </span>
                          )}
                          <button
                            style={{
                              border: "1px solid #e5e7eb",
                              background: "white",
                              borderRadius: 8,
                              padding: "4px 10px",
                              cursor: "pointer",
                            }}
                            onClick={() => alert("Comment placeholder")}
                          >
                            comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
      <BottomNav active="journey" />
    </div>
  );
}
