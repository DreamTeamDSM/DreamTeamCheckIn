import React, { useEffect, useState } from "react";

import {
    createDatabase,
    loadDatabase,
    saveDatabase,
    seedDatabase,
    seedDatabase2,
} from "./database.js";

import { importData } from './hooks/import'
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

    const getMostRecent = (fetchedRides) => {
        const today = new Date();

        return fetchedRides.reduce((mostRecent, current) => {
            const currentDate = new Date(current.date);
            if (currentDate <= today && currentDate > new Date(mostRecent.date)) {
                return current;
            } else {
                return mostRecent;
            }
        }, { date: "2000-01-01" }
        );
    }

    const performInitialLoad = async () => {
        try {
            const db = await loadDatabase();
            if (!db) {
                saveDatabase(await createDatabase());
            }

            const loadedRides = await getRides();
            const mostRecentRide = getMostRecent(loadedRides);
            const loadedCurrentRide = await getRideById(mostRecentRide.ride_id);

            setRides(loadedRides);
            setCurrentRide(loadedCurrentRide);
        } catch (err) {
            console.error(err)
            setError(err)
        }
    };

    useEffect(() => performInitialLoad(), []);

    const checkIn = async (userId) => {
        console.log("check in", userId);

        /*
        const list = currentRide?.Riders || [];
        console.log(list);

        const updatedRiders = list.map((rider) => {
            if (rider.id === userId) {
                // do db operation here?
                return { ...rider, check_in: 1 };
            } else {
                return rider;
            }
        });
        currentRide.Riders = updatedRiders;
        setCurrentRide(updatedRiders);
        */
    };

    const checkOut = async () => {
        console.log("check out");
    };

    const changeGroup = async () => {
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
            importData
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => React.useContext(AppContext)