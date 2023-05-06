import React from "react";
import Container from "@mui/material/Container";

import { RideInfo } from "./components/RideInfo";
import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";
import { AppContextProvider } from "./AppContext";
import { RidePanel } from "./components/RidePanel";

import "@fontsource/inter";

function App(props) {
  const db = props.db;

  // TODO
  const setSearchText = () => {}

  const increaseRider = () => {
    setRiderCount((riderCount) => riderCount + 1);
  };

  const decreaseRider = () => {
    setRiderCount((riderCount) => riderCount - 1);
  };

  // const checkIn = (id) => {
  //   const updatedRiders = riders.map((rider) => {
  //     if (rider.id === id) {
  //       // do db operation here?
  //       increaseRider();
  //       return { ...rider, checkin: 1 };
  //     } else {
  //       return rider;
  //     }
  //   });
  //   setRiders(updatedRiders);
  // };

  // const checkOut = (id) => {
  //   const updatedRiders = riders.map((rider) => {
  //     if (rider.id === id) {
  //       // do db operation here?
  //       return { ...rider, checkout: 1 };
  //     } else {
  //       return rider;
  //     }
  //   });
  //   setRiders(updatedRiders);
  // };

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

  // const reset = (id) => {
  //   const updatedRiders = riders.map((rider) => {
  //     if (rider.id === id) {
  //       decreaseRider();
  //       // do db operation here?
  //       return { ...rider, checkin: 0 };
  //     } else {
  //       return rider;
  //     }
  //   });
  //   setRiders(updatedRiders);
  // };

  // const startingCount = riders.reduce((acc, cur) => {
  //   if (cur.checkin) acc++;
  //   return acc;
  // }, 0);

  // const [riderCount, setRiderCount] = React.useState(startingCount);

  return (
    <AppContextProvider>
      <ThemeProvider>
        <header>
          <Navigation
             searchHandler={setSearchText}
              />
        </header>
        <main>
          <RideInfo />
        </main>
        <footer>
          <DebugBar />
        </footer>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
