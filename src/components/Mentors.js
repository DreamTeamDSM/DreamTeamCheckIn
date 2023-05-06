import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar, Chip
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid';
import { Button } from './Button'
import { lighten } from 'polished';

const CHECKIN = "Check In";
const COMPLETE = "Complete";

export default function Mentors(props) {

const mentors = [
  { id: 6, groupnumber: 1, checkin: 0, firstname: "Alex", lastname: "Erickson", ridertype: "Mentor", },
  { id: 7, groupnumber: 2, checkin: 0, firstname: "Peter", lastname: "Parker", ridertype: "Mentor", },
];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'groupnumber', headerName: 'Group #', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderChip },
    { field: 'avatar', headerName: 'Avatar', flex: 1, renderCell: rednerAvatar },
    { field: 'firstname', headerName: 'First Name', flex: 2 },
    { field: 'lastname', headerName: 'Last Name', flex: 2 },
    { field: 'fulltext', headerName: 'Fulltext', flex: 0 },
  ];

  const rows = props.riders;

  function checkIn(dispatch, id) {
    dispatch(COMPLETE);
    props.checkIn(id);
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

  function getChipStyles(label) {
    switch (label) {
      case CHECKIN:
        return {
          backgroundColor: '#849CC2',
          color: '#FFF',
          '&:hover': {
            backgroundColor: lighten(0.1, '#849CC2'),
          },
          '& .MuiChip-deleteIcon': {
            color: 'white',
            '&:hover': {
              color: 'darkred',
            }
          }
        };
      default:
        return {
          backgroundColor: '#0D2A57',
          color: '#FFF',
          '&:hover': {
            backgroundColor: lighten(0.1, '#0D2A57'),
          },
          '& .MuiChip-deleteIcon': {
            color: 'white',
            '&:hover': {
              color: 'darkred',
            }
          }
        };
    }
  }

  function renderChip(params) {
    let defaultState;
    if (params.row.checkin == 1) {
      defaultState = COMPLETE;
    } else {
      defaultState = CHECKIN;
    }

    const [chipText, setChipText] = useState(defaultState);


    return (
      <Chip
        variant="contained"
        label={chipText}
        sx={getChipStyles(chipText)}

        onClick={() => {
          if (chipText === CHECKIN) {
            checkIn(setChipText, params.row.id);
          }
          console.log(`Clicked button for row with id: ${params.id}`);
        }}
        onDelete={chipText === CHECKIN ? undefined : () => {
          reset(setChipText, params.row.id);
        }}
        deleteIcon={< Replay />}
      />
      // </Chip>
    );
  }



  React.useEffect(()=>{
    setFilterModel({
      items: [
        { field: 'fulltext', operator: 'contains', value: props.searchText.toLowerCase() },
      ]
    })
  },[props.searchText]);

  const [filterModel, setFilterModel] = React.useState({
    items: []
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        filterModel={filterModel}
        rows={mentors}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        columnVisibilityModel={{
          id: false,
          fulltext: false,
        }}
      />
    </div>
  );
}


