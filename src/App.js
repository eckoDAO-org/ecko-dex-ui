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
import { SwapProvider } from './contexts/SwapContext';
import { LiquidityProvider } from './contexts/LiquidityContext';
import { GameEditionProvider } from './contexts/GameEditionContext';
import { ApplicationContext } from './contexts/ApplicationContext';
import { KaddexWalletProvider } from './contexts/KaddexWalletContext';
import RightModalRender from './components/modals/RightModalRender';
import gameEditionBackground from './assets/images/game-edition/game-edition-background.png';
import useLazyImage from './hooks/useLazyImage';
import AppLoader from './components/shared/AppLoader';

function App() {
  const { themeMode } = useContext(ApplicationContext);
  const [loaded] = useLazyImage([gameEditionBackground]);
  return (
    <ThemeProvider theme={theme(themeMode)}>
      {!loaded ? (
        <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      ) : (
        <>
          <GlobalStyle themeMode={themeMode} />
          <GameEditionProvider>
            <AccountProvider>
              <NotificationRender>
                <WalletProvider>
                  <PactProvider>
                    <KaddexWalletProvider>
                      <SwapProvider>
                        <LiquidityProvider>
                          <RightModalRender>
                            <ModalRender>
                              <Router />
                            </ModalRender>
                          </RightModalRender>
                        </LiquidityProvider>
                      </SwapProvider>
                    </KaddexWalletProvider>
                  </PactProvider>
                </WalletProvider>
              </NotificationRender>
            </AccountProvider>
          </GameEditionProvider>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
