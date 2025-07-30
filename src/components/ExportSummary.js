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
    <div className="card slide-in">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
          📊
        </div>
        <h2 className="card-title">Export Summary</h2>
        {members.length > 0 && bills.length > 0 && (
          <span className="status-badge status-info">
            Ready to export
          </span>
        )}
      </div>

      {members.length === 0 || bills.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No data to export</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Add members and bills first to generate a summary
          </p>
        </div>
      ) : (
        <>
          <div ref={ref} style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                TripSplit Summary
              </h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Generated on {new Date().toLocaleDateString()}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                👥 Members ({members.length}):
              </div>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                {members.map(member => (
                  <span key={member} style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {member}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                💰 Total Expenditure: LKR {totalExpenditure.toFixed(2)}
              </div>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                📋 Bills ({bills.length}):
              </div>
              <div style={{ 
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '12px'
              }}>
                {bills.map((b, i) => (
                  <div key={i} style={{ 
                    marginBottom: '8px',
                    padding: '8px',
                    background: 'white',
                    borderRadius: '6px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {b.desc ? b.desc : `Bill #${i + 1}`}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      LKR {b.amount.toFixed(2)} • Paid by {b.payers.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                ⚖️ Settlements:
              </div>
              {settlements.length === 0 ? (
                <div style={{ 
                  textAlign: 'center',
                  padding: '16px',
                  background: '#e8f5e8',
                  borderRadius: '8px',
                  color: '#2e7d32'
                }}>
                  ✅ No settlements needed - all bills are balanced!
                </div>
              ) : (
                <div style={{ 
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  {Object.keys(grouped).map(to => (
                    <div key={to} style={{ 
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'white',
                      borderRadius: '6px',
                      borderLeft: '4px solid #f093fb'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                        To {to}:
                      </div>
                      <table style={{ 
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px'
                      }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                            <th style={{ textAlign: 'left', padding: '4px 8px', color: '#666' }}>From</th>
                            <th style={{ textAlign: 'right', padding: '4px 8px', color: '#666' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grouped[to].map((s, i) => (
                            <tr key={i}>
                              <td style={{ padding: '4px 8px' }}>{s.from}</td>
                              <td style={{ textAlign: 'right', padding: '4px 8px', fontWeight: '600' }}>
                                LKR {s.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={handleTextExport}
            >
              📄 Download as Text
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleImageExport}
            >
              🖼️ Download as Image
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportSummary; 