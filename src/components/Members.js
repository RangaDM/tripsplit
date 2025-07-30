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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMember();
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
              </div>
                             <div className="list-item-actions">
                 <button 
                   className="btn btn-danger btn-small"
                   onClick={() => removeMember(member)}
                   style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                 >
                   <span>🗑️</span>
                   <span>Remove</span>
                 </button>
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