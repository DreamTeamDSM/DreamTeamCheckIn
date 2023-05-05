import React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


const MetadataBox = ({ header, content }) => {
    return (
        <Stack>
            <Typography variant='h5'> {header}</Typography>
            <Typography component="p" > {content}</Typography>
        </Stack>)
}

export { MetadataBox }