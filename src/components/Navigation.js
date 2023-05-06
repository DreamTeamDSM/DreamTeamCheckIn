import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { Search } from "./Search";
import { ImportButton } from './ImportButton';

import Logo from "../assets/logo";
import { useAppContext } from '../AppContext';
import { RidesMenu } from './RidesMenu';

const Navigation = (props) => {
    const { setSearchText } = useAppContext()

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Logo sx={{ fontSize: 60, marginRight: 2 }} />
                    <Box
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <RidesMenu />
                        <Box display={'flex'}>
                            <ImportButton />
                            <Search searchHandler={setSearchText} />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export { Navigation };
