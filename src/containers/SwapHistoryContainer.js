/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import LogoLoader from '../components/shared/Loader';
import Label from '../components/shared/Label';
import CommonTable from '../components/shared/CommonTable';
import reduceToken from '../utils/reduceToken';
import { getInfoCoin } from '../utils/token-utils';
import { ROUTE_INDEX } from '../router/routes';
import { HistoryIcon, VerifiedLogo } from '../assets';
import modalBackground from '../assets/images/game-edition/modal-background.webp';
import PressButtonToActionLabel from '../components/game-edition-v2/components/PressButtonToActionLabel';
import { FadeIn } from '../components/shared/animations';
import CommonTableGameEdition from '../components/shared/CommonTableGameEdition';
import { NETWORK_TYPE } from '../constants/contextConstants';
import AppLoader from '../components/shared/AppLoader';
import { useGameEditionContext, usePactContext } from '../contexts';
import { humanReadableNumber } from '../utils/reduceBalance';
import useWindowSize from '../hooks/useWindowSize';
import { commonTheme } from '../styles/theme';

export const CardContainer = styled(FadeIn)`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  ${({ gameEditionView }) => {
    if (!gameEditionView) {
      return css`
        border-radius: 10px;
        position: relative;
        z-index: 2;
      `;
    } else {
      return css`
        padding: 16px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: ${`url(${modalBackground})`};
      `;
    }
  }}

  overflow: auto;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: ${({ gameEditionView }) => gameEditionView && `12px`};
    flex-flow: column;
    gap: 0px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel + 1}px`}) {
    max-height: ${({ gameEditionView }) => (gameEditionView ? 'unset' : '400px')};
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
    max-height: ${({ gameEditionView }) => gameEditionView && 'unset'};
  }
`;

const HistoryIconContainer = styled(FlexContainer)`
  background-color: ${({ theme: { colors } }) => colors.white};
  width: 32px;
  height: 32px;
  border-radius: 4px;
  svg {
    height: 20px;
    width: 20px;
    path {
      fill: ${({ theme: { colors } }) => colors.primary};
    }
  }
`;

const SwapHistoryContainer = () => {
  const history = useHistory();
  const pact = usePactContext();
  const { gameEditionView, setButtons } = useGameEditionContext();
  const [width] = useWindowSize();

  useEffect(() => {
    pact.getEventsSwapList();
  }, []);

  useEffect(() => {
    if (gameEditionView && pact?.swapList?.[0]) {
      setButtons((prev) => ({
        ...prev,
        A: async () => await pact.getMoreEventsSwapList(),
      }));
    } else {
      setButtons((prev) => ({
        ...prev,
        A: null,
      }));
    }
  }, [gameEditionView, pact.swapList]);

  const renderColumns = (allTokens, allPairs, width) => {
    return [
      {
        name: 'name',
        width: 160,
        render: ({ item }) => {
          let t0 = getInfoCoin(item, 3, allTokens)?.name === 'KDA' ? getInfoCoin(item, 3, allTokens) : getInfoCoin(item, 5, allTokens);
          let t1 = getInfoCoin(item, 5, allTokens)?.name !== 'KDA' ? getInfoCoin(item, 5, allTokens) : getInfoCoin(item, 3, allTokens);
          let pair = `${t0?.code}:${t1?.code}`;
          return (
            <FlexContainer desktopClassName="align-ce" tabletClassName="align-ce" mobileClassName="column align-fs" mobilePixel={769}>
              <div className="flex align-ce">
                {allPairs[pair]?.isVerified ? (
                  <div style={{ marginRight: 16 }}>
                    <VerifiedLogo className="svg-app-color" />
                  </div>
                ) : (
                  <div style={{ width: 32 }} />
                )}
                <CryptoContainer style={{ zIndex: 2 }}> {getInfoCoin(item, 3, allTokens)?.icon}</CryptoContainer>
                <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{getInfoCoin(item, 5, allTokens)?.icon} </CryptoContainer>
              </div>
              <div
                className="align-fs flex"
                style={{
                  marginLeft: width <= commonTheme.mediaQueries.mobilePixel && 32,
                  marginTop: width <= commonTheme.mediaQueries.mobilePixel && 4,
                }}
              >
                {getInfoCoin(item, 3, allTokens)?.name}/{getInfoCoin(item, 5, allTokens)?.name}
              </div>
            </FlexContainer>
          );
        },
        geName: 'Swap pair',
        geRender: ({ item }) => `${getInfoCoin(item, 3, allTokens)?.name}/${getInfoCoin(item, 5, allTokens)?.name}`,
      },
      {
        name: 'date',
        width: 160,
        render: ({ item }) => <FlexContainer>{moment(item?.blockTime).format('DD/MM/YYYY HH:mm:ss')}</FlexContainer>,
      },
      {
        name: 'request key',
        width: 160,
        render: ({ item }) => <FlexContainer>{reduceToken(item?.requestKey)}</FlexContainer>,
      },
      {
        name: 'amount',
        width: 160,
        sortBy: 'amountA',
        align: 'left',
        render: ({ item }) => (
          <FlexContainer>
            {humanReadableNumber(item?.amountA)} {getInfoCoin(item, 3, allTokens)?.name}
          </FlexContainer>
        ),
      },
    ];
  };

  return (
    <CardContainer
      gameEditionView={gameEditionView}
      desktopStyle={{ padding: `32px ${commonTheme.layout.desktopPadding}px` }}
      tabletStyle={{ padding: 32 }}
      mobileStyle={{ padding: '24px 16px 40px' }}
    >
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }} gameEditionStyle={{ marginBottom: 14 }}>
        <Label fontSize={24} geFontSize={32} fontFamily="syncopate">
          {gameEditionView ? 'HISTORY' : 'SWAP'}
        </Label>
        {gameEditionView ? (
          pact.swapList[0] && pact.moreSwap && <PressButtonToActionLabel actionLabel="load more" />
        ) : (
          <HistoryIconContainer className="justify-ce align-ce pointer" onClick={() => history.push(ROUTE_INDEX)}>
            <HistoryIcon />
          </HistoryIconContainer>
        )}
      </FlexContainer>
      {!pact.swapList?.error ? (
        pact.swapList[0] ? (
          gameEditionView ? (
            <CommonTableGameEdition
              id="swap-history-list"
              items={pact.swapList}
              columns={renderColumns(pact.allTokens, pact.allPairs, width)}
              loading={pact.loadingSwap}
              onClick={(item) => {
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
              }}
            />
          ) : (
            <CommonTable
              items={pact.swapList}
              columns={renderColumns(pact.allTokens, pact.allPairs, width)}
              wantPagination
              hasMore={pact.moreSwap}
              loading={pact.loadingSwap}
              loadMore={async () => {
                await pact.getMoreEventsSwapList();
              }}
              onClick={(item) => {
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
              }}
            />
          )
        ) : gameEditionView ? (
          <LogoLoader />
        ) : (
          <AppLoader containerStyle={{ height: '100%', alignItems: 'center' }} />
        )
      ) : (
        <Label>{pact.swapList?.error}</Label>
      )}
    </CardContainer>
  );
};

export default SwapHistoryContainer;
