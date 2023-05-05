import React from "react";
import Container from "@mui/material/Container";

import { RideInfo } from "./components/RideInfo";
import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";

import "@fontsource/inter";

function App(props) {
  const db = props.db;

  const increaseRider = () => {
    setRiderCount((riderCount) => riderCount + 1);
  };

  const decreaseRider = () => {
    setRiderCount((riderCount) => riderCount - 1);
  };

  const tempRiders = [
    { id: 1, groupnumber: 1, checkin: 1, checkout: 0, firstname: "Aaron", lastname: "Ayala", ridertype: "New" },
    { id: 2, groupnumber: 1, checkin: 1, checkout: 0, firstname: "Addison", lastname: "Palmer", ridertype: "Veteran" },
    { id: 3, groupnumber: 1, checkin: 0, checkout: 0, firstname: "Alayia", lastname: "White", ridertype: "New" },
    { id: 4, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Billy", lastname: "Jones", ridertype: "New" },
    { id: 5, groupnumber: 2, checkin: 0, checkout: 0, firstname: "Sam", lastname: "Sibley", ridertype: "Veteran" },
  ];

  const sampleRiders = tempRiders.map((cur)=>{
    const fulltext = (cur.groupnumber + " " + cur.firstname + cur.lastname).toLowerCase();
    return {...cur, fulltext};
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
    <ThemeProvider>
      <header>
        <Navigation searchHandler={setSearchText}/>
      </header>
      <Container maxWidth="lg">
        <main>
          <RideInfo
            riders={riders}
            checkIn={checkIn}
            checkOut={checkOut}
            reset={reset}
            riderCount={riderCount}
            searchText={searchText}
          />
        </main>
      </Container>
      <footer>
        <DebugBar />
      </footer>
    </ThemeProvider>
  );
}

export default App;
