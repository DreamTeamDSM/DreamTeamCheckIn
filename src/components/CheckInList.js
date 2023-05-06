import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar, Chip, Select, FormControl, InputLabel, MenuItem
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid';
import { Button } from './Button'
import { GroupSelect } from './GroupSelect'
import { lighten } from 'polished';
import { useAppContext } from '../AppContext';

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function CheckInList({users,groups,oneStepCheckIn = false,hideGroup = false}) {
  const data = useAppContext();

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'group_id', headerName: 'Group #', flex: 2, renderCell: renderGroupSelect},
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: (oneStepCheckIn) ? renderOneStepChip: renderTwoStepChip },
    { field: 'avatar', headerName: 'Avatar', flex: 1, renderCell: rednerAvatar },
    { field: 'first_name', headerName: 'First Name', flex: 2 },
    { field: 'last_name', headerName: 'Last Name', flex: 2 },
    { field: 'fulltext', headerName: 'Fulltext', flex: 0 },
  ];

  /*
  const groups = [
    {id: 0, name: "Select"},
    {id: 2000, name: "Group 1"},
    {id: 2001, name: "Group 2"},
    {id: 2002, name: "Group 3"},
    {id: 2003, name: "Group 4"},
    {id: 2004, name: "Group 5"},
    {id: 2005, name: "Group 6"},
    {id: 2006, name: "Group 7"},
    {id: 2007, name: "Group 8"},
    {id: 2008, name: "Group 9"},
    {id: 2009, name: "Group 10"},
    {id: 2010, name: "Group 11"},
  ];
  */

  //const riders = data?.currentRide?.Riders || [];
  //const groups = data?.currentRide?.Groups || [];
  console.log(groups);
  const ids = []; // delete when data is real

  const rows = users.map((cur)=>{
    //const fulltext = (cur.groupnumber + " " + cur.first_name + cur.last_name).toLowerCase();
    // need to include group in the fulltext
    const fulltext = (cur.first_name + cur.last_name).toLowerCase();
    //return {...cur,id: cur.user_id, fulltext, check_in: 0, check_out: 0};
    return {...cur,id: cur.user_id, fulltext};
  });

  /*
  .reduce((acc,cur)=>{ // same, remove this reduce when the data is real
    if (ids.includes(cur.id) == false) {
      acc.push(cur);
      ids.push(cur.id);
    }
    return acc;
  },[]);
  */

  console.log(rows);

  function checkIn(dispatch, id) {
    dispatch(CHECKOUT);
    data.checkIn(id);
  }

  function checkOut(dispatch, id) {
    dispatch(COMPLETE);
    data.checkOut(id);
  }

  function reset(dispatch, id) {
    dispatch(CHECKIN);
    data.reset(id);
  }

  function changeGroup(id,groupId) {
    console.log(id,groupId);
    data.changeGroup(id,groupId);
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
      case CHECKOUT:
        return {
          backgroundColor: '#188B54',
          color: '#FFF',
          '&:hover': {
            backgroundColor: lighten(0.1, '#188B54'),
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

  function renderTwoStepChip(params) {
    let defaultState = CHECKIN;
    if (params.row.check_in == 1 && params.row.check_out == 1) {
      defaultState = COMPLETE;
    } else if (params.row.check_in == 1 && params.row.check_out == 0) {
      defaultState = CHECKOUT;
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
          } else if (chipText === CHECKOUT) {
            checkOut(setChipText, params.row.id);
          }
          console.log(`Clicked button for row with id: ${params.id}`);
        }}
        onDelete={chipText === CHECKIN ? undefined : () => {
          reset(setChipText, params.row.id);
        }}
        deleteIcon={< Replay />}
      />
    );
  }


  function renderOneStepChip(params) {
    let defaultState;
    if (params.row.check_in == 1) {
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

  function renderGroupSelect(params) {
    return (<GroupSelect groups={groups} userId={params.row.id} defaultGroupId={params.row.group_id} changeGroup={changeGroup} />);
  }

  React.useEffect(()=>{
    console.log(data.searchText);
    setFilterModel({
      items: [
        { field: 'fulltext', operator: 'contains', value: data.searchText.toLowerCase() },
      ]
    })
  },[data.searchText]);

  const [filterModel, setFilterModel] = React.useState({
    items: []
  });

  const visibility = {
    id: false,
    fulltext: false,
  }

  if (hideGroup) {
    visibility['group_id'] = false;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        filterModel={filterModel}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        columnVisibilityModel={visibility}
      />
    </div>
  );
}


