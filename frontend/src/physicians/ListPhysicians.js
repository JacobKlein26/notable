import { Box, List, ListItemButton, ListItemText, Typography} from "@mui/material";
import React from "react";

function ListPhysicians({ physicians, setCurrentId }) {
  return (
    <List>
      {physicians.map((phys) => (
        <ListItemButton key={phys.id} onClick={()=>{setCurrentId(phys.id)}}>
          <ListItemText primary={phys.name} seconday={phys.email} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default ListPhysicians;
