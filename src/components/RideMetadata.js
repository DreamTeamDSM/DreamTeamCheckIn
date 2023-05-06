import React from 'react';

import { useTheme, useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns'

import { MetadataBox } from './MetadataBox.js'
import { useAppContext } from '../AppContext.js';

const VerticalMetadataDivider = () => <Divider orientation="vertical" flexItem sx={{ marginTop: '16px', marginBottom: '16px' }} />
const HorizontalMetadataDivider = () => <Divider orientation="horizontal" flexItem />

const CompactMetadata = ({ ride, riderCheckInCount, mentorCheckInCount }) => (
    <Box display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        alignItems="center"
    >
        <MetadataBox header={'Ride Date'} content={format(new Date(ride.Date), 'PPPP')} />
        <VerticalMetadataDivider />
        <MetadataBox header={'Location'} content={ride.Destination} />
        <VerticalMetadataDivider />
        <MetadataBox header={'# Mentors'} content={mentorCheckInCount} />
        <VerticalMetadataDivider />
        <MetadataBox header={'# Riders'} content={riderCheckInCount} />
        <VerticalMetadataDivider />
        <MetadataBox header={'Miles'} content={ride.Miles} />
    </Box>
)

const FullSizeMetadata = ({ ride, riderCheckInCount, mentorCheckInCount }) => (
    <Box
        display="flex"
        flexWrap="wrap"
        flexDirection='column'
    >
        <MetadataBox header={'Ride Date'} content={format(new Date(ride.Date), 'PPPP')} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'Location'} content={ride.Destination} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'# Mentors'} content={mentorCheckInCount} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'# Riders'} content={riderCheckInCount} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'Miles'} content={ride.Miles} />
    </Box>
)

const Paperize = ({ children }) => (
    <Paper border={1} padding={2} elevation={0} variant="outlined">
        {children}
    </Paper >
)

const RideMetadata = ({ ...props }) => {
    const { currentRide } = useAppContext()

    const riderCheckInCount = (currentRide?.Riders || []).reduce((acc,cur)=>{
        if (cur.check_in == 1) acc++;
        return acc;
    },0)

    const mentorCheckInCount = (currentRide?.Mentors || []).reduce((acc,cur)=>{
        if (cur.check_in == 1) acc++;
        return acc;
    },0)

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    if (isLargeScreen) {
        return <Paperize><FullSizeMetadata ride={currentRide} riderCheckInCount={riderCheckInCount} mentorCheckInCount={mentorCheckInCount} {...props} /></Paperize>
    }

    return <Paperize><CompactMetadata ride={currentRide} riderCheckInCount={riderCheckInCount} mentorCheckInCount={mentorCheckInCount} {...props} /></Paperize>

}

export { RideMetadata }