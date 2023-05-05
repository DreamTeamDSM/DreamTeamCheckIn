import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/*
function DeepChild() {
  return <span>{`spacing ${theme.spacing}`}</span>;
}
*/


const Search = (props) => {
    const theme = useTheme();
    console.log(theme);
    return (
        <TextField style={{backgroundColor: theme.palette.primary.light}} id="outlined-basic" label="Outlined" variant="outlined" />
    );
}

export {Search};