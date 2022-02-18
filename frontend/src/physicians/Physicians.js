import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ListPhysicians from "./ListPhysicians.js";
import ListAppointments from "./ListAppointments.js";
import { Add as AddIcon } from "@mui/icons-material";

import PhysDialog from "./PhysicianDialog.js";
import ApptDialog from "./AppointmentDialog.js";

const getPhysicians = () => {
  return new Promise((res, rej) => {
    fetch("http://localhost:3001/physicians")
      .then((x) => x.json())
      .then((resp) => {
        return res(resp);
      })
      .catch((e) => {
        console.error("failed to get physicians: ", e);
        return rej([]);
      });
  });
};
const getAppointments = () => {
  return new Promise((res, rej) => {
    fetch("http://localhost:3001/appointments")
      .then((x) => x.json())
      .then((resp) => {
        return res(resp);
      })
      .catch((e) => {
        console.error("failed to get appointments: ", e);
        return rej([]);
      });
  });
};
const getPhysiciansAndAppointments = () => {
  return new Promise(async (res, rej) => {
    const physicians = await getPhysicians();
    const appointments = await getAppointments();
    return res({ physicians, appointments });
  });
};
const blankPhys = { name: "", email: "" };
const blankAppt = { name: "", 
time: new Date().toLocaleString(), 
// time: new Date('2014-08-18T21:11:54'), 
kind: "" };
function Physicians() {
  const [physicians, setPhysicians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [currentPhysicianId, setCurrentPhysicianId] = useState(null);
  const [currentPhysician, setCurrentPhysician] = useState(blankPhys);
  const [currentAppointment, setCurrentAppointment] = useState(blankAppt);
  useEffect(() => {
    const phys = physicians.filter((phys) => phys.id === currentPhysicianId)[0];
    if (phys) setCurrentPhysician(phys);
  }, [currentPhysicianId]);

  const getAppointmentsByPhysicianId = (id) => {
    return appointments.filter((apnt) => apnt.physicianId === id);
  };
  useEffect(() => {
    const callGetPhysicians = async () => {
      const result = await getPhysiciansAndAppointments();
      setPhysicians(result.physicians);
      setAppointments(result.appointments);
    };
    callGetPhysicians();
  }, []);

  // CRUD stuff
  const [showPhysDialog, setShowPhysDialog] = useState(false);
  const hidePhysDialog = () => {
    setShowPhysDialog(false);
  };
  const addPhysician = () => {
    setCurrentPhysician(blankPhys);
    setShowPhysDialog(true);
  };
  const physicianUpdated = (id, data) => {
    setPhysicians(
      physicians.map((phys) => {
        if (phys.id === id) {
          return data;
        }
        return phys;
      })
    );
  };
  const physicianAdded = (phys) => {
    setPhysicians([...physicians, phys]);
  };

  const [showApptDialog, setShowApptDialog] = useState(false);
  const hideApptDialog = () => {
    setShowApptDialog(false);
  };
  const addAppointment = () => {
    setCurrentAppointment({ ...blankAppt, physicianId: currentPhysicianId });
    setShowApptDialog(true);
  };
  const appointmentAdded = (appt) => {
    setAppointments([...appointments, appt]);
  };
  return (
    <>
      <Container sx={{ mt: 10 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item sx={{ background: "lightgrey", minWidth: 250 }}>
            <Grid container direction="column" alignContent="" sx={{ m: 1 }} spacing={1}>
              <Grid item>
                <Typography variant="h4" color="initial" flexGrow={1}>
                  Physicians
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={addPhysician} variant="contained" startIcon={<AddIcon />}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <ListPhysicians physicians={physicians} setCurrentId={setCurrentPhysicianId} />
          </Grid>
          <Grid item sx={{ minWidth: 400 }}>
            <Grid container direction="column" alignContent="" sx={{ m: 1 }} spacing={1}>
              <Grid item>
                <Typography variant="h3" color="initial">
                  {(currentPhysician && currentPhysician.name) || ""}
                </Typography>
              </Grid>
              <Grid item>
                {currentPhysicianId && <Button onClick={addAppointment} variant="contained" startIcon={<AddIcon />}>
                  Add Appointment
                </Button>}
                
              </Grid>
            </Grid>

            <ListAppointments
              physicianId={currentPhysicianId}
              appointments={getAppointmentsByPhysicianId(currentPhysicianId)}
            />
          </Grid>
        </Grid>
      </Container>
      <PhysDialog
        show={showPhysDialog}
        hide={hidePhysDialog}
        currentPhysician={currentPhysician}
        physicianAdded={physicianAdded}
        physicianUpdated={physicianUpdated}
      />
      <ApptDialog
        show={showApptDialog}
        hide={hideApptDialog}
        appointment={currentAppointment}
        setAppointment={setCurrentAppointment}
        appointmentAdded={appointmentAdded}
      />
    </>
  );
}

export default Physicians;
