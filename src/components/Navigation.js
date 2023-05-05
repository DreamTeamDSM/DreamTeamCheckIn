import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Logo from '../assets/logo';

const Navigation = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Logo sx={{ fontSize: 60, marginRight: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rides
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export { Navigation }
