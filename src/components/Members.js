import React, { useState } from 'react';

function Members({ members, setMembers, bills, setBills }) {
  const [name, setName] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');

  const addMember = () => {
    if (name.trim() && !members.includes(name.trim())) {
      setMembers([...members, name.trim()]);
      setName('');
    }
  };

  const removeMember = (removeName) => {
    setMembers(members.filter(m => m !== removeName));
    // Also remove this member from all bills
    setBills(bills.map(bill => ({
      ...bill,
      payers: bill.payers.filter(p => p !== removeName),
      splitters: bill.splitters.filter(s => s !== removeName)
    })).filter(bill => bill.payers.length > 0 && bill.splitters.length > 0));
  };

  const startEditing = (member) => {
    setEditingMember(member);
    setEditName(member);
  };

  const saveEdit = () => {
    if (editName.trim() && editName.trim() !== editingMember && !members.includes(editName.trim())) {
      const oldName = editingMember;
      const newName = editName.trim();
      
      // Update members array
      setMembers(members.map(m => m === oldName ? newName : m));
      
      // Update bills array - replace old name with new name in payers and splitters
      setBills(bills.map(bill => ({
        ...bill,
        payers: bill.payers.map(p => p === oldName ? newName : p),
        splitters: bill.splitters.map(s => s === oldName ? newName : s)
      })));
      
      setEditingMember(null);
      setEditName('');
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setEditName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMember();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="card slide-in">
      <div className="card-header">
        <div className="card-icon" style={{ background: 'linear-gradient(135deg, #56ab2f, #a8e6cf)' }}>
          👥
        </div>
        <h2 className="card-title">Group Members</h2>
        {members.length > 0 && (
          <span className="status-badge status-success">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-row">
          <div className="form-control">
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter member name"
            />
          </div>
          <button 
            className="btn btn-success" 
            onClick={addMember}
            disabled={!name.trim() || members.includes(name.trim())}
          >
            ➕ Add Member
          </button>
        </div>
      </div>

      {members.length > 0 ? (
        <div className="list">
          {members.map((member, index) => (
            <div key={member} className="list-item slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="list-item-content">
                {editingMember === member ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {editName.charAt(0).toUpperCase()}
                    </div>
                    <input
                      type="text"
                      className="input-field"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      style={{ flex: 1, margin: 0 }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '500', fontSize: '16px' }}>{member}</span>
                  </div>
                )}
              </div>
              <div className="list-item-actions">
                {editingMember === member ? (
                  <>
                    <button 
                      className="btn btn-success btn-small"
                      onClick={saveEdit}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>✅</span>
                      <span className="action-text">Save</span>
                    </button>
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={cancelEdit}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>❌</span>
                      <span className="action-text">Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => startEditing(member)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>✏️</span>
                      <span className="action-text">Edit</span>
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => removeMember(member)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>🗑️</span>
                      <span className="action-text">Remove</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No members added yet</p>
          <p style={{ fontSize: '14px', color: '#999' }}>Add your first group member to get started</p>
        </div>
      )}
    </div>
  );
}

export default Members; 