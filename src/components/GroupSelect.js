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
            <MenuItem key={group.group_id} value={group.group_id}>{group.group_name}</MenuItem>
        ))}
        </Select>
    </FormControl>
    );
}
export {GroupSelect};