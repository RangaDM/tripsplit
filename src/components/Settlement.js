import React from 'react';
import settleUp from '../utils/settleUp';

function Settlement({ members, bills }) {
  const settlements = settleUp(members, bills);
  // Group by recipient (to)
  const grouped = {};
  settlements.forEach(s => {
    if (!grouped[s.to]) grouped[s.to] = [];
    grouped[s.to].push(s);
  });

  return (
    <div style={{ marginBottom: 32 }}>
      <h2>Settlement</h2>
      {settlements.length === 0 ? (
        <p>No settlements needed.</p>
      ) : (
        <div>
          {Object.keys(grouped).map(to => (
            <div key={to} style={{ marginBottom: 24 }}>
              <b>To {to}:</b>
              <table style={{ borderCollapse: 'collapse', marginTop: 8, minWidth: 200 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '4px 8px', background: '#f8f8f8' }}>From</th>
                    <th style={{ border: '1px solid #ccc', padding: '4px 8px', background: '#f8f8f8' }}>Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[to].map((s, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{s.from}</td>
                      <td style={{ border: '1px solid #ccc', padding: '4px 8px', textAlign: 'right' }}>{s.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Settlement; 