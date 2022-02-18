import { useState } from "react";
import {
  TextField,
  Grid,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material/";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateAdapter from "@mui/lab/AdapterDayjs";

import { Close as CloseIcon } from "@mui/icons-material";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";

function AppointmentDialog({ show, hide, appointment, setAppointment, appointmentAdded, updating }) {
  // const [appointment, setAppointment] = useState(currentAppointment);
  const submitForm = async (e) => {
    e.preventDefault();
    let url = `http://localhost:3001/appointments`;
    // if (updating) url += `/${physician.id}`;
    const result = await fetch(url, {
      method: updating ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error("failed to send request: ", e);
      });
    // updating ? appointmentUpdated(result.id, result) : appointmentAdded(result);
    appointmentAdded(result);
    hide();
  };
  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type == "number") value = parseFloat(value) || 0;
    setAppointment({
      ...appointment,
      [e.target.name]: value,
    });
  };
  const handleTimeChange = (e,newValue)=>{
    console.log(e)
        setAppointment({
      ...appointment, 
      time: new Date(e.toString()).toLocaleString()
    })
    console.log(appointment)
  } 
  return (
    <Dialog open={show} onClose={hide} fullWidth maxWidth="md">
      <DialogTitle>
        <Grid container justifyContent="center">
          <Grid item flexGrow={1}>
            {updating ? "Update" : "Add"} Appointment
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
          <TextField
            margin="normal"
            fullWidth
            name="name"
            label="Name"
            value={appointment.name}
            onChange={handleChange}
          />
          {/* <TextField
            margin="normal"
            type="date-time"
            name="time"
            label="time"
            fullWidth
            value={appointment.time}
            onChange={handleChange}
          /> */}
          <FormControl margin="normal" fullWidth>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DateTimePicker
                margin="normal"
                fullWidth
                name="time"
                label="Time"
                value={appointment.time}
                onChange={handleTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            name="kind"
            label="Kind"
            value={appointment.kind}
            onChange={handleChange}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={hide}>Cancel</Button>
          <Button onClick={submitForm}>{updating ? "Update" : "Add"} Physician</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AppointmentDialog;
