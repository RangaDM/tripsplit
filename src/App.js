import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import Bills from "./components/Bills";
import ExportSummary from "./components/ExportSummary";
import Members from "./components/Members";
import Settlement from "./components/Settlement";

function App() {
  const [members, setMembers] = useState([]);
  const [bills, setBills] = useState([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const downloadState = () => {
    if (members.length === 0 && bills.length === 0) {
      alert("Nothing to download yet!");
      return;
    }
    const data = { members, bills };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
      now.getHours()
    )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    a.href = url;
    a.download = `tripsplit-state-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    setMembers([]);
    setBills([]);
    setResetDialogOpen(false);
    setSnackbar({ open: true, message: "State reset successfully.", severity: "info" });
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container style={{ padding: '15px', backgroundColor: 'white' }} maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        <span style={{ fontWeight: "bold", color: '#264653' }}>TripSplit</span>{" "}
        <span style={{ fontWeight: "normal", fontSize: "0.5em", color: '#2a9d8f' }}>Bill Splitter</span>
      </Typography>

      <Members members={members} setMembers={setMembers} />
      <Bills members={members} bills={bills} setBills={setBills} />
      <Settlement members={members} bills={bills} />

      <Box textAlign="center" mt={3}>
        <Button variant="contained" color="primary" onClick={downloadState} sx={{ px: 4, fontWeight: "bold" }}>
          Download State
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mb={4}>
        <input
          id="upload-state-input"
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
              const text = await file.text();
              const data = JSON.parse(text);
              if (Array.isArray(data.members) && Array.isArray(data.bills)) {
                setMembers(data.members);
                setBills(data.bills);
                setSnackbar({ open: true, message: "State loaded successfully!", severity: "success" });
              } else {
                setSnackbar({ open: true, message: "Invalid file format.", severity: "error" });
              }
            } catch (err) {
              setSnackbar({ open: true, message: "Failed to load file: " + err.message, severity: "error" });
            }
            e.target.value = "";
          }}
        />

        <Box sx={{ width: 260 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => document.getElementById("upload-state-input").click()}
            >
              Load Previous State
            </Button>
            <Tooltip title="Restore your saved members and bills to continue where you left off.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ width: 220 }}>
          <Button fullWidth variant="contained" color="error" onClick={handleResetClick}>
            Reset
          </Button>
        </Box>
      </Stack>




      <Divider sx={{ my: 4 }} />

      <ExportSummary members={members} bills={bills} />

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Are you sure you want to reset all members and bills? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="error" autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
