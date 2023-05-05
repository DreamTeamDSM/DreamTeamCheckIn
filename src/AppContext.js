import React from "react";

export const AppContext = React.createContext(
    {
        rides: [],
        currentRide: [],
        setCurrentRide: ()=>{},
        setRides: ()=>{},
    }
);