import React, { useEffect, useState } from "react";

import {
    createDatabase,
    saveDatabase,
    seedDatabase,
    seedDatabase2,
} from "./database.js";

import { getRideById, getRides } from "./hooks/ride";

const AppContext = React.createContext(
    {
        rides: [],
        currentRide: null,
        setCurrentRide: () => { },
        setRides: () => { },
        importData: () => { },
        setLoading: () => { },
        loading: false,
        error: false,
        setError: () => { },
        setSearchText: () => { },
        searchText: "",
        checkIn: () => { },
        checkOut: () => { },
        changeGroup: () => { },
    }
);

export const AppContextProvider = ({ children }) => {
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchText, setSearchText] = useState("");

    const performInitialLoad = async () => {
        try {
            const loadedRides = await getRides();
            const loadedCurrentRide = await getRideById(loadedRides[0].ride_id);

            setRides(loadedRides);
            setCurrentRide(loadedCurrentRide);
        } catch (err) {
            console.error(err)
            setError(err)
        }
    };

    useEffect(() => performInitialLoad(), []);

    const checkIn = async () => {
        console.log("check in");
    };

    const checkOut = async() => {
        console.log("check out");
    };

    const changeGroup = async() => {
        console.log("change group");
    }

    return (
        <AppContext.Provider value={{
            rides,
            currentRide,
            setRides,
            setCurrentRide,
            loading,
            setLoading,
            error,
            setError,
            setSearchText,
            searchText,
            checkIn,
            checkOut,
            changeGroup,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => React.useContext(AppContext)