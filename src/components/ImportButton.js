import React from 'react';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

import { useAppContext } from '../AppContext';

const ImportButton = () => {
    const { importData, isSynced, syncString } = useAppContext()
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const handleDialogClose = () => {
        setDialogOpen(false)
    };

    const handleImportClick = () => {
        setDialogOpen(true)
    }

    return (
        <>
            <Box mr='16px'>
                <Button
                    variant='text'
                    color='white'
                    onClick={handleImportClick}
                    startIcon={<CloudDownloadIcon />}
                >
                    {'Import'}
                </Button>
            </Box>
            <Dialog onClose={handleDialogClose} open={isDialogOpen}>
                <DialogTitle>{'Confirm Import'}</DialogTitle>
                <Box mx='24px' my='16px'>
                    <Typography mb={'24px'}>
                        {'When importing from the Google Sheets, all data in this app will be deleted and refreshed with new data from the Google Sheet. Make sure you have exported the data and verify that it has exported successfully'}
                    </Typography>
                    <Typography>{!isSynced ? syncString : ''}</Typography>
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

export { ImportButton }