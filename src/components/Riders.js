import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  Avatar
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const handleChange = (event,info) => {
    console.log("event + info",event, info);
}


  export default function Riders(props) {

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'groupnumber', headerName: 'Group #', width: 90 },
        { field: 'checkin', headerName: 'Check In/Out', width: 150, renderCell: renderButton},
        { field: 'avatar', headerName: 'Avatar', width: 150, renderCell: rednerAvatar},
        { field: 'firstname', headerName: 'First Name', width: 120 },
        { field: 'lastname', headerName: 'Last Name', width: 120 },
      ];

      const rows = props.riders;

    function rednerAvatar(params) {
        return (
            <Avatar src={params.value} alt="User Avatar"/>
        )
    }

    function renderButton(params) {
      console.log(params);
      let defaultState = 'Check In';
      if (params.row.checkin == 1 && params.row.checkout == 1) {
        defaultState = 'Complete';
      } else if (params.row.checkin == 1 && params.row.checkout == 0) {
        defaultState = 'Check Out';
      }

      const [buttonText, setButtonText] = useState(defaultState);
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (buttonText === 'Check In') {
              setButtonText('Check Out');
              props.increase();
            } else if (buttonText === 'Check Out') {
              setButtonText('Complete');
            }
            console.log(`Clicked button for row with id: ${params.id}`);
          }}
        >
          {buttonText}
        </Button>
      );}

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


