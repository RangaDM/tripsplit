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
          display: "block",
          margin: "16px auto 32px auto",
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
      <hr style={{ margin: "32px 0" }} />
      <ExportSummary members={members} bills={bills} />
    </div>
  );
}

export default App;
