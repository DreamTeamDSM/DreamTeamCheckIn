import React, { useState } from "react";

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
        setError: () => { }
    }
);

export const AppContextProvider = ({ children }) => {
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const importFromSeededData = async () => {
        setLoading(true)
        try {
            const db = await createDatabase();

            await seedDatabase(db);

            await saveDatabase(db);

            const fetchedRides = await getRides();

            const fetchedCurrentRide = await getRideById(fetchedRides[0].ride_id);
            setRides(fetchedRides);
            setCurrentRide(fetchedCurrentRide);
        } catch (err) {
            setError(err)
        }

        setLoading(false)
    }

    return (
        <AppContext.Provider value={{
            rides,
            currentRide,
            setRides,
            setCurrentRide,
            importData: importFromSeededData,
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