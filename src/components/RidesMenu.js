import React from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';

import { getRideById } from '../hooks/ride';
import { useAppContext } from '../AppContext';

const RidesMenu = () => {
    const { currentRide, setCurrentRide, rides } = useAppContext()
    const [rideAnchorEl, setRideAnchorEl] = React.useState(null);
    const rideOpen = Boolean(rideAnchorEl);
    const handleRideClick = (event) => {
        setRideAnchorEl(event.currentTarget);
    };
    const disabled = Boolean(!rides.length)
    const currentRideId = currentRide ? currentRide.Ride.ride_id : undefined

    const handleRideClose = async (event) => {
        const rideId = event.currentTarget.getAttribute('ride-id')

        setRideAnchorEl(null);

        if (!rideId) return
        const nextRide = await getRideById(rideId);

        setCurrentRide(nextRide)
    };

    return (
        <Box>
            <Button
                id='rides-button'
                variant='text'
                color='white'
                aria-controls={rideOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={rideOpen ? 'true' : undefined}
                onClick={handleRideClick}
                disabled={disabled}
                endIcon={<ArrowDropDownIcon />}
            >
                {'Rides'}
            </Button>
            <Menu
                id="rides-menu"
                anchorEl={rideAnchorEl}
                open={rideOpen}
                onClose={handleRideClose}
                MenuListProps={{
                    'aria-labelledby': 'rides-button',
                }}
            >
                {rides.map((ride) => {
                    return (
                        <MenuItem key={ride.ride_id} selected={currentRideId === ride.ride_id} onClick={handleRideClose} ride-id={ride.ride_id}>{ride.date}</MenuItem>
                    )
                })}
            </Menu>
        </Box>
    )
}

export { RidesMenu }