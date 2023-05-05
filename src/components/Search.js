/*
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/*
function DeepChild() {
  return <span>{`spacing ${theme.spacing}`}</span>;
}
*/

/*
const Search = (props) => {
    const theme = useTheme();
    console.log(theme);
    return (
        <TextField style={{backgroundColor: theme.palette.primary.light}} id="outlined-basic" label="Outlined" variant="outlined" />
    );
}
export {Search};
*/

import React, { FunctionComponent, useState } from "react";
import {
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import {makeStyles, createStyles} from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => {
  return createStyles({
    search: {
      margin: "0",
    }
  });
});

const Search = () => {
  const { search } = useStyles();
  const theme = useTheme();

  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  const handleClick = () => {
    // TODO: Clear the search input
    console.log("clicked the clear icon...");
  };

  return (
    <div id="search">
      <FormControl className={search}>
        <TextField
          size="small"
          variant="outlined"
          onChange={handleChange}
          style={{backgroundColor: '#fff'}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                style={{ display: showClearIcon }}
                onClick={handleClick}
              >
                <ClearIcon />
              </InputAdornment>
            )
          }}
        />
      </FormControl>
    </div>
  );
};

export { Search };