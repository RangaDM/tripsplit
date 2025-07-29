import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Bills({ members, bills, setBills }) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [payers, setPayers] = useState([]);
  const [splitters, setSplitters] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState(null);

  const clearForm = () => {
    setAmount('');
    setDesc('');
    setPayers([]);
    setSplitters([]);
    setEditIndex(null);
  };

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const isFormValid = () =>
    parseFloat(amount) > 0 && payers.length > 0 && splitters.length > 0;

  const addBill = () => {
    const amt = parseFloat(amount);
    if (!isFormValid()) {
      showMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    if (editIndex !== null) {
      const updatedBills = [...bills];
      updatedBills[editIndex] = { amount: amt, desc, payers: [...payers], splitters: [...splitters] };
      setBills(updatedBills);
      showMessage('Bill updated successfully.');
    } else {
      setBills([
        ...bills,
        { amount: amt, desc, payers: [...payers], splitters: [...splitters] }
      ]);
      showMessage('Bill added successfully.');
    }

    clearForm();
  };

  const togglePayer = (name) => {
    setPayers(payers.includes(name) ? [] : [name]); // Only one payer
  };

  const toggleSplitter = (name) => {
    setSplitters(
      splitters.includes(name)
        ? splitters.filter(s => s !== name)
        : [...splitters, name]
    );
  };

  const removeBill = (idx) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setBills(bills.filter((_, i) => i !== idx));
      showMessage('Bill removed successfully.');
    }
  };

  const editBill = (idx) => {
    const b = bills[idx];
    setAmount(b.amount.toString());
    setDesc(b.desc || '');
    setPayers([...b.payers]);
    setSplitters([...b.splitters]);
    setEditIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box mb={4}>
      <Typography color='#264653' variant="h5" gutterBottom>
        {editIndex !== null ? 'Edit Bill' : 'Add Bill'}
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} mx={5} mb={2}>
        <TextField
          label="Amount (LKR)"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
        />
        <TextField
          label="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          fullWidth
        />
      </Stack>

      <Box mb={2} mx={5}>
        <Typography variant="subtitle1" gutterBottom>Payer (only one):</Typography>
        <FormGroup row>
          {members.map(m => (
            <FormControlLabel
              key={m}
              control={
                <Checkbox
                  checked={payers.includes(m)}
                  onChange={() => togglePayer(m)}
                  disabled={payers.length > 0 && !payers.includes(m)}
                />
              }
              label={m}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mx={5} mb={2}>
        <Typography variant="subtitle1" gutterBottom>Split Between:</Typography>
        <FormGroup row>
          {members.map(m => (
            <FormControlLabel
              key={m}
              control={
                <Checkbox
                  checked={splitters.includes(m)}
                  onChange={() => toggleSplitter(m)}
                />
              }
              label={m}
            />
          ))}
        </FormGroup>
      </Box>

      <Stack direction="row" mx={5} spacing={2} mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={addBill}
          disabled={!isFormValid()}
        >
          {editIndex !== null ? 'Update Bill' : 'Add Bill'}
        </Button>
        {editIndex !== null && (
          <Button variant="outlined" onClick={clearForm}>
            Cancel
          </Button>
        )}
      </Stack>

      <Typography color='#264653' variant="h6" gutterBottom>
        All Bills
      </Typography>

      {bills.length === 0 ? (
        <Typography mx={5} color="text.secondary">No bills added yet.</Typography>
      ) : (
        <Paper sx={{mx: 5 }} variant="outlined">
          <List>
            {bills.map((b, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <>
                    <IconButton color='primary' edge="end" aria-label="edit" onClick={() => editBill(i)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color='error' edge="end" aria-label="remove" onClick={() => removeBill(i)} sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
                divider
              >
                <ListItemText
                  primary={`${b.desc ? b.desc + ': ' : ''}LKR ${b.amount.toFixed(2)}`}
                  secondary={`Paid by: ${b.payers.join(', ')} | Split between: ${b.splitters.join(', ')}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default Bills;
