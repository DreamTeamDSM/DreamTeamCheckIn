import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid'
import { useTheme, useMediaQuery } from '@mui/material';

import { TabPanel } from './TabPanel.js';
import Riders from './Riders.js';
import { RideMetadata } from './RideMetadata.js';

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const RideInfo = (props) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

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
            <Grid container spacing={2}>
                <Grid item sm={12} lg={3}>
                    <RideMetadata riderCount={props.riderCount} />
                </Grid>
                <Grid item sm={12} lg={9}>
                    <Box sx={{ width: '100%' }} mt={isLargeScreen ? 0 : 2}>
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
                </Grid>
            </Grid>
        </>
    )
}

export { RideInfo }