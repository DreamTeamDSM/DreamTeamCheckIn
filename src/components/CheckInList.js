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

export default function CheckInList({ users, groups, oneStepCheckIn = false, hideGroup = false }) {
  const data = useAppContext();

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'group_id', headerName: 'Group #', flex: 2, renderCell: renderGroupSelect },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: (oneStepCheckIn) ? renderOneStepChip : renderTwoStepChip },
    { field: 'avatar', headerName: 'Avatar', flex: 1, renderCell: rednerAvatar },
    { field: 'first_name', headerName: 'First Name', flex: 2 },
    { field: 'last_name', headerName: 'Last Name', flex: 2 },
    { field: 'fulltext', headerName: 'Fulltext', flex: 0 },
  ];
  const rows = users.map((cur) => {
    const fulltext = (cur.first_name + cur.last_name).toLowerCase();
    return { ...cur, id: cur.user_id, fulltext };
  });

  function checkIn(dispatch, id) {
    //dispatch(CHECKOUT);
    data.checkIn(id);
  }

  function checkOut(dispatch, id) {
    //dispatch(COMPLETE);
    data.checkOut(id);
  }

  function reset(dispatch, id) {
    dispatch(CHECKIN);
    data.resetCheckIn(id);
  }

  function changeGroup(userId, groupId) {
    const rideId = data.currentRide.Ride.ride_id

    data.changeGroup(userId, rideId, groupId);
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
            setChipText(CHECKOUT);
            checkIn(params.row.id);
          } else if (chipText === CHECKOUT) {
            setChipText(COMPLETE);
            checkOut(params.row.id);
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
            setChipText(COMPLETE);
            checkIn(params.row.id);
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
    return (
      <GroupSelect groups={groups} userId={params.row.id} defaultGroupId={params.row.group_id} changeGroup={changeGroup} />);
  }

  React.useEffect(() => {
    console.log(data.searchText);
    setFilterModel({
      items: [
        { field: 'fulltext', operator: 'contains', value: data.searchText.toLowerCase() },
      ]
    })
  }, [data.searchText]);

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


