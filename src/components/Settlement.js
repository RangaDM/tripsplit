import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import settleUp from '../utils/settleUp';

function Settlement({ members, bills }) {
  const settlements = settleUp(members, bills);

  // Group settlements by 'to'
  const grouped = {};
  settlements.forEach(s => {
    if (!grouped[s.to]) grouped[s.to] = [];
    grouped[s.to].push(s);
  });

  return (
    <Box mx={5} mb={4}>
      <Typography color='#264653' variant="h5" gutterBottom>
        Settlement
      </Typography>

      {settlements.length === 0 ? (
        <Typography color="text.secondary">No settlements needed.</Typography>
      ) : (
        Object.keys(grouped).map(to => (
          <Box key={to} mb={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              To {to}:
            </Typography>
            <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
              <Table size="small" aria-label={`Settlements to ${to}`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Amount (LKR)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grouped[to].map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.from}</TableCell>
                      <TableCell align="right">{s.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        ))
      )}
    </Box>
  );
}

export default Settlement;
