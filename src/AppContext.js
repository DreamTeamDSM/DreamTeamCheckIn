import React, { useEffect, useState } from "react";

import {
    createDatabase,
    saveDatabase,
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
        setError: () => { }
    }
);

export const AppContextProvider = ({ children }) => {
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const performInitialLoad = async () => {
        try {
            const loadedRides = await getRides();
            const loadedCurrentRide = await getRideById(loadedRides[0].ride_id);

            setRides(loadedRides);
            setCurrentRide(loadedCurrentRide);
        } catch (err) {
            setError(err)
        }
    };

    useEffect(() => performInitialLoad(), []);

    return (
        <AppContext.Provider value={{
            rides,
            currentRide,
            setRides,
            setCurrentRide,
            loading,
            setLoading,
            error,
            setError
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => React.useContext(AppContext)