/*
import * as React from 'react';
export default function Riders(props) {
    return(
        <div>test</div>
    )
}
*/

import React from 'react';
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
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'groupnumber', headerName: 'Group #', width: 90 },
    { field: 'checkin', headerName: 'Check In', width: 150,
        renderCell: (info) => {
            console.log(info);
            return (<Checkbox value="1" />);
        }
    },
    { field: 'checkout', headerName: 'Check Out', width: 120,
        renderCell: (info) => {
            console.log(info);
            return (<Checkbox value="1" />);
        }
    },
    { field: 'firstname', headerName: 'First Name', width: 120 },
    { field: 'lastname', headerName: 'Last Name', width: 120 },
    { field: 'ridertype', headerName: 'Type', width: 150 },
  ];

  /*
  Aaron	Ayala
  Addison	Palmer
  Alayia	White
  Alex	Erickson
  */

  const rows = [
    { id: 1, groupnumber: 1, checkin: 0, checkout: 0, firstname: "Aaron", lastname: "Ayala", ridertype: "New"},
    { id: 2, groupnumber: 1, checkin: 0, checkout: 0, firstname: "Addison", lastname: "Palmer", ridertype: "Veteran"},
    { id: 3, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Alayia", lastname: "White", ridertype: "New"},
    { id: 4, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Alex", lastname: "Erickson", ridertype: "Mentor"},
  ];

  export default function Riders() {
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