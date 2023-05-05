import React from "react";

export const AppContext = React.createContext(
    {
        rides: [],
        currentRide: null,
        setCurrentRide: () => { },
        setRides: () => { },
        importData: () => { }
    }
);

export const useAppContext = () => React.useContext(AppContext)