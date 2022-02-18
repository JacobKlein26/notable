import {
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function ListAppointments({ appointments, physicianId }) {
  if (!appointments.length)
    return (
      <Typography>{physicianId ? "No Appointments" : "Select Physician To see list"}</Typography>
    );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Kind</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map((apnt) => (
          <TableRow key={apnt.id}>
            <TableCell>{apnt.name}</TableCell>
            <TableCell>{apnt.time}</TableCell>
            <TableCell>{apnt.kind}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ListAppointments;
