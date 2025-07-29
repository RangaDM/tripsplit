import React, { useRef } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import html2canvas from 'html2canvas';
import settleUp from '../utils/settleUp';

function ExportSummary({ members, bills }) {
  const ref = useRef();
  const settlements = settleUp(members, bills);

  // Group settlements by recipient (to)
  const grouped = {};
  settlements.forEach(s => {
    if (!grouped[s.to]) grouped[s.to] = [];
    grouped[s.to].push(s);
  });

  const totalExpenditure = bills.reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleTextExport = () => {
    if (!members.length || !bills.length) {
      alert('Nothing to download yet!');
      return;
    }
    let text = 'TripSplit Summary\n\n';
    text += 'Members: ' + members.join(', ') + '\n\n';
    text += 'Bills:\n';
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
      const newCanvas = document.createElement('canvas');
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      const ctx = newCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0);

      const text = 'TripSplit - Bill Splitter | RangaDM';
      const fontSize = Math.floor(newCanvas.width / 60);
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

      const link = document.createElement('a');
      link.download = 'tripsplit-summary.png';
      link.href = newCanvas.toDataURL();
      link.click();
    });
  };

  return (
    <Box mx={5}>
      <Typography color='#264653' variant="h5" gutterBottom>
        Export Summary
      </Typography>

      <Paper ref={ref} elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Typography variant="h6" gutterBottom>
          TripSplit Summary
        </Typography>

        <Typography><strong>Members:</strong> {members.join(', ')}</Typography>

        <Typography sx={{ mt: 1, mb: 2 }}><strong>Total Expenditure:</strong> LKR {totalExpenditure.toFixed(2)}</Typography>

        <Typography variant="subtitle1" gutterBottom><strong>Bills:</strong></Typography>
        <ul>
          {bills.map((b, i) => (
            <li key={i}>
              {b.desc ? b.desc + ': ' : ''}LKR {b.amount.toFixed(2)} paid by {b.payers.join(', ')}
            </li>
          ))}
        </ul>

        <Typography variant="subtitle1" gutterBottom><strong>Settlements:</strong></Typography>
        {settlements.length === 0 ? (
          <Typography>No settlements needed.</Typography>
        ) : (
          Object.keys(grouped).map(to => (
            <Box key={to} mb={3}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                To {to}:
              </Typography>
              <Table size="small" aria-label={`Settlements to ${to}`} sx={{ minWidth: 250 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount (LKR)</TableCell>
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
            </Box>
          ))
        )}
      </Paper>

      <Box mb={2} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleTextExport}>
          Download as Text
        </Button>
        <Button variant="outlined" color="primary" onClick={handleImageExport}>
          Download as Image
        </Button>
      </Box>
    </Box>
  );
}

export default ExportSummary;
