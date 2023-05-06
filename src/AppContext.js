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

    const importFromSeededData = async () => {
        setLoading(true)
        try {
            const db = await createDatabase();

            await seedDatabase2(db);

            await saveDatabase(db);

            const fetchedRides = await getRides();

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

    const checkIn = async (userId) => {
        console.log("check in",userId);

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