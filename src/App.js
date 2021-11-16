import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/globalStyle";
import Router from "./router/router";
import NotificationRender from "./components/notification/NotificationRender";
import { theme } from "./styles/theme";
import { AccountProvider } from "./contexts/AccountContext";
import { WalletProvider } from "./contexts/WalletContext";
import { PactProvider } from "./contexts/PactContext";
import ModalRender from "./components/modals/ModalRender";
import { SwapProvider } from "./contexts/SwapContext";
import { LiquidityProvider } from "./contexts/LiquidityContext";
import { KadenaWalletProvider } from "./contexts/KadenaWalletContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NotificationRender>
        <AccountProvider>
          <WalletProvider>
            <PactProvider>
              <KadenaWalletProvider>
                <SwapProvider>
                  <LiquidityProvider>
                    <ModalRender>
                      <Router />
                    </ModalRender>
                  </LiquidityProvider>
                </SwapProvider>
              </KadenaWalletProvider>
            </PactProvider>
          </WalletProvider>
        </AccountProvider>
      </NotificationRender>
    </ThemeProvider>
  );
}

export default App;
