import React, { useState } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Box,
} from "@mui/material";
import Replay from "@mui/icons-material/Replay";
import Badge from "@mui/material/Badge";
import { DataGrid } from "@mui/x-data-grid";
import { GroupSelect } from "./GroupSelect";
import { useAppContext } from "../AppContext";

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";
const sortOrder = [CHECKIN,CHECKOUT,COMPLETE]

const darken = (color, amount) => {
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  let hex =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");
  return hex;
};

const stringToColor = (str) => {
  // Generate a hash value from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash value to a hex color code
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  // Check if the color is too bright for white lettering
  let brightness = Math.round(
    (parseInt(color.substr(1, 2), 16) * 299 +
      parseInt(color.substr(3, 2), 16) * 587 +
      parseInt(color.substr(5, 2), 16) * 114) /
    1000
  );
  if (brightness > 125) {
    const difference = brightness - 125 + 5;
    // If the color is too bright, darken it
    return darken(color, difference);
  }

  return color;
};

const stringAvatar = (firstName, lastName) => {
  return {
    sx: {
      bgcolor: stringToColor(`${firstName} ${lastName}`),
    },
    children: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`,
  };
};

const PersonAvatar = ({ value, firstName, lastName }) => {
  if (value) {
    return <Avatar alt="User Avatar" src={value} {...stringAvatar(firstName, lastName)} />;
  } else {
    return <Avatar {...stringAvatar(firstName, lastName)} />;
  }
};

const renderAvatar = (params) => {
  const { row } = params;
  const firstName = row.first_name;
  const lastName = row.last_name;
  const photoUrl = row.photo_url;
  const isVeteran = !row.isNew;

  if (isVeteran) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={"⭐"}
      >
        <PersonAvatar
          value={photoUrl}
          firstName={firstName}
          lastName={lastName}
        />
      </Badge>
    );
  }

  return (
    <PersonAvatar value={photoUrl} firstName={firstName} lastName={lastName} />
  );
};

export default function CheckInList({
  users,
  groups,
  oneStepCheckIn = false,
  hideGroup = false,
}) {
  const data = useAppContext();

  const renderTwoStepChip = (params) => {
    const [chipText, setChipText] = useState(CHECKIN);
    // const buttonSx = getButtonStyles(chipText);
    // const buttonIconSx = getButtonIconStyles(chipText)
    // const buttonGroupSx = getButtonGroupStyles(chipText);

    // This varies from the one step, because we want to be able to
    // check out a rider when they aren't in a group -- which is required.
    // Mentors (one step) are allowed to not be in a group.
    React.useEffect(() => {
      if (params.row.check_in == 1 && params.row.check_out == 1) {
        setChipText(COMPLETE);
      } else if (params.row.check_in == 1 && params.row.check_out == 0) {
        setChipText(CHECKOUT);
      } else {
        setChipText(CHECKIN);
      }
    }, [params.row.check_in, params.row.check_out]);

    const user = users.find((user) => user.user_id === params.row.id);

    const handleButtonClick = () => {
      if (chipText === CHECKIN) {
        setChipText(CHECKOUT);
        checkIn(params.row.id);
      } else if (chipText === CHECKOUT) {
        setChipText(COMPLETE);
        checkOut(params.row.id);
      }
    };

    const handleResetClick = () => {
      setChipText(CHECKIN);

      reset(params.row.id);
    };

    const color = React.useMemo(() => {
      if (chipText === CHECKIN) return "lightBlue";
      if (chipText === CHECKOUT) return "darkBlue";
      if (chipText === COMPLETE) return "green";

      return "secondary";
    }, [chipText]);

    const disabled = !Boolean(user.group_id);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="check in or check out button group"
          disabled={disabled}
          color={color}
        >
          <Button onClick={handleButtonClick} disabled={disabled}>
            {chipText}
          </Button>
          {chipText !== CHECKIN ? (
            <Button onClick={handleResetClick} disabled={disabled}>
              <Replay />
            </Button>
          ) : (
            <></>
          )}
        </ButtonGroup>
      </Box>
    );
  };

  const renderOneStepChip = (params) => {
    let defaultState;
    if (params.row.check_in == 1) {
      defaultState = COMPLETE;
    } else {
      defaultState = CHECKIN;
    }

    const [chipText, setChipText] = useState(CHECKIN);

    React.useEffect(() => {
      if (params.row.check_in == 1) {
        setChipText(COMPLETE);
      } else {
        setChipText(CHECKIN);
      }
    }, [params.row.check_in]);

    const user = users.find((user) => user.user_id === params.row.id);
    const disabled = !Boolean(user.group_id);

    const handleButtonClick = () => {
      if (chipText === CHECKIN) {
        setChipText(COMPLETE);
        checkIn(params.row.id);
      }
    };

    const handleResetClick = () => {
      setChipText(CHECKIN);

      reset(params.row.id);
    };

    const color = React.useMemo(() => {
      if (chipText === CHECKIN) return "lightBlue";
      if (chipText === COMPLETE) return "green";

      return "primary";
    }, [chipText]);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="check in or check out button group"
          disabled={disabled}
          color={color}
        >
          <Button onClick={handleButtonClick} disabled={disabled}>{chipText}</Button>
          {chipText !== CHECKIN ? (
            <Button onClick={handleResetClick} disabled={disabled}>
              <Replay />
            </Button>
          ) : (
            <></>
          )}
        </ButtonGroup>
      </Box>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "group_id",
      headerName: "Group #",
      flex: 2,
      renderCell: renderGroupSelect,
    },
    {
      field: "checkin",
      headerName: "Check In/Out",
      flex: 2,
      renderCell: oneStepCheckIn ? renderOneStepChip : renderTwoStepChip,
      valueGetter: (params) => {
        if (params.row.check_in == 1 && params.row.check_out == 1) {
          return(COMPLETE);
        } else if (params.row.check_in == 1 && params.row.check_out == 0) {
          return(CHECKOUT);
        } else {
          return(CHECKIN);
        }
      },
      sortComparator: (v1, v2, param1, param2) => {
        return sortOrder.indexOf(param1.value) - sortOrder.indexOf(param2.value)
      }
    },
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 1,
      renderCell: renderAvatar,
    },
    { field: "first_name", headerName: "First Name", flex: 2 },
    { field: "last_name", headerName: "Last Name", flex: 2 },
    { field: "fulltext", headerName: "Fulltext", flex: 0 },
  ];

  const rows = users.map((cur) => {
    const fulltext = (
      (cur.group_name ? cur.group_name : "unassigned") +
      cur.first_name +
      cur.last_name
    ).toLowerCase();
    return { ...cur, id: cur.user_id, fulltext };
  });

  function checkIn(userId) {
    const user = users.find((user) => user.user_id === userId);

    data.checkIn(userId, user.group_id);
  }

  function checkOut(userId) {
    const user = users.find((user) => user.user_id === userId);

    data.checkOut(userId, user.group_id);
  }

  function reset(userId) {
    const user = users.find((user) => user.user_id === userId);

    data.resetCheckIn(userId, user.group_id);
  }

  function changeGroup(userId, groupId) {
    const rideId = data.currentRide.Ride.ride_id;

    data.changeGroup(userId, rideId, groupId);
  }

  const unassignGroup = async (groupAssignmentId, groupId, userId) => {
    await data.removeFromGroup(groupAssignmentId, groupId, userId);
  };

  function renderGroupSelect(params) {
    const user = users.find((user) => user.user_id === params.row.id);

    return (
      <GroupSelect
        groups={groups}
        userId={params.row.id}
        defaultGroupId={params.row.group_id}
        groupAssignmentId={user.group_assignment_id}
        changeGroup={changeGroup}
        unassignGroup={unassignGroup}
      />
    );
  }

  React.useEffect(() => {
    setFilterModel({
      items: [
        {
          field: "fulltext",
          operator: "contains",
          value: data.searchText.toLowerCase(),
        },
      ],
    });
  }, [data.searchText]);

  const [filterModel, setFilterModel] = React.useState({
    items: [],
  });

  const visibility = {
    id: false,
    fulltext: false,
  };

  if (hideGroup) {
    visibility["group_id"] = false;
  }

  return (
    <Box style={{ width: "100%" }} mb={8}>
      <DataGrid
        filterModel={filterModel}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        hideFooter={true}
        columnVisibilityModel={visibility}
        initialState={{
          sorting: {
            sortModel: [{ field: 'first_name', sort: 'asc' }],
          },
        }}
      />
    </Box>
  );
}
