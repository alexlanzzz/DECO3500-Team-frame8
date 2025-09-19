import React, { useEffect, useState } from "react";
import { PRESET_USER_PROFILES, buildPresetMatchKey } from "../data/presetUserPreferences";
import { DEMO_USER_PREFERENCES } from "../data/demoUserPreferences";

const Agreement = () => {
	const [confirmedKeys, setConfirmedKeys] = useState([]);
	const [unconfirmedKeys, setUnconfirmedKeys] = useState([]);

	const [confirmedLocations, setConfirmedLocations] = useState([]);
	const [unconfirmedLocations, setUnconfirmedLocations] = useState([]);

	const [interestedLocations, setInterestedLocations] = useState([]);
	const [uninterestedLocations, setUninterestedLocations] = useState([]);
	const [allLocations, setAllLocations] = useState([]);

	const [activeTab, setActiveTab] = useState("confirmed"); // "confirmed" | "notConfirmed"

	// Before we display them, we have to figure out which destinations are "confirmed", and which are still in debate
	function computeUserChoices() {
		const PROFILE_DESTINATION_DATA = DEMO_USER_PREFERENCES;

		// Collect all interestedKeys into a single flat array
		const allKeys = [];
		PROFILE_DESTINATION_DATA.forEach(profile => {
			profile.interested.forEach(location => {
				allKeys.push(location);
			})
		})
		// Convert to a Set to ensure uniqueness
		const uniqueKeys = new Set(allKeys);

		// Step 3: initialize counter object
		const counter = {};
		uniqueKeys.forEach(key => {
			counter[key] = 0;
		});

		// Step 4: iterate again to count
		allKeys.forEach(key => {
			counter[key] += 1;
		});

		// Now we have a dictionary of all the counts of the locations based on whether the user was interested or not
		var dataLength = PROFILE_DESTINATION_DATA.length || 4;
		var newConfirmedKeys = [];
		var newUnconfirmedKeys = [];
		for (var key in counter) {
			if (counter[key] > 0) {
				if (counter[key] === dataLength) {
					// First, the locations that have a counter equal to the number of users are all agreed - push them into the confirmedLocations
					newConfirmedKeys.push(key);
				} else {
					// Anything else, push them into the unconfirmedLocations collection
					newUnconfirmedKeys.push(key);
				}
			}
		}
		setConfirmedKeys(newConfirmedKeys);
		setUnconfirmedKeys(newUnconfirmedKeys);
	}

  	useEffect(() => {
		const stored = localStorage.getItem("frame8.votes.v1");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);

				// Old logic, may not use this for final version since not using personal user votes, still keep just in case
				// These are the CURRENT USER'S SELECTED LOCATIONS
				const confirmedLS = parsed.interested;
				const unconfirmedLS = parsed.notInterested;
				setInterestedLocations(Array.isArray(confirmedLS) ? confirmedLS : [confirmedLS]);
				setUninterestedLocations(Array.isArray(unconfirmedLS) ? unconfirmedLS : [unconfirmedLS]);

				// Get ALL of the locations available from the local storage
				const allLS = [...confirmedLS, ...unconfirmedLS];
				setAllLocations(Array.isArray(allLS) ? allLS : [allLS]);

				// Use the data from the users to figure out which locations each of them selected;
				computeUserChoices();
			} catch (err) {
				console.error("Invalid localStorage data", err);
			}
		}
	}, []);

	//  When either allLocations or the key arrays change, recompute the final object arrays
	useEffect(() => {
		if (allLocations.length === 0) return;

		// Build lookup by *name* (no need for matchKey anymore)
		const locationMap = allLocations.reduce((map, loc) => {
			map[loc.name] = loc;
			return map;
		}, {});

		setConfirmedLocations(
			confirmedKeys.map((key) => locationMap[key]).filter(Boolean)
		);
		setUnconfirmedLocations(
			unconfirmedKeys.map((key) => locationMap[key]).filter(Boolean)
		);

		console.log("ConfirmedKeys:", confirmedKeys);
  		console.log("UnconfirmedKeys:", unconfirmedKeys);
		console.log("ConfirmedLocations:\n" + confirmedLocations);
		console.log("UnconfirmedLocations:\n" + unconfirmedLocations);
	}, [allLocations, confirmedKeys, unconfirmedKeys]);

	useEffect(() => {
		console.log("ConfirmedLocations (effect):", confirmedLocations);
		console.log("UnconfirmedLocations (effect):", unconfirmedLocations);
	}, [confirmedLocations, unconfirmedLocations]);

	// Each not-confirmed card will have its own chat messages
	// For demo, create an object mapping location name → array of messages
	const [chatMessages, setChatMessages] = useState({});

	const handleSendMessage = (locName, text) => {
		if (!text.trim()) return;
			setChatMessages((prev) => ({
				...prev,
			[locName]: [...(prev[locName] || []), { text, time: new Date() }],
		}));
  	};

  return (
	<div style={styles.page}>
	  <h2 style={styles.heading}>Agreement</h2>

	  {/* Tabs */}
	  <div style={styles.tabs}>
		<button
		  style={{
			...styles.tab,
			...(activeTab === "confirmed" ? styles.activeTab : {}),
		  }}
		  onClick={() => setActiveTab("confirmed")}
		>
		  Confirmed
		</button>
		<button
		  style={{
			...styles.tab,
			...(activeTab === "notConfirmed" ? styles.activeTab : {}),
		  }}
		  onClick={() => setActiveTab("notConfirmed")}
		>
		  Not Confirmed
		</button>
	  </div>

	  {/* Confirmed cards */}
	  {activeTab === "confirmed" && (
		<div style={styles.cardsGrid}>
		  {confirmedLocations.map((loc, idx) => (
			<div key={idx} style={styles.card}>
			  {loc.image && (
				<img src={loc.image} alt={loc.name} style={styles.image} />
			  )}
			  <h3 style={styles.name}>{loc.name}</h3>
			  <p style={styles.meta}>
				<strong>{loc.price}</strong> | ⭐ {loc.rating}
			  </p>
			  <div style={styles.buttonRow}>
				<button style={styles.confirmBtn}>Confirm</button>
				<button style={styles.rejectBtn}>Reject</button>
				<button style={styles.detailsBtn}>Details</button>
			  </div>
			</div>
		  ))}
		</div>
	  )}

	  {/* Not Confirmed cards with chat demo */}
	  {activeTab === "notConfirmed" && (
		<div style={styles.cardsGrid}>
		  {unconfirmedLocations.map((loc, idx) => (
			<div key={idx} style={styles.card}>
			  {loc.image && (
				<img src={loc.image} alt={loc.name} style={styles.image} />
			  )}
			  <h3 style={styles.name}>{loc.name}</h3>
			  <p style={styles.meta}>
				<strong>{loc.price}</strong> | ⭐ {loc.rating}
			  </p>

			  {/* Chat Section */}
			  <div style={styles.chatBox}>
				<div style={styles.chatMessages}>
				  {(chatMessages[loc.name] || []).map((msg, i) => (
					<div key={i} style={styles.messageBubble}>
					  {msg.text}
					  <div style={styles.timestamp}>
						{msg.time.toLocaleTimeString([], {
						  hour: "2-digit",
						  minute: "2-digit",
						})}
					  </div>
					</div>
				  ))}
				</div>
				<ChatInput
				  onSend={(text) => handleSendMessage(loc.name, text)}
				/>
			  </div>
			</div>
		  ))}
		</div>
	  )}
	</div>
  );
};

