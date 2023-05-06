import { Alert, Box, Snackbar } from "@mui/material";
import React from "react";
import { v4 as uuid } from "uuid";

const NotificationContext = React.createContext({
    pushNotification: () => { },
    removeNotification: (id) => { },
    notifications: [],
});

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = React.useState([]);

    const pushNotification = React.useCallback((message, type) => {
        const id = uuid();

        const newNotif = { message, type, id }

        setNotifications((previous) => [newNotif, ...previous])
    }, [notifications, setNotifications]);

    const removeNotification = (id) => {
        const removed = notifications.filter(
            (notification) => notification.id !== id
        );

        setNotifications(removed);
    };

    const shouldDisplayNotification = Boolean(notifications.length);

    return (
        <NotificationContext.Provider
            value={{
                pushNotification,
            }}
        >
            {children}
            <Snackbar open={shouldDisplayNotification}>
                <Box>
                    {notifications.map(({ id, type, message }) => {
                        const closeAlert = () => removeNotification(id);

                        return (
                            <Box mb={1}>
                                <Alert key={id} onClose={closeAlert} severity={type} sx={{ width: "100%" }}>
                                    {message}
                                </Alert>
                            </Box>
                        );
                    })}
                </Box>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () =>
    React.useContext(NotificationContext);
