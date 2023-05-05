import React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MetadataBox } from './MetadataBox.js'


const RideInfo = (props) => {
    return (
        <>
            <Typography component="h1" variant="h4" mt={5}
                gutterBottom
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}> {'RIDES'}</Typography>
            <Box border={1} borderRadius={'16px'} padding={2}>
                <Box display="flex"
                    flexWrap="wrap"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <MetadataBox header={'Today\'s Date'} content={'05/05/2023'} />
                    <Divider orientation="vertical" flexItem />
                    <MetadataBox header={'Location'} content={'Bike World'} />
                    <Divider orientation="vertical" flexItem />
                    <MetadataBox header={'# Members'} content={'8'} />
                    <Divider orientation="vertical" flexItem />
                    <MetadataBox header={'# Riders'} content={props.riders} />
                    <Divider orientation="vertical" flexItem />
                    <MetadataBox header={'Miles'} content={'32'} />
                </Box>
            </Box >
        </>
    )
}

export { RideInfo }