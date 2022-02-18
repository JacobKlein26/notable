import {useState} from "react";
import {TextField, Grid, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from "@mui/material/";
import { Close as CloseIcon } from '@mui/icons-material';

function PhysicianDialog({
  show,
  hide,
  currentPhysician,
  // setPhysician,
  physicianAdded,
  physicianUpdated,
  updating,
}) {
  const [physician, setPhysician] = useState(currentPhysician)
  const submitForm = async (e) => {
    e.preventDefault();
    let url = `http://localhost:3001/physicians`;
    if (updating) url += `/${physician.id}`;
    const result = await fetch(url, {
      method: updating ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(physician),
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error("failed to send request: ", e);
      });
    updating ? physicianUpdated(result.id, result) : physicianAdded(result);
    hide();
  };
  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type == "number") value = parseFloat(value) || 0;
    setPhysician({
      ...physician,
      [e.target.name]: value,
    });
  };
  return (
    <Dialog open={show} onClose={hide} fullWidth maxWidth="md">
      {/* <DialogTitle>{updating ? 'Update' : 'Add'} Physicion</DialogTitle> */}
      <DialogTitle>
        <Grid container justifyContent="center">
          <Grid item flexGrow={1}>
            {updating ? "Update" : "Add"} Physicion
          </Grid>
          <Grid item>
            <IconButton onClick={hide}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <Divider />
      <form onSubmit={submitForm}>
        <DialogContent dividers={true} sx={{ minHeight: 400 }}>
          <TextField margin="normal" fullWidth name="name" label="Name" value={physician.name} onChange={handleChange} />
          <TextField margin="normal" type="email" name="email" label="Email" fullWidth value={physician.email} onChange={handleChange} />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={hide}>Cancel</Button>
          <Button onClick={submitForm}>{updating ? 'Update' : 'Add'} Physician</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default PhysicianDialog;
