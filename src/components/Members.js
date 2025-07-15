import React, { useState } from 'react';

function Members({ members, setMembers }) {
  const [name, setName] = useState('');

  const addMember = () => {
    if (name.trim() && !members.includes(name.trim())) {
      setMembers([...members, name.trim()]);
      setName('');
    }
  };

  const removeMember = (removeName) => {
    setMembers(members.filter(m => m !== removeName));
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2>Group Members</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter member name"
      />
      <button onClick={addMember} style={{ marginLeft: 8 }}>Add</button>
      <ul>
        {members.map(m => (
          <li key={m}>
            {m} <button onClick={() => removeMember(m)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Members; 