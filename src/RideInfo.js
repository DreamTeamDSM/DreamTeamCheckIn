import React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { MetadataBox } from './MetadataBox.js'


const RideInfo = () => {
    return (
        <>
            <Box display='flex' sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <MetadataBox header={'Today\'s Date'} content={'05/05/2023'} />
                    <MetadataBox header={'Location'} content={'Bike World'} />
                    <MetadataBox header={'# Members'} content={'8'} />
                    <MetadataBox header={'# Riders'} content={'12'} />
                    <MetadataBox header={'Miles'} content={'32'} />
                </Stack>
            </Box>
        </>
    )
}

export { RideInfo }