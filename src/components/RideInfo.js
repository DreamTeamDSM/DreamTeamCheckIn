import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid'
import { useTheme, useMediaQuery, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CircularProgress from '@mui/material/CircularProgress';


import { TabPanel } from './TabPanel.js';
import CheckInList from './CheckInList.js';
import Stops from './Stops.js';
import { RideMetadata } from './RideMetadata.js';
import { useAppContext } from '../AppContext.js';
import { export_data } from '../hooks/export.js';

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const RideInfo = () => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const [value, setValue] = React.useState(0);
    const [isSynced, setIsSynced] = React.useState(false);
    const [isSyncedText, setIsSyncedText] = React.useState('Export');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const data = useAppContext();

    useEffect(() => {
        setIsSyncedText(!data?.currentRide?.IsSynced ? 'Export' : 'Synced')
        setIsSynced(data.currentRide.IsSynced)
    }, [data.currentRide.IsSynced])

    const handleExport = () => {
        console.log(data.setExportLoading);
        export_data(data.currentRide.Ride.ride_id, data.refresh, data.setExportLoading);
    }

    console.log(data.currentRide.isSynced);

    return (
        <>
            <Box display={'flex'} justifyItems={'space-between'} mt={5} mb={'12px'}>
                <Typography component="h1" variant="h4"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}> {'RIDES'}</Typography>
                  <Button color={isSynced ? "lightBlue" : "green"} variant='outlined' startIcon={data.isExportLoading ? <CircularProgress/> : (isSynced ? <CloudDoneIcon/> : <CloudUploadIcon />)} onClick={handleExport}>{isSyncedText}</Button>

            </Box>

            <Grid container spacing={2}>
                <Grid item sm={12} lg={3}>
                    <RideMetadata />
                </Grid>
                <Grid item sm={12} lg={9}>
                    <Box sx={{ width: '100%' }} mt={isLargeScreen ? 0 : 2}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Riders" {...a11yProps(0)} />
                            <Tab label="Mentors" {...a11yProps(1)} />
                            <Tab label="Stops" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <CheckInList users={data?.currentRide?.Riders || []} groups={data?.currentRide?.Groups || []} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <CheckInList users={data?.currentRide?.Mentors || []} groups={data?.currentRide?.Groups || []} oneStepCheckIn />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Stops stops={data?.currentRide?.Stops || []} groupStops={data?.currentRide?.GroupStops || []} groups={data?.currentRide?.Groups || []} />
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid >
        </>
    )
}

export { RideInfo }