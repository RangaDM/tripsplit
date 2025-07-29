import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Members({ members, setMembers }) {
  const [name, setName] = useState('');

  const addMember = () => {
    const trimmed = name.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setName('');
    }
  };

  const removeMember = (removeName) => {
    setMembers(members.filter(m => m !== removeName));
  };

  return (
    <Box mb={4}>
      <Typography color='#264653' variant="h5" gutterBottom>
        Group Members
      </Typography>
      <Box mx={5} display="flex" gap={2} mb={2}>
        <TextField
          label="Enter member name"
          variant="outlined"
          size="small"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addMember();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={addMember} disabled={!name.trim()}>
          Add
        </Button>
      </Box>

      <Divider />

      {members.length === 0 ? (
        <Typography mt={2} mx={5} color="text.secondary">
          No members added yet.
        </Typography>
      ) : (
        <List sx={{ mx: 5 }}>
          {members.map(m => (
            <ListItem
              key={m}
              secondaryAction={
                <IconButton color='error' edge="end" aria-label="remove" onClick={() => removeMember(m)}>
                  <DeleteIcon />
                </IconButton>
              }
              divider
            >
              <ListItemText primary={m} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default Members;
