import React from 'react';

import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { MetadataBox } from './MetadataBox.js'
import { TabPanel } from './TabPanel.js';
import Riders from './Riders.js';

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MetadataDivider = () => <Divider orientation="vertical" flexItem sx={{ marginTop: '16px', marginBottom: '16px' }} />

const RideInfo = (props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Typography component="h1" variant="h4" mt={5}
                gutterBottom
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}> {'RIDES'}</Typography>
            <Paper border={1} padding={2} elevation={0} variant="outlined">
                <Box display="flex"
                    flexWrap="wrap"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <MetadataBox header={'Ride Date'} content={'05/05/2023'} />
                    <MetadataDivider />
                    <MetadataBox header={'Location'} content={'Bike World'} />
                    <MetadataDivider />
                    <MetadataBox header={'# Mentors'} content={'8'} />
                    <MetadataDivider />
                    <MetadataBox header={'# Riders'} content={props.riderCount} />
                    <MetadataDivider />
                    <MetadataBox header={'Miles'} content={'32'} />
                </Box>
            </Paper >
            <Box sx={{ width: '100%' }} mt={2}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Riders" {...a11yProps(0)} />
                        <Tab label="Mentors" {...a11yProps(1)} />
                        <Tab label="Groups" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Riders checkIn={props.checkIn} checkOut={props.checkOut} riders={props.riders} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
            </Box>
        </>
    )
}

export { RideInfo }