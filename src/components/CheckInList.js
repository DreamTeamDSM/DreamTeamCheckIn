import React, { useState } from 'react';
import {
  Avatar, Chip
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import { DataGrid } from '@mui/x-data-grid';
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
    const fulltext = (((cur.group_name) ? cur.group_name : "unassigned") + cur.first_name + cur.last_name).toLowerCase();
    return { ...cur, id: cur.user_id, fulltext };
  });

  function checkIn(userId) {
    const user = users.find((user) => user.user_id === userId)

    data.checkIn(userId, user.group_id);
  }

  function checkOut(userId) {
    const user = users.find((user) => user.user_id === userId)

    data.checkOut(userId, user.group_id);
  }

  function reset(userId) {
    const user = users.find((user) => user.user_id === userId)

    data.resetCheckIn(userId, user.group_id);
  }

  function changeGroup(userId, groupId) {
    const rideId = data.currentRide.Ride.ride_id

    data.changeGroup(userId, rideId, groupId);
  }

  const unassignGroup = (groupAssignmentId) => {
    data.removeFromGroup(groupAssignmentId)
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
    const user = users.find((user) => user.user_id === params.row.id)

    return (
      <Chip
        variant="contained"
        label={chipText}
        sx={getChipStyles(chipText)}
        disabled={!Boolean(user.group_id)}
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
          setChipText(CHECKIN)

          reset(params.row.id);
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
    const user = users.find((user) => user.user_id === params.row.id)

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
          setChipText(CHECKIN)

          reset(params.row.id);
        }}
        deleteIcon={< Replay />}
      />
      // </Chip>
    );
  }

  function renderGroupSelect(params) {
    const user = users.find((user) => user.user_id === params.row.id)

    return (
      <GroupSelect
        groups={groups}
        userId={params.row.id}
        defaultGroupId={params.row.group_id}
        groupAssignmentId={user.group_assignment_id}
        changeGroup={changeGroup}
        unassignGroup={unassignGroup}
      />);
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
    <div style={{ width: '100%' }}>
      <DataGrid
        filterModel={filterModel}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        hideFooter={true}
        columnVisibilityModel={visibility}
      />
    </div>
  );
}


