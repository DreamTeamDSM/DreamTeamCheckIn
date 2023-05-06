import React from 'react';

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from '@mui/material/CircularProgress';

import { useAppContext } from '../AppContext';
import { RideInfo } from './RideInfo';

const RidePanel = () => {
    const { loading, error, currentRide } = useAppContext()

    if (loading) {
        return (
            <Box mt={'64px'} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box mt={'64px'} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                <Alert severity="error">{error.message}</Alert>
            </Box>
        )
    }

    if (!currentRide) {
        return (
            <Box mt={'64px'} display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                <Alert severity="info">{`There's no ride information available, click the import button`}</Alert>
            </Box>
        )
    }

    return (
        <RideInfo />
    )
}

export { RidePanel }