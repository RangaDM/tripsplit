import React, { useState } from 'react';
import './App.css';
import Bills from './components/Bills';
import ExportSummary from './components/ExportSummary';
import Members from './components/Members';
import Settlement from './components/Settlement';

function App() {
  const [members, setMembers] = useState([]);
  const [bills, setBills] = useState([]);

  return (
    <div className="app-container">
      <h1>TripSplit - Bill Splitter</h1>
      <Members members={members} setMembers={setMembers} />
      <Bills members={members} bills={bills} setBills={setBills} />
      <Settlement members={members} bills={bills} />
      <hr style={{ margin: '32px 0' }} />
      <ExportSummary members={members} bills={bills} />
    </div>
  );
}

export default App; 