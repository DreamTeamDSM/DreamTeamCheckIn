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
import { check_in_participant } from "./hooks/check";

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
        checkInStop: () => { },
        checkOutStop: () => { },
        resetCheckIn: () => { },
        resetCheckInStop: () => { },
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
            setLoading(true)
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
        } finally {
            setLoading(false)
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

    const resetCheckIn = async(userId) => {
        console.log("reset checkin",userId);
    };

    const checkInStop = async(stopId,groupId) => {
        console.log("check in stop",stopId,groupId);
    };

    const checkOutStop = async(stopId,groupId) => {
        console.log("check out stop",stopId,groupId);
    };

    const resetCheckInStop = async(stopId,groupId) => {
        console.log("reset checkin stop", stopId, groupId);
    };

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
            checkInStop,
            checkOutStop,
            resetCheckIn,
            resetCheckInStop,
            importData: async () => {
                setLoading(true)
                await importData()
                setLoading(false)
            }
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => React.useContext(AppContext)