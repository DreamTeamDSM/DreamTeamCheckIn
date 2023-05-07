import React from "react";
import Container from "@mui/material/Container";

import { Navigation } from "./components/Navigation";
import DebugBar from "./components/DebugBar";
import { ThemeProvider } from "./theme";
import { AppContextProvider } from "./AppContext";
import { RidePanel } from "./components/RidePanel";
import { NotificationProvider } from "./components/NotificationContext";

import "@fontsource/inter";
import { Link, Typography } from "@mui/material";

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
            <div className="version-stamp">
              <Typography align="center">
                <Link href="https://github.com/DreamTeamDSM/DreamTeamCheckIn/releases/tag/REPLACE_WITH_RELEASE">vREPLACE_WITH_RELEASE</Link>
              </Typography>
            </div>
            <DebugBar />
          </footer>
        </ThemeProvider>
      </AppContextProvider>
    </NotificationProvider>
  );
}

export default App;
