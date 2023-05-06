import React, { useState } from "react";

import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import PeopleIcon from "@mui/icons-material/People";
import Button from "@mui/material/Button";
import { ClickAwayListener } from "@mui/base";

const GroupSelect = ({ groups, userId, groupAssignmentId, defaultGroupId, changeGroup, unassignGroup }) => {
    const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
    React.useEffect(() => {
        setSelectedGroupId(defaultGroupId)
    }, [defaultGroupId])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const popperId = open ? "simple-popper" : undefined;
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const currentGroup = groups.find((group) => group.group_id === selectedGroupId)
    const currentGroupId = currentGroup?.group_id
    const currentGroupLabel = currentGroup?.group_name

    const handleSelectChange = (value) => {
        setSelectedGroupId(value);

        if (value === -1) {
            unassignGroup(groupAssignmentId, value, userId)
        } else {
            changeGroup(userId, value);
        }

        setAnchorEl(null)
    };

    return (
        <div>
            <Button
                aria-describedby={popperId}
                color="primary"
                startIcon={<PeopleIcon />}
                onClick={handleClick}
            >
                {selectedGroupId ? currentGroupLabel : "Unassigned"}
            </Button>
            <Popper id={popperId} open={open} anchorEl={anchorEl}>
                <Paper>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                        <List>
                            {groups.map((group) => (
                                <ListItemButton
                                    selected={group.group_id === currentGroupId}
                                    key={group.group_id}
                                    onClick={() => handleSelectChange(group.group_id)}
                                >
                                    {group.group_name}
                                </ListItemButton>
                            ))}
                            <ListItemButton
                                selected={currentGroupId === null}
                                key={'unassigned-group'}
                                onClick={() => handleSelectChange(-1)}
                            >
                                {'Unassigned'}
                            </ListItemButton>
                        </List>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </div>
    );
};
export { GroupSelect };
