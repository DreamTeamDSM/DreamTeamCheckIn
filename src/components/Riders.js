import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
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
        { field: 'ridertype', headerName: 'Type', width: 150 },
      ];

      const rows = props.riders;

    function rednerAvatar(params) {
        return (
            <Avatar src={params.value} alt="User Avatar"/>
        )
    }

    function renderButton(params) {
      const [buttonText, setButtonText] = useState('Check In');
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setButtonText(buttonText === 'Check In' ? 'Check Out' : 'Check In');
            console.log(`Clicked button for row with id: ${params.id}`);
            if (buttonText == "Check In") {
              props.increase();
            } else {
              props.decrease();
            }
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


