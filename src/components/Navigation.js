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
const Navigation = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        console.log('selected', event.currentTarget.getAttribute('ride-id'))

        setAnchorEl(null);
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
                            <MenuItem onClick={handleClose} ride-id='ride-id-something-or-other'>{'5/6/23 Cumming to Walnut Ridge'}</MenuItem>
                        </Menu>
                    </div>
                    <Search searchHandler={props.searchHandler} />

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export { Navigation };