// Separate input component for clarity
const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
	e.preventDefault();
	onSend(text);
	setText("");
  };

  return (
	<form onSubmit={handleSubmit} style={styles.chatInputRow}>
	  <input
		type="text"
		placeholder="Type a message..."
		value={text}
		onChange={(e) => setText(e.target.value)}
		style={styles.chatInput}
	  />
	  <button type="submit" style={styles.sendBtn}>
		➤
	  </button>
	</form>
  );
};

// Styles
const styles = {
  page: {
	padding: "1rem",
	fontFamily: "sans-serif",
  },
  heading: {
	fontSize: "1.5rem",
	marginBottom: "1rem",
  },
  tabs: {
	display: "flex",
	borderBottom: "2px solid #ddd",
	marginBottom: "1rem",
  },
  tab: {
	flex: 1,
	padding: "0.75rem",
	borderTop: "none",
	borderLeft: "none",
	borderRight: "none",
	borderBottom: "2px solid transparent",
	background: "none",
	cursor: "pointer",
	fontSize: "1rem",
	color: "#555",
  },
  activeTab: {
	borderBottom: "2px solid #007bff",
	fontWeight: "bold",
	color: "#007bff",
  },
  cardsGrid: {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
	gap: "1rem",
  },
  card: {
	border: "1px solid #ccc",
	borderRadius: "8px",
	padding: "1rem",
	backgroundColor: "#fff",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
	width: "100%",
	height: "140px",
	objectFit: "cover",
	borderRadius: "6px",
	marginBottom: "0.5rem",
  },
  name: {
	margin: "0.25rem 0",
	fontSize: "1.1rem",
	textAlign: "center",
  },
  meta: {
	margin: "0.25rem 0 0.75rem 0",
	fontSize: "0.9rem",
	color: "#555",
  },
  buttonRow: {
	display: "flex",
	gap: "0.5rem",
	marginTop: "auto",
  },
  confirmBtn: {
	backgroundColor: "#4CAF50",
	color: "white",
	border: "none",
	padding: "0.4rem 0.8rem",
	borderRadius: "4px",
	cursor: "pointer",
  },
  rejectBtn: {
	backgroundColor: "#f44336",
	color: "white",
	border: "none",
	padding: "0.4rem 0.8rem",
	borderRadius: "4px",
	cursor: "pointer",
  },
  detailsBtn: {
	backgroundColor: "#2196F3",
	color: "white",
	border: "none",
	padding: "0.4rem 0.8rem",
	borderRadius: "4px",
	cursor: "pointer",
  },
  // Chat styles
  chatBox: {
	border: "1px solid #ddd",
	borderRadius: "6px",
	marginTop: "0.5rem",
	width: "100%",
	display: "flex",
	flexDirection: "column",
  },
  chatMessages: {
	flex: 1,
	maxHeight: "120px",
	overflowY: "auto",
	padding: "0.5rem",
  },
  messageBubble: {
	background: "#f1f1f1",
	borderRadius: "12px",
	padding: "0.5rem 0.75rem",
	marginBottom: "0.5rem",
	fontSize: "0.9rem",
	alignSelf: "flex-start",
  },
  timestamp: {
	fontSize: "0.7rem",
	color: "#777",
	marginTop: "2px",
  },
  chatInputRow: {
	display: "flex",
	borderTop: "1px solid #ddd",
  },
  chatInput: {
	flex: 1,
	border: "none",
	padding: "0.5rem",
	outline: "none",
	fontSize: "0.9rem",
  },
  sendBtn: {
	background: "#007bff",
	border: "none",
	color: "white",
	padding: "0.5rem 1rem",
	cursor: "pointer",
  },
};

export default Agreement;