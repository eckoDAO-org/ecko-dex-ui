import React, { useContext, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import InfiniteScroll from 'react-infinite-scroller';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { LightModeContext } from '../../contexts/LightModeContext';
import { PactContext } from '../../contexts/PactContext';
import GradientBorder from '../../components/shared/GradientBorder';
import { theme } from '../../styles/theme';
import { PartialScrollableScrollSection } from '../layout/Containers';
import HistoryCard from './HistoryCard';
import { AccountContext } from '../../contexts/AccountContext';
import LogoLoader from '../../components/shared/LogoLoader';
import Label from '../shared/Label';

export const CardContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${({ gameEditionView }) => (gameEditionView ? `24px ` : `32px `)};
  width: 100%;
  max-width: 1110px;
  max-height: ${({ gameEditionView }) => (gameEditionView ? `50vh` : `500px`)};
  margin-left: auto;
  margin-right: auto;
  border-radius: ${({ gameEditionView }) => !gameEditionView && `10px`};
  border: ${({ gameEditionView, theme: { colors } }) => gameEditionView && `2px dashed ${colors.white}`};

  opacity: 1;
  background: ${({ gameEditionView, theme: { backgroundContainer } }) => (gameEditionView ? `transparent` : backgroundContainer)};
  backdrop-filter: ${({ gameEditionView }) => !gameEditionView && `blur(50px)`};
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

  return (
    <CardContainer gameEditionView={gameEditionView}>
      {!gameEditionView && <GradientBorder />}

      <PartialScrollableScrollSection className="scrollbar-none" style={{ width: '100%' }}>
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
                        borderTop: gameEditionView ? `2px dashed ${theme(themeMode).colors.white}` : `1px solid  ${theme(themeMode).colors.white}`,
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
