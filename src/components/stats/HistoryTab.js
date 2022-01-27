import React, { useContext, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import InfiniteScroll from 'react-infinite-scroller';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import { AccountContext } from '../../contexts/AccountContext';
import GradientBorder from '../../components/shared/GradientBorder';
import { theme } from '../../styles/theme';
import { PartialScrollableScrollSection } from '../layout/Containers';
import HistoryCard from './HistoryCard';
import LogoLoader from '../../components/shared/LogoLoader';
import Label from '../shared/Label';
import useButtonScrollEvent from '../../hooks/useButtonScrollEvent';

export const CardContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  max-width: 1110px;
  margin-left: auto;
  margin-right: auto;

  ${({ gameEditionView, theme: { backgroundContainer } }) => {
    if (gameEditionView) {
      return css`
        background-color: #ffffff0d;
        border: 2px dashed #fff;
        padding: 24px;
        max-height: 50vh;
      `;
    } else {
      return css`
        backdrop-filter: blur(50px);
        background-color: ${backgroundContainer};
        border-radius: 10px;
        padding: 32px;
        position: relative;
        max-height: 500px;
      `;
    }
  }}

  opacity: 1;
  overflow: auto;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: ${({ gameEditionView }) => gameEditionView && `12px`};
    flex-flow: column;
    max-height: ${({ gameEditionView }) => (gameEditionView ? 'unset' : '450px')};
    gap: 0px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel + 1}px`}) {
    max-height: ${({ gameEditionView }) => (gameEditionView ? 'unset' : '400px')};
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    max-height: ${({ gameEditionView }) => gameEditionView && 'unset'};
  }
`;

const HistoryTab = () => {
  const pact = useContext(PactContext);
  const account = useContext(AccountContext);
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);

  useEffect(() => {}, [account.sendRes]);

  useButtonScrollEvent(gameEditionView && 'history-list');
  return (
    <CardContainer gameEditionView={gameEditionView}>
      {!gameEditionView && <GradientBorder />}

      <PartialScrollableScrollSection id="history-list" className="scrollbar-none" style={{ width: '100%' }}>
        {!pact.swapList?.error ? (
          pact.swapList[0] ? (
            <InfiniteScroll
              pageStart={1}
              loadMore={() => {
                pact.getMoreEventsSwapList();
              }}
              hasMore={pact.moreSwap}
              loader={<LogoLoader withTopMargin />}
              useWindow={false}
              initialLoad={false}
            >
              {pact.swapList?.map((tx, index) => (
                <div key={index}>
                  <HistoryCard tx={tx} key={index} />
                  {pact.swapList?.length - 1 !== index && (
                    <Divider
                      style={{
                        width: '100%',
                        margin: gameEditionView ? '24px 0px' : '32px 0px',
                        borderTop: gameEditionView ? `2px dashed #fff` : `1px solid  ${theme(themeMode).colors.white}`,
                      }}
                    />
                  )}
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <LogoLoader />
          )
        ) : (
          <Label gameEditionView={gameEditionView}>{pact.swapList?.error}</Label>
        )}
      </PartialScrollableScrollSection>
    </CardContainer>
  );
};

export default HistoryTab;
