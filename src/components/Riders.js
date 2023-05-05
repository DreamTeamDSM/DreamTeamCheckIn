import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import { Button } from './Button'

const useStyles = makeStyles({
  tableHeader: {
    backgroundColor: '#EAEAE7'
  },
});


const handleChange = (event, info) => {
  console.log("event + info", event, info);
}

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function Riders(props) {
  const styles = useStyles();

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'groupnumber', headerName: 'Group #', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderButton },
    { field: 'avatar', headerName: 'Avatar', flex: 1, renderCell: renderAvatar },
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

  function renderAvatar(params) {
    return (
      <Avatar src={params.value} alt="User Avatar" />
    )
  }


  function renderButton(params) {
    console.log(params);
    let defaultState = CHECKIN;
    if (params.row.checkin == 1 && params.row.checkout == 1) {
      defaultState = COMPLETE;
    } else if (params.row.checkin == 1 && params.row.checkout == 0) {
      defaultState = CHECKOUT;
    }

    const [buttonText, setButtonText] = useState(defaultState);
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (buttonText === CHECKIN) {
            checkIn(setButtonText, params.row.id);
          } else if (buttonText === 'Check Out') {
            checkOut(setButtonText, params.row.id);
          }
          console.log(`Clicked button for row with id: ${params.id}`);
        }}
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        headerClassName={styles.tableHeader}
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


