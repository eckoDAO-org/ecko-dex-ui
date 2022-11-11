import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components/macro';
import GlobalStyle from './styles/globalStyle';
import Router from './router/router';
import { theme } from './styles/theme';
import NotificationRender from './components/notification/NotificationRender';
import ModalRender from './components/modals/ModalRender';
import { LiquidityProvider } from './contexts/LiquidityContext';
import { GameEditionProvider } from './contexts/GameEditionContext';
import { KaddexWalletProvider } from './contexts/KaddexWalletContext';
import { WalletConnectProvider } from './contexts/WalletConnectContext';
import RightModalRender from './components/modals/RightModalRender';
import gameEditionBackground from './assets/images/game-edition/game-edition-background.webp';
import useLazyImage from './hooks/useLazyImage';
import AppLoader from './components/shared/AppLoader';
import { useApplicationContext } from './contexts';
import MaintenanceContainer from './containers/MaintenanceContainer';
import { lazily } from 'react-lazily';

const { AccountProvider } = lazily(() => import(/* webpackChunkName: "accountContext" */ './contexts/AccountContext'));
const { PactProvider } = lazily(() => import(/* webpackChunkName: "PactContext" */ './contexts/PactContext'));
const { WalletProvider } = lazily(() => import(/* webpackChunkName: "WalletContext" */ './contexts/WalletContext'));
const { SwapProvider } = lazily(() => import(/* webpackChunkName: "SwapContext" */ './contexts/SwapContext'));

function App() {
  const { themeMode } = useApplicationContext();
  const [loaded] = useLazyImage([gameEditionBackground]);
  return (
    <ThemeProvider theme={theme(themeMode)}>
      {process.env.REACT_APP_MAINTENANCE_PAGE === 'true' ? (
        <MaintenanceContainer />
      ) : !loaded ? (
        <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      ) : (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <GlobalStyle themeMode={themeMode} />
            <GameEditionProvider>
              <AccountProvider>
                <NotificationRender>
                  <WalletProvider>
                    <PactProvider>
                      <KaddexWalletProvider>
                        <WalletConnectProvider>
                          <SwapProvider>
                            <LiquidityProvider>
                              <RightModalRender>
                                <ModalRender>
                                  <Router />
                                </ModalRender>
                              </RightModalRender>
                            </LiquidityProvider>
                          </SwapProvider>
                        </WalletConnectProvider>
                      </KaddexWalletProvider>
                    </PactProvider>
                  </WalletProvider>
                </NotificationRender>
              </AccountProvider>
            </GameEditionProvider>
          </Suspense>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
