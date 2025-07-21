import html2canvas from 'html2canvas';
import React, { useRef } from 'react';
import settleUp from '../utils/settleUp';

function ExportSummary({ members, bills }) {
  const ref = useRef();
  const settlements = settleUp(members, bills);
  // Group by recipient (to)
  const grouped = {};
  settlements.forEach(s => {
    if (!grouped[s.to]) grouped[s.to] = [];
    grouped[s.to].push(s);
  });

  // Calculate total expenditure
  const totalExpenditure = bills.reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleTextExport = () => {
    if (!members.length || !bills.length) {
      alert('Nothing to download yet!');
      return;
    }
    let text = 'TripSplit Summary\n\n';
    text += 'Members: ' + members.join(', ') + '\n';
    text += '\nBills:\n';
    bills.forEach((b, i) => {
      text += `  ${i + 1}. ${b.desc ? b.desc + ': ' : ''}LKR ${b.amount.toFixed(2)} paid by ${b.payers.join(', ')} split between ${b.splitters ? b.splitters.join(', ') : members.join(', ')}\n`;
    });
    text += '\nSettlements:\n';
    if (settlements.length === 0) {
      text += '  No settlements needed.\n';
    } else {
      Object.keys(grouped).forEach(to => {
        text += `  To ${to}:\n`;
        grouped[to].forEach(s => {
          text += `    From ${s.from}: LKR ${s.amount.toFixed(2)}\n`;
        });
      });
    }
    text += '\n--- Exported from TripSplit by RangaDM ---\n';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tripsplit-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageExport = () => {
    if (!members.length || !bills.length) {
      alert('Nothing to download yet!');
      return;
    }
    if (!ref.current) return;
    html2canvas(ref.current).then(canvas => {
      // Create a new canvas to ensure watermark is on top
      const newCanvas = document.createElement('canvas');
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      const ctx = newCanvas.getContext('2d');
      // Draw the html2canvas image
      ctx.drawImage(canvas, 0, 0);
      // Draw the watermark at the right bottom corner
      const text = 'TripSplit - Bill Splitter | RangaDM';
      const fontSize = Math.floor(newCanvas.width / 60); // smaller font
      ctx.save();
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.globalAlpha = 0.32;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#222';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 6;
      const padding = 16;
      ctx.fillText(text, newCanvas.width - padding, newCanvas.height - padding);
      ctx.restore();
      // Download
      const link = document.createElement('a');
      link.download = 'tripsplit-summary.png';
      link.href = newCanvas.toDataURL();
      link.click();
    });
  };

  return (
    <div>
      <h2>Export Summary</h2>
      <div ref={ref} style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 8 }}>
        <h3>TripSplit Summary</h3>
        <div><b>Members:</b> {members.join(', ')}</div>
        <div style={{ margin: '8px 0' }}><b>Total Expenditure:</b> LKR {totalExpenditure.toFixed(2)}</div>
        <div style={{ margin: '8px 0' }}><b>Bills:</b>
          <ul>
            {bills.map((b, i) => (
              <li key={i}>{b.desc ? b.desc + ': ' : ''}LKR {b.amount.toFixed(2)} paid by {b.payers.join(', ')}</li>
            ))}
          </ul>
        </div>
        <div><b>Settlements:</b>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {settlements.length === 0 ? <li>No settlements needed.</li> :
              Object.keys(grouped).map(to => (
                <li key={to} style={{ marginBottom: 24 }}>
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
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <button onClick={handleTextExport} style={{ marginRight: 8 }}>Download as Text</button>
      <button onClick={handleImageExport}>Download as Image</button>
    </div>
  );
}

export default ExportSummary; 