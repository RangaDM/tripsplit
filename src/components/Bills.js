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

  return (
    <div style={{ marginBottom: 32 }}>
      <h2>{editIndex !== null ? 'Edit Bill' : 'Add Bill'}</h2>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
        min="0"
        step="0.01"
      />
      <input
        type="text"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description (optional)"
        style={{ marginLeft: 8 }}
      />
      <div style={{ margin: '8px 0' }}>
        <span>Payer: </span>
        {members.map(m => (
          <label key={m} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={payers.includes(m)}
              onChange={() => togglePayer(m)}
              disabled={payers.length > 0 && !payers.includes(m)}
            />
            {m}
          </label>
        ))}
      </div>
      <div style={{ margin: '8px 0' }}>
        <span>Split Between: </span>
        {members.map(m => (
          <label key={m} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={splitters.includes(m)}
              onChange={() => toggleSplitter(m)}
            />
            {m}
          </label>
        ))}
      </div>
      <button onClick={addBill}>{editIndex !== null ? 'Update Bill' : 'Add Bill'}</button>
      <h3>All Bills</h3>
      <ul>
        {bills.map((b, i) => (
          <li key={i}>
            {b.desc ? b.desc + ': ' : ''}LKR : {b.amount.toFixed(2)} paid by {b.payers.join(', ')} split between {b.splitters ? b.splitters.join(', ') : members.join(', ')}
            <button onClick={() => removeBill(i)} style={{ marginLeft: 8 }}>Remove</button>
            <button onClick={() => editBill(i)} style={{ marginLeft: 8 }}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bills; 