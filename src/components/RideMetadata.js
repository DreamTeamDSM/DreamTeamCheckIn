import React from 'react';

import { useTheme, useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { MetadataBox } from './MetadataBox.js'

const VerticalMetadataDivider = () => <Divider orientation="vertical" flexItem sx={{ marginTop: '16px', marginBottom: '16px' }} />
const HorizontalMetadataDivider = () => <Divider orientation="horizontal" flexItem />

const CompactMetadata = ({ ...props }) => (
    <Box display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        alignItems="center"
    >
        <MetadataBox header={'Ride Date'} content={'05/05/2023'} />
        <VerticalMetadataDivider />
        <MetadataBox header={'Location'} content={'Bike World'} />
        <VerticalMetadataDivider />
        <MetadataBox header={'# Mentors'} content={'8'} />
        <VerticalMetadataDivider />
        <MetadataBox header={'# Riders'} content={props.riderCount} />
        <VerticalMetadataDivider />
        <MetadataBox header={'Miles'} content={'32'} />
    </Box>
)

const FullSizeMetadata = ({ ...props }) => (
    <Box
        display="flex"
        flexWrap="wrap"
        flexDirection='column'
    >
        <MetadataBox header={'Ride Date'} content={'05/05/2023'} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'Location'} content={'Bike World'} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'# Mentors'} content={'8'} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'# Riders'} content={props.riderCount} />
        <HorizontalMetadataDivider />
        <MetadataBox header={'Miles'} content={'32'} />
    </Box>
)

const Paperize = ({ children }) => (
    <Paper border={1} padding={2} elevation={0} variant="outlined">
        {children}
    </Paper >
)

const RideMetadata = ({ ...props }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    if (isLargeScreen) {
        return <Paperize><FullSizeMetadata {...props} /></Paperize>
    }

    return <Paperize><CompactMetadata {...props} /></Paperize>

}

export { RideMetadata }