import React, { useState } from 'react';
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar, Chip
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from './Button'

const handleChange = (event, info) => {
  console.log("event + info", event, info);
}

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function Riders(props) {
  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'groupnumber', headerName: 'Group #', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderChip },
    { field: 'avatar', headerName: 'Avatar', flex: 1, renderCell: rednerAvatar },
    { field: 'firstname', headerName: 'First Name', flex: 2 },
    { field: 'lastname', headerName: 'Last Name', flex: 2 },
  ];

  const rows = props.riders;

  function checkIn(dispatch, id) {
    dispatch(CHECKOUT);
    props.checkIn(id);
  }

  function checkOut(dispatch, id) {
    dispatch(COMPLETE);
    props.checkOut(id);
  }

  function reset(dispatch, id) {
    dispatch(CHECKIN);
    props.reset(id);
  }

  function rednerAvatar(params) {
    return (
      <Avatar src={params.value} alt="User Avatar" />
    )
  }


  function renderChip(params) {
    console.log(params);
    let defaultState = CHECKIN;
    if (params.row.checkin == 1 && params.row.checkout == 1) {
      defaultState = COMPLETE;
    } else if (params.row.checkin == 1 && params.row.checkout == 0) {
      defaultState = CHECKOUT;
    }

    const [chipText, setChipText] = useState(defaultState);

    return (
      <Chip
        variant="contained"
        color="primary"
        label={chipText}

        onClick={() => {
          if (chipText === CHECKIN) {
            checkIn(setChipText, params.row.id);
          } else if (chipText === CHECKOUT) {
            checkOut(setChipText, params.row.id);
          }
          console.log(`Clicked button for row with id: ${params.id}`);
        }}
        onDelete={() => {
          if (chipText !== CHECKIN) {
            reset(setChipText, params.row.id);
          }
        }}
        deleteIcon={<Replay />}
      />
      // </Chip>
    );
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        columnVisibilityModel={{
          id: false,
        }}
      />
    </div>
  );
}


