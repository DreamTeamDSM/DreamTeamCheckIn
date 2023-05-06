import React, { useState } from "react";

import Container from "@mui/material/Container";

import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";
import { AppContext } from "./AppContext";
import { importData } from "./hooks/import";
import { RidePanel } from "./components/RidePanel";

import {
  createDatabase,
  saveDatabase,
  seedDatabase2,
} from "./database.js";

import "@fontsource/inter";
import { getRideById, getRides } from "./hooks/ride";

function App(props) {
  const db = props.db;

  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const increaseRider = () => {
    setRiderCount((riderCount) => riderCount + 1);
  };

  const decreaseRider = () => {
    setRiderCount((riderCount) => riderCount - 1);
  };

  const importFromSeededData = async () => {
    setLoading(true)
    try {
      const db = await createDatabase();

      await seedDatabase2(db);

      await saveDatabase(db);

      const fetchedRides = await getRides();

      console.log(fetchedRides)
      const fetchedCurrentRide = await getRideById(fetchedRides[0].ride_id);
      setRides(fetchedRides);
      setCurrentRide(fetchedCurrentRide);
    } catch (err) {
      setError(err)
    }

    setLoading(false)
  }

  const importDataSync = async () => {
    await importData();
    const fetchedRides = rides();
    const fetchedCurrentRide = getRideById(fetchedRides[0].id);
    setRides(fetchedRides);
    setCurrentRide(fetchedCurrentRide);
  }

  const tempRiders = [
    { id: 1, groupnumber: 1, checkin: 1, checkout: 0, firstname: "Aaron", lastname: "Ayala", ridertype: "New" },
    { id: 2, groupnumber: 1, checkin: 1, checkout: 0, firstname: "Addison", lastname: "Palmer", ridertype: "Veteran" },
    { id: 3, groupnumber: 1, checkin: 0, checkout: 0, firstname: "Alayia", lastname: "White", ridertype: "New" },
    { id: 4, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Billy", lastname: "Jones", ridertype: "New" },
    { id: 5, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Sam", lastname: "Sibley", ridertype: "Veteran" },
  ];

  // const sampleRiders = [
  //   {
  //     id: 1,
  //     groupnumber: 1,
  //     checkin: 1,
  //     checkout: 0,
  //     firstname: "Aaron",
  //     lastname: "Ayala",
  //     ridertype: "New",
  //   },
  //   {
  //     id: 2,
  //     groupnumber: 1,
  //     checkin: 1,
  //     checkout: 0,
  //     firstname: "Addison",
  //     lastname: "Palmer",
  //     ridertype: "Veteran",
  //   },
  //   {
  //     id: 3,
  //     groupnumber: 1,
  //     checkin: 0,
  //     checkout: 0,
  //     firstname: "Alayia",
  //     lastname: "White",
  //     ridertype: "New",
  //   },
  //   {
  //     id: 4,
  //     groupnumber: 2,
  //     checkin: 0,
  //     checkout: 0,
  //     firstname: "Billy",
  //     lastname: "Jones",
  //     ridertype: "New",
  //   },
  //   {
  //     id: 5,
  //     groupnumber: 2,
  //     checkin: 0,
  //     checkout: 0,
  //     firstname: "Sam",
  //     lastname: "Sibley",
  //     ridertype: "Veteran",
  //   },


  const sampleRiders = tempRiders.map((cur) => {
    const fulltext = (cur.groupnumber + " " + cur.firstname + cur.lastname).toLowerCase();
    return { ...cur, fulltext };
  });

  const mentors = [
    {
      id: 6,
      groupnumber: 1,
      checkin: 0,
      checkout: 0,
      firstname: "Alex",
      lastname: "Erickson",
      ridertype: "Mentor",
    },
    {
      id: 7,
      groupnumber: 2,
      checkin: 0,
      checkout: 0,
      firstname: "Peter",
      lastname: "Parker",
      ridertype: "Mentor",
    },
  ];

  const [riders, setRiders] = React.useState(sampleRiders);
  const [searchText, setSearchText] = React.useState("");

  /*
  React.useEffect(()=>{
    console.log(riders);
  },[riders])
  */

  const checkIn = (id) => {
    const updatedRiders = riders.map((rider) => {
      if (rider.id === id) {
        // do db operation here?
        increaseRider();
        return { ...rider, checkin: 1 };
      } else {
        return rider;
      }
    });
    setRiders(updatedRiders);
  };

  const checkOut = (id) => {
    const updatedRiders = riders.map((rider) => {
      if (rider.id === id) {
        // do db operation here?
        return { ...rider, checkout: 1 };
      } else {
        return rider;
      }
    });
    setRiders(updatedRiders);
  };

  /*
  const searchRiders = (searchInput) => {
    console.log("searchInput",searchInput);

    const temp = riders.filter((cur)=>{
      return (cur.firstname.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
    });

    console.log(temp);
    setRiders(temp);
  }
  */

  const reset = (id) => {
    const updatedRiders = riders.map((rider) => {
      if (rider.id === id) {
        decreaseRider();
        // do db operation here?
        return { ...rider, checkin: 0 };
      } else {
        return rider;
      }
    });
    setRiders(updatedRiders);
  };

  const startingCount = riders.reduce((acc, cur) => {
    if (cur.checkin) acc++;
    return acc;
  }, 0);

  const [riderCount, setRiderCount] = React.useState(startingCount);

  return (
    <AppContext.Provider value={{
      rides: rides,
      currentRide: currentRide,
      setRides: setRides,
      setCurrentRide: setCurrentRide,
      importData: importFromSeededData,
      loading,
      setLoading,
      error,
      setError
    }}>
      <ThemeProvider>
        <header>
          <Navigation searchHandler={setSearchText} />
        </header>
        <main>
          <Container maxWidth="lg">
            <RidePanel />
          </Container>
        </main>
        <footer>
          <DebugBar />
        </footer>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
