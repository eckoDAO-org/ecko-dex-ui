import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/globalStyle';
import Router from './router/router';
import NotificationRender from './components/notification/NotificationRender';
import { theme } from './styles/theme';
import { AccountProvider } from './contexts/AccountContext';
import { WalletProvider } from './contexts/WalletContext';
import { PactProvider } from './contexts/PactContext';
import ModalRender from './components/modals/ModalRender';
import RightModalRender from './components/right-modal-notification/RightModalRender';
import { SwapProvider } from './contexts/SwapContext';
import { LiquidityProvider } from './contexts/LiquidityContext';
import { GameEditionProvider } from './contexts/GameEditionContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <GameEditionProvider>
        <NotificationRender>
          <AccountProvider>
            <WalletProvider>
              <PactProvider>
                <SwapProvider>
                  <LiquidityProvider>
                    <RightModalRender>
                      <ModalRender>
                        <Router />
                      </ModalRender>
                    </RightModalRender>
                  </LiquidityProvider>
                </SwapProvider>
              </PactProvider>
            </WalletProvider>
          </AccountProvider>
        </NotificationRender>
      </GameEditionProvider>
    </ThemeProvider>
  );
}

export default App;
