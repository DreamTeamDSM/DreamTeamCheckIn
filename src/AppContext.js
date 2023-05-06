import React, { useEffect, useState } from "react";

import {
    createDatabase,
    loadDatabase,
    saveDatabase,
} from "./database.js";

import { importData } from './hooks/import'
import { getRideById, getRides } from "./hooks/ride";
import { check_in_participant, check_out_participant, reset_participant, check_in_group, check_out_group, reset_group } from "./hooks/check";
import { delete_groupAssignment, updateGroupAssignment } from "./hooks/group.js";

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
        removeFromGroup: () => { },
        refresh: () => { },
        exportLoading: false,
        setExportLoading: () => { },
    }
);

export const AppContextProvider = ({ children }) => {
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [exportLoading, setExportLoading] = useState(false);

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

    const refresh = async () => {
        if (!currentRide?.Ride?.ride_id) {
            console.error('Trying to refresh current ride, even though a current ride is not set. 🤔')

            return;
        }
        const currentRideId = currentRide.Ride.ride_id

        const refreshedRides = await getRides();
        const refreshedCurrentRide = await getRideById(currentRideId);

        setRides(refreshedRides);
        setCurrentRide(refreshedCurrentRide);
    }

    const performInitialLoad = async () => {
        try {
            setLoading(true)
            let db = await loadDatabase();

            if (!db) {
                db = await createDatabase()
                console.log('inital load')
                await saveDatabase(db)
            }

            const loadedRides = await getRides();

            if (loadedRides?.length) {
                const mostRecentRide = getMostRecent(loadedRides);
                const loadedCurrentRide = await getRideById(mostRecentRide.ride_id);

                setRides(loadedRides);
                setCurrentRide(loadedCurrentRide);

                return
            }
        } catch (err) {
            console.error(err)
            setError(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => performInitialLoad(), []);

    // TODO: mentors cant be checked in at the moment
    const checkIn = async (userId, groupId) => {
        await check_in_participant(userId, groupId)
        await refresh()
    };

    const checkOut = async (userId, groupId) => {
        await check_out_participant(userId, groupId)
        await refresh()
    };

    const changeGroup = async (userId, rideId, newGroupId) => {
        await updateGroupAssignment(userId, rideId, newGroupId)
        await refresh()
    }

    const removeFromGroup = async (groupAssignmentId) => {
        await delete_groupAssignment(groupAssignmentId)
        await refresh()
    }

    const resetCheckIn = async (userId, groupId) => {
        await reset_participant(userId, groupId)
        await refresh()
    };

    const checkInStop = async (stopId, groupId) => {
        console.log("check in stop", stopId, groupId)
        await check_in_group(groupId, stopId)
        await refresh()
    };

    const checkOutStop = async (stopId, groupId) => {
        console.log("check out stop", stopId, groupId);
        await check_out_group(groupId, stopId);
        await refresh()
    };

    const resetCheckInStop = async (stopId, groupId) => {
        console.log("reset checkin stop", stopId, groupId);
        await reset_group(groupId, stopId)
        await refresh()
    };

    return (
        <AppContext.Provider value={{
            rides,
            currentRide,
            setRides,
            setCurrentRide,
            loading,
            setLoading,
            exportLoading,
            setExportLoading,
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
            refresh,
            removeFromGroup,
            importData: async () => {
                setLoading(true)
                await importData(async () => {
                    setError(false)
                    await performInitialLoad()
                }, setLoading, setError)
            }
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => React.useContext(AppContext)