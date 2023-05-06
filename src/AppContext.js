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

    const getMostRecent = () => {
        const today = new Date();

        return fetchedRides.reduce((mostRecent, current) => {
            const currentDate = new Date(current.date);
            if (currentDate <= today && currentDate > new Date(mostRecent.date)) {
                return current;
            } else {
                return mostRecent;
            }
            }, { date: "2000-01-01" });
    }

    const importFromSeededData = async () => {
        setLoading(true)
        try {
            const db = await createDatabase();

            await seedDatabase2(db);

            await saveDatabase(db);

            const fetchedRides = await getRides();
            const mostRecentRide = getMostRecent();

            console.log(fetchedRides[0]);

            const fetchedCurrentRide = await getRideById(fetchedRides[0].ride_id);

            console.log(fetchedCurrentRide);

            setRides(fetchedRides);
            setCurrentRide(fetchedCurrentRide);
        } catch (err) {
            console.error(err)
            setError(err)
        }

        setLoading(false)
    }

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
            importData: importFromSeededData,
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