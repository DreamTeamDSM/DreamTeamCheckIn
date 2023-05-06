import React from 'react';

import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

import { useAppContext } from '../AppContext';

const ConfigMenu = () => {
    const { importData } = useAppContext()
    const [configAnchorEl, setConfigAnchorEl] = React.useState(null);
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const configOpen = Boolean(configAnchorEl);

    const handleConfigClick = (event) => {
        setConfigAnchorEl(event.currentTarget);
    };

    const handleConfigClose = (event) => {
        const actionId = event.currentTarget.getAttribute('action-id')

        setConfigAnchorEl(null);

        if (actionId === 'import') {
            setDialogOpen(true)
        } else if (actionId === 'export') {
            window.open('https://i.kym-cdn.com/entries/icons/original/000/010/897/imageso.jpg')
        }
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
    };


    return (
        <>
            <Box mr='16px'>
                <Button
                    id='config-button'
                    variant='text'
                    color='white'
                    aria-controls={configOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={configOpen ? 'true' : undefined}
                    onClick={handleConfigClick}
                    endIcon={<ArrowDropDownIcon />}
                >
                    {'Settings'}
                </Button>
                <Menu
                    id="config-menu"
                    anchorEl={configAnchorEl}
                    open={configOpen}
                    onClose={handleConfigClose}
                    MenuListProps={{
                        'aria-labelledby': 'config-button',
                    }}
                >
                    <MenuItem action-id={'import'} onClick={handleConfigClose}>
                        <ListItemIcon>
                            <CloudDownloadIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{'Import'}</ListItemText>
                    </MenuItem>
                    <MenuItem action-id={'export'} onClick={handleConfigClose}>
                        <ListItemIcon>
                            <CloudUploadIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{'Export'}</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
            <Dialog onClose={handleDialogClose} open={isDialogOpen}>
                <DialogTitle>{'Confirm Import'}</DialogTitle>
                <Box mx='24px' my='16px'>
                    <Typography mb={'24px'}>
                        {'When importing from the Google Sheets, all data in this app will be deleted and refreshed with new data from the Google Sheet. Make sure you have exported the data and verify that it has exported successfully'}
                    </Typography>
                    <DialogActions mt='24px'>
                        <Button variant='outline' onClick={handleDialogClose}>
                            {'Cancel'}
                        </Button>
                        <Button variant='contained' onClick={() => {
                            importData()
                            handleDialogClose()
                        }}>
                            {'Import'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}

export { ConfigMenu }