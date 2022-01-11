import React, { useContext } from 'react';
import { ThemeProvider } from 'styled-components/macro';
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
import { LightModeContext } from './contexts/LightModeContext';
import { KaddexWalletProvider } from './contexts/KaddexWalletContext';
import NotificationModalRender from './components/right-modal-notification/NotificationModalRender';

function App() {
  const { themeMode } = useContext(LightModeContext);

  return (
    <ThemeProvider theme={theme(themeMode)}>
      <GlobalStyle />
      <GameEditionProvider>
        <NotificationRender>
          <AccountProvider>
            <WalletProvider>
              <PactProvider>
                <KaddexWalletProvider>
                  <SwapProvider>
                    <LiquidityProvider>
                      <NotificationModalRender>
                        <RightModalRender>
                          <ModalRender>
                            <Router />
                          </ModalRender>
                        </RightModalRender>
                      </NotificationModalRender>
                    </LiquidityProvider>
                  </SwapProvider>
                </KaddexWalletProvider>
              </PactProvider>
            </WalletProvider>
          </AccountProvider>
        </NotificationRender>
      </GameEditionProvider>
    </ThemeProvider>
  );
}

export default App;
