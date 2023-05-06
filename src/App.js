import React from "react";
import Container from "@mui/material/Container";

import { RideInfo } from "./components/RideInfo";
import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";
import { AppContextProvider } from "./AppContext";
import { RidePanel } from "./components/RidePanel";

import "@fontsource/inter";

function App() {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <header>
          <Navigation
            searchHandler={setSearchText}
          />
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
    </AppContextProvider>
  );
}

export default App;
