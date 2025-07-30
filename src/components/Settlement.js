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

  const totalSettlements = settlements.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="card slide-in">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
          ⚖️
        </div>
        <h2 className="card-title">Settlement Summary</h2>
        {settlements.length > 0 && (
          <span className="status-badge status-warning">
            {settlements.length} transaction{settlements.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {settlements.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No settlements needed</p>
          <p style={{ fontSize: '14px', color: '#999' }}>All bills are already balanced!</p>
        </div>
      ) : (
        <div>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
              LKR {totalSettlements.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Total amount to be settled
            </div>
          </div>

          {Object.keys(grouped).map((to, index) => (
            <div key={to} className="slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '12px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {to.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>
                    To {to}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {grouped[to].length} payment{grouped[to].length !== 1 ? 's' : ''} to receive
                  </div>
                </div>
              </div>
              
              <table className="table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th style={{ textAlign: 'right' }}>Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[to].map((s, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {s.from.charAt(0).toUpperCase()}
                          </div>
                          {s.from}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>
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
  );
}

export default Settlement; 