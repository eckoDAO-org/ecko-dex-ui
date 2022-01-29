import React, { useContext, useEffect, useState } from 'react';
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
import { ApplicationContext } from './contexts/ApplicationContext';
import { KaddexWalletProvider } from './contexts/KaddexWalletContext';
import NotificationModalRender from './components/right-modal-notification/NotificationModalRender';
import { ImagesProvider, ImagesConsumer } from './contexts/ImagesContext';

function App() {
  const { themeMode } = useContext(ApplicationContext);
  return (
    <ImagesProvider>
      <ImagesConsumer>
        {({ allImagesLoaded }) =>
          !allImagesLoaded ? (
            <div>{allImagesLoaded}</div>
          ) : (
            <ThemeProvider theme={theme(themeMode)}>
              <GlobalStyle themeMode={themeMode} />
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
          )
        }
      </ImagesConsumer>
    </ImagesProvider>
  );
}

export default App;
