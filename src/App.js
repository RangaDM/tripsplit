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
    <div className="app-container">
      <h1>TripSplit - Bill Splitter</h1>
      <Members members={members} setMembers={setMembers} />
      <Bills members={members} bills={bills} setBills={setBills} />
      <Settlement members={members} bills={bills} />
      {/* Download State Button Section */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
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
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 24px",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(25,118,210,0.08)",
            margin: "0 auto 0 auto",
            display: "block"
          }}
        >
          Download State
        </button>
      </div>
      <hr style={{ margin: "24px 0 24px 0" }} />
      {/* Upload State Button with Info Icon and Reset Button in a Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "0 0 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <button
            type="button"
            onClick={() => document.getElementById('upload-state-input').click()}
            style={{
              background: "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 24px",
              fontWeight: "bold",
              fontSize: 12,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(67,160,71,0.08)",
              marginRight: 8,
            }}
          >
            Load Previous State
          </button>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                cursor: "pointer",
                fontSize: 18,
                color: "#888",
                borderRadius: "50%",
                padding: "0 6px",
                userSelect: "none",
                display: "inline-block",
                lineHeight: 1.2,
              }}
              onMouseOver={e => {
                const tooltip = e.currentTarget.nextSibling;
                tooltip.style.display = 'block';
              }}
              onMouseOut={e => {
                const tooltip = e.currentTarget.nextSibling;
                tooltip.style.display = 'none';
              }}
            >
              ℹ️
            </span>
            <span
              style={{
                display: "none",
                position: "absolute",
                left: "110%",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#333",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 4,
                fontSize: 12,
                whiteSpace: "nowrap",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              Restore your saved members and bills to continue where you left off.
            </span>
          </span>
        </div>
        <button
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
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 24px",
            fontWeight: "bold",
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(229,57,53,0.08)",
          }}
        >
          Reset
        </button>
      </div>
      <hr style={{ margin: "32px 0" }} />
      <ExportSummary members={members} bills={bills} />
    </div>
  );
}

export default App;
