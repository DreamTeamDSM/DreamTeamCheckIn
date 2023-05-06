import React, { useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';

const GroupSelect = ({groups, userId, defaultGroupId, changeGroup}) => {

    const [selectedOption, setSelectedOption] = useState(defaultGroupId);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        changeGroup(userId,event.target.value);
    };

    return (
    <FormControl>
        <InputLabel id="group-select-label">Group</InputLabel>
        <Select
        labelId="group-select-label"
        id="group-select"
        value={selectedOption}
        onChange={handleSelectChange}
        >
        {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
        ))}
        </Select>
    </FormControl>
    );
}
export {GroupSelect};