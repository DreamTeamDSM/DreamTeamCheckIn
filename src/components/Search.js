import React, { FunctionComponent, useState, useEffect } from "react";
import {
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { makeStyles, createStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => {
  return createStyles({
    search: {
      margin: "0",
    }
  });
});

const Search = (props) => {
  const { search } = useStyles();
  const theme = useTheme();

  const [searchText, setSearchText] = useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");

  useEffect(() => {
    props.searchHandler(searchText);
  }, [searchText]);

  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchText(event.target.value);
  };

  const handleClick = (event) => {
    // TODO: Clear the search input
    console.log(event);
    console.log("clicked the clear icon...");
  };

  return (
    <div id="search">
      <FormControl className={search}>
        <TextField
          size="small"
          variant="outlined"
          onChange={handleChange}
          style={{ backgroundColor: '#fff' }}
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