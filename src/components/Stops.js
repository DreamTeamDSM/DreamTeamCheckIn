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
import { useAppContext } from '../AppContext';

const CHECKIN = "Check In";
const CHECKOUT = "Check Out";
const COMPLETE = "Complete";

export default function Stops({stops,groups,groupStops}) {

  const data = useAppContext();

  const groupLookup = groups.reduce((acc,cur)=>{
    acc[cur.group_id] = cur.group_name;
    return acc;
  },{});

  console.log("groupStops", groupStops);

  const rows = groupStops.map((cur) =>{
    const group_name = groupLookup[cur.group_id];
    return {...cur,id: cur.stop_id + "_" + cur.group_id,group_name};
  });

  console.log(rows);

  const groupColumns = [
    { field: 'id', headerName: 'Stop Group ID', flex: 1 },
    { field: 'group_name', headerName: 'Description', flex: 1 },
    { field: 'checkin', headerName: 'Check In/Out', flex: 2, renderCell: renderChip },
    { field: 'fulltext', headerName: 'Fulltext', flex: 1 },
  ];

  function checkIn(dispatch, stopId,groupId) {
    dispatch(CHECKOUT);
    data.checkInStop(stopId,groupId);
  }

  function checkOut(dispatch, stopId,groupId) {
    dispatch(COMPLETE);
    data.checkOutStop(stopId,groupId);
  }

  function reset(dispatch, stopId,groupId) {
    dispatch(CHECKIN);
    data.resetCheckInStop(stopId,groupId);
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
            console.log(params.row);
            checkIn(setChipText, params.row.stop_id,params.row.group_id);
          } else if (chipText === CHECKOUT) {
            checkOut(setChipText, params.row.stop_id,params.row.group_id);
          }
          console.log(`Clicked button for row with id: ${params.id}`);
        }}
        onDelete={chipText === CHECKIN ? undefined : () => {
          reset(setChipText, params.row.stop_id,params.row.group_id);
        }}
        deleteIcon={< Replay />}
      />
      // </Chip>
    );
  }



  React.useEffect(()=>{
    setFilterModel({
      items: [
        { field: 'fulltext', operator: 'contains', value: data.searchText.toLowerCase() },
      ]
    })
  },[data.searchText]);

  const [filterModel, setFilterModel] = React.useState({
    items: []
  });

  console.log(stops);
  return (
    <div>
      {stops.map((stop)=>{

        const filteredRows = rows.filter((cur)=>{
          return (stop.stop_id == cur.stop_id && cur.group_name.indexOf("Group") > -1);
        });

        const checkInCount = filteredRows.reduce((acc,cur)=>{
          if (cur.check_in == 0) acc++;
          return acc;
        },0);
        const checkOutCount = filteredRows.reduce((acc,cur)=>{
          if (cur.check_in == 1 && cur.check_out == 0) acc++;
          return acc;
        },0);
        const completeCount = filteredRows.reduce((acc,cur)=>{
          if (cur.check_in == 1 && cur.check_out == 1) acc++;
          return acc;
        },0);

        console.log("filteredRows",filteredRows);

        return (<Accordion key={stop.stop_id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{stop.description}</Typography>
            <Typography style={{marginLeft: "auto"}}>{checkInCount} / {checkOutCount} / {completeCount}</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <div style={{ width: '100%' }}>
                <DataGrid
                  filterModel={filterModel}
                  rows={filteredRows}
                  columns={groupColumns}
                  pageSize={15}
                  rowsPerPageOptions={[5, 10, 20]}
                  columnVisibilityModel={{
                    id: false,
                    fulltext: false,
                  }}
                />
              </div>
          </AccordionDetails>
        </Accordion>);
      })}
    </div>
  );

}