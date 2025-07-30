import React, { useState } from 'react';

function Bills({ members, bills, setBills }) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [payers, setPayers] = useState([]);
  const [splitters, setSplitters] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const addBill = () => {
    const amt = parseFloat(amount);
    if (amt > 0 && payers.length > 0 && splitters.length > 0) {
      if (editIndex !== null) {
        // Update existing bill
        const updatedBills = bills.slice();
        updatedBills[editIndex] = { amount: amt, desc, payers: [...payers], splitters: [...splitters] };
        setBills(updatedBills);
        setEditIndex(null);
      } else {
        // Add new bill
        setBills([
          ...bills,
          { amount: amt, desc, payers: [...payers], splitters: [...splitters] }
        ]);
      }
      setAmount('');
      setDesc('');
      setPayers([]);
      setSplitters([]);
    }
  };

  const togglePayer = (name) => {
    if (payers.includes(name)) {
      setPayers([]); // unselect if already selected
    } else {
      setPayers([name]); // only one payer at a time
    }
  };

  const toggleSplitter = (name) => {
    setSplitters(
      splitters.includes(name)
        ? splitters.filter(s => s !== name)
        : [...splitters, name]
    );
  };

  const removeBill = (idx) => {
    setBills(bills.filter((_, i) => i !== idx));
  };

  const editBill = (idx) => {
    const b = bills[idx];
    setAmount(b.amount.toString());
    setDesc(b.desc || '');
    setPayers([...b.payers]);
    setSplitters([...b.splitters]);
    setEditIndex(idx);
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="card slide-in">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)' }}>
          💰
        </div>
        <h2 className="card-title">{editIndex !== null ? 'Edit Bill' : 'Add Bill'}</h2>
        {bills.length > 0 && (
          <span className="status-badge status-info">
            LKR {totalAmount.toFixed(2)} total
          </span>
        )}
      </div>

      {members.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No members available</p>
          <p style={{ fontSize: '14px', color: '#999' }}>Add group members first to start adding bills</p>
        </div>
      ) : (
        <>
          <div className="form-group">
            <div className="form-row">
              <div className="form-control">
                <input
                  type="number"
                  className="input-field"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Amount (LKR)"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  className="input-field"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Description (optional)"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              💳 Payer:
            </label>
            <div className="checkbox-group">
              {members.map(m => (
                <div 
                  key={m} 
                  className={`checkbox-item ${payers.includes(m) ? 'selected' : ''}`}
                  onClick={() => togglePayer(m)}
                >
                  <input
                    type="checkbox"
                    checked={payers.includes(m)}
                    onChange={() => togglePayer(m)}
                    disabled={payers.length > 0 && !payers.includes(m)}
                  />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              🎯 Split Between:
            </label>
            <div className="checkbox-group">
              {members.map(m => (
                <div 
                  key={m} 
                  className={`checkbox-item ${splitters.includes(m) ? 'selected' : ''}`}
                  onClick={() => toggleSplitter(m)}
                >
                  <input
                    type="checkbox"
                    checked={splitters.includes(m)}
                    onChange={() => toggleSplitter(m)}
                  />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <button 
              className="btn btn-primary"
              onClick={addBill}
              disabled={!amount || parseFloat(amount) <= 0 || payers.length === 0 || splitters.length === 0}
            >
              {editIndex !== null ? '✏️ Update Bill' : '➕ Add Bill'}
            </button>
            {editIndex !== null && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setEditIndex(null);
                  setAmount('');
                  setDesc('');
                  setPayers([]);
                  setSplitters([]);
                }}
                style={{ marginLeft: '12px' }}
              >
                ❌ Cancel Edit
              </button>
            )}
          </div>
        </>
      )}

      {bills.length > 0 && (
        <div className="mt-3">
          <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.2rem' }}>📋 All Bills</h3>
          <div className="list">
            {bills.map((bill, i) => (
              <div key={i} className="list-item slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="list-item-content">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                      {bill.desc ? bill.desc : `Bill #${i + 1}`}
                    </span>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginLeft: '12px'
                    }}>
                      LKR {bill.amount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <span>💳 Paid by: <strong>{bill.payers.join(', ')}</strong></span>
                    <br />
                    <span>🎯 Split between: <strong>{bill.splitters.join(', ')}</strong></span>
                  </div>
                </div>
                <div className="list-item-actions">
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => editBill(i)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => removeBill(i)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bills; 