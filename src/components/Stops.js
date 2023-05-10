import React, { useState } from "react";
import Replay from "@mui/icons-material/Replay";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  ButtonGroup,
  Box, Avatar,
  AvatarGroup,
} from "@mui/material";
import Badge from "@mui/material/Badge";


import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppContext } from "../AppContext";
import { stringToColor } from "../utils/colors";

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function Stops({ stops, groups, groupStops }) {
  const data = useAppContext();

  const groupLookup = groups.reduce((acc, cur) => {
    acc[cur.group_id] = cur.group_name;
    return acc;
  }, {});

  const rows = groupStops.map((cur) => {
    const group_name = groupLookup[cur.group_id];
    return { ...cur, id: cur.stop_id + "_" + cur.group_id, group_name };
  });

  console.log(rows);

  const groupColumns = [
    { field: "id", headerName: "Stop Group ID", flex: 1 },
    { field: "group_name", headerName: "Description", flex: 1 },
    {
      field: "checkin",
      headerName: "Check In/Out",
      flex: 1,
      renderCell: renderActionButton,
    },
    { field: "avatars", headerName: "Avatars", flex: 2, renderCell: renderAvatars },
  ];

  function checkIn(dispatch, stopId, groupId) {
    dispatch(CHECKOUT);
    data.checkInStop(stopId, groupId);
  }

  function checkOut(dispatch, stopId, groupId) {
    dispatch(COMPLETE);
    data.checkOutStop(stopId, groupId);
  }

  function reset(dispatch, stopId, groupId) {
    dispatch(CHECKIN);
    data.resetCheckInStop(stopId, groupId);
  }

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

function renderAvatars(params){
  const avatars = [
    ...data.currentRide.Riders.filter(x => x.group_id == params.row.group_id && x.check_in == 1),
    ...data.currentRide.Mentors.filter(x => x.group_id == params.row.group_id && x.check_in == 1)
  ]
  console.log(avatars); // avatars.photo_url
  return (
    <AvatarGroup max={8}>
     {avatars.map(x => renderAvatar({row: x}))}
    </AvatarGroup>);
}

  function renderActionButton(params) {
    let defaultState = CHECKIN;
    if (params.row.check_in == 1 && params.row.check_out == 1) {
      defaultState = COMPLETE;
    } else if (params.row.check_in == 1 && params.row.check_out == 0) {
      defaultState = CHECKOUT;
    }

    const [chipText, setChipText] = useState(defaultState);

    const handleButtonClick = () => {
      if (chipText === CHECKIN) {
        checkIn(setChipText, params.row.stop_id, params.row.group_id);
      } else if (chipText === CHECKOUT) {
        checkOut(setChipText, params.row.stop_id, params.row.group_id);
      }
    };

    const handleResetClick = () => {
      reset(setChipText, params.row.stop_id, params.row.group_id);
    };

    const color = React.useMemo(() => {
      if (chipText === CHECKIN) return "lightBlue";
      if (chipText === CHECKOUT) return "darkBlue";
      if (chipText === COMPLETE) return "green";

      return "secondary";
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
          color={color}
        >
          <Button onClick={handleButtonClick}>{chipText}</Button>
          {chipText !== CHECKIN ? (
            <Button onClick={handleResetClick}>
              <Replay />
            </Button>
          ) : (
            <></>
          )}
        </ButtonGroup>
      </Box>
    );
  }

  return (
    <div>
      {stops.map((stop) => {
        const filteredRows = rows.filter((cur) => {
          return (
            stop.stop_id == cur.stop_id && cur.group_name.indexOf("Group") > -1
          );
        });

        const checkInCount = filteredRows.reduce((acc, cur) => {
          if (cur.check_in == 0) acc++;
          return acc;
        }, 0);
        const checkOutCount = filteredRows.reduce((acc, cur) => {
          if (cur.check_in == 1 && cur.check_out == 0) acc++;
          return acc;
        }, 0);
        const completeCount = filteredRows.reduce((acc, cur) => {
          if (cur.check_in == 1 && cur.check_out == 1) acc++;
          return acc;
        }, 0);

        console.log("filteredRows", filteredRows);

        return (
          <Accordion key={stop.stop_id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{stop.description}</Typography>
              <Typography style={{ marginLeft: "auto" }}>
                {checkInCount} / {checkOutCount} / {completeCount}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: "100%" }}>
                <DataGrid
                  rows={filteredRows}
                  columns={groupColumns}
                  pageSize={15}
                  hideFooter={true}
                  rowsPerPageOptions={[5, 10, 20]}
                  columnVisibilityModel={{
                    id: false,
                    fulltext: false,
                  }}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
