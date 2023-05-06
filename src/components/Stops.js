import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar, Chip
} from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid';
import { Button } from './Button'
import { lighten } from 'polished';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function Stops(props) {

  const groups = [
    { id: 1, checkin: 0, checkout: 0, name: "Group 1", fulltext: "Group 1"},
    { id: 2, checkin: 0, checkout: 0, name: "Group 2", fulltext: "Group 2"},
    { id: 3, checkin: 0, checkout: 0, name: "Group 3", fulltext: "Group 3"},
    { id: 4, checkin: 0, checkout: 0, name: "Group 4", fulltext: "Group 4"},
  ];

  const groupColumns = [
    { field: 'id', headerName: 'Stop Group ID', flex: 1 },
    { field: 'name', headerName: 'Description', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderChip },
    { field: 'fulltext', headerName: 'Fulltext', flex: 1 },
  ];

  const stops = [
    { id: 1002, route_id: 10002, description: "New Bronze at Granite Rock", order: 0 },
    { id: 1003, route_id: 10003, description: "Old Bronze at Soft Rock", order: 1 },
  ];

  const columns = [
    { field: 'id', headerName: 'Stop ID', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderChip },
  ];
    //{ field: 'fulltext', headerName: 'Fulltext', flex: 0 },

  function checkIn(dispatch, id) {
    dispatch(CHECKOUT);
    props.checkIn(id);
  }

  function checkOut(dispatch, id) {
    dispatch(COMPLETE);
    props.checkOut(id);
  }

  function reset(dispatch, id) {
    dispatch(CHECKIN);
    props.reset(id);
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

  function renderChip(params) {
    let defaultState = CHECKIN;
    if (params.row.checkin == 1 && params.row.checkout == 1) {
      defaultState = COMPLETE;
    } else if (params.row.checkin == 1 && params.row.checkout == 0) {
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

  /*
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        filterModel={filterModel}
        rows={stops}
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
  */

  return (
    <div>
      {stops.map((stop)=>{
        return (<Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{stop.description}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  filterModel={filterModel}
                  rows={groups}
                  columns={groupColumns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  columnVisibilityModel={{
                    id: false,
                    fulltext: false,
                  }}
                />
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>);
      })}
    </div>
  );

}