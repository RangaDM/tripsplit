import React, { useState } from "react";
import "./App.css";
import Bills from "./components/Bills";
import ExportSummary from "./components/ExportSummary";
import Members from "./components/Members";
import Settlement from "./components/Settlement";

function App() {
  const [members, setMembers] = useState([]);
  const [bills, setBills] = useState([]);

  return (
    <div className="app-container fade-in">
      {/* Modern Header */}
      <div className="app-header">
        <h1 className="app-title">TripSplit</h1>
        <p className="app-subtitle">Split bills with friends, travel worry-free</p>
      </div>

      {/* Members Section */}
      <Members members={members} setMembers={setMembers} />
      
      {/* Bills Section */}
      <Bills members={members} bills={bills} setBills={setBills} />
      
      {/* Settlement Section */}
      <Settlement members={members} bills={bills} />

      {/* State Management Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            💾
          </div>
          <h2 className="card-title">Save & Load</h2>
        </div>
        
        <div className="flex gap-2 mb-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (members.length === 0 && bills.length === 0) {
                alert('Nothing to download yet!');
                return;
              }
              const data = { members, bills };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              const now = new Date();
              const pad = n => n.toString().padStart(2, '0');
              const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
              a.href = url;
              a.download = `tripsplit-state-${timestamp}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            💾 Download State
          </button>
          
          <button
            className="btn btn-success"
            type="button"
            onClick={() => document.getElementById('upload-state-input').click()}
          >
            📁 Load Previous State
          </button>
          
          <button
            className="btn btn-danger"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to reset all members and bills? This action cannot be undone."
                )
              ) {
                setMembers([]);
                setBills([]);
              }
            }}
          >
            🔄 Reset All
          </button>
        </div>

        <input
          id="upload-state-input"
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
              const text = await file.text();
              const data = JSON.parse(text);
              if (Array.isArray(data.members) && Array.isArray(data.bills)) {
                setMembers(data.members);
                setBills(data.bills);
                alert("State loaded successfully!");
              } else {
                alert("Invalid file format.");
              }
            } catch (err) {
              alert("Failed to load file: " + err.message);
            }
            e.target.value = ""; // reset input
          }}
        />

        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span style={{ fontSize: '18px', cursor: 'pointer' }}>ℹ️</span>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Save your progress to continue where you left off later
          </span>
        </div>
      </div>

      {/* Export Summary Section */}
      <ExportSummary members={members} bills={bills} />
    </div>
  );
}

export default App;
