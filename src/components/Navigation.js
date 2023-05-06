import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { Search } from "./Search";

import Logo from "../assets/logo";
import { useAppContext } from '../AppContext';
import { getRideById } from '../hooks/ride';

const Navigation = (props) => {
    const { currentRide, setCurrentRide, rides, setSearchText } = useAppContext()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const disabled = Boolean(!rides.length)
    const currentRideId = currentRide ? currentRide.Ride.ride_id : undefined

    const handleClose = async (event) => {
        const rideId = event.currentTarget.getAttribute('ride-id')

        setAnchorEl(null);

        if (!rideId) return
        const nextRide = await getRideById(rideId);

        setCurrentRide(nextRide)
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Logo sx={{ fontSize: 60, marginRight: 2 }} />
                    <div>
                        <Button
                            id='rides-button'
                            variant='text'
                            color='white'
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            disabled={disabled}
                            endIcon={<ArrowDropDownIcon />}
                        >
                            {'Rides'}
                        </Button>
                        <Menu
                            id="rides-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'rides-button',
                            }}
                        >
                            {rides.map((ride) => {
                                return (
                                    <MenuItem key={ride.ride_id} selected={currentRideId === ride.ride_id} onClick={handleClose} ride-id={ride.ride_id}>{ride.date}</MenuItem>
                                )
                            })}
                        </Menu>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Search searchHandler={setSearchText} />
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export { Navigation };
