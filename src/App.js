import React from "react";
import Container from "@mui/material/Container";

import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";
import { AppContextProvider } from "./AppContext";
import { RidePanel } from "./components/RidePanel";
import { NotificationProvider } from "./components/NotificationContext";

import "@fontsource/inter";

function App() {
  return (
    <NotificationProvider>
      <AppContextProvider>
        <ThemeProvider>
          <header>
            <Navigation />
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
    </NotificationProvider>
  );
}

export default App;
