/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { PactContext } from '../contexts/PactContext';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import LogoLoader from '../components/shared/Loader';
import Label from '../components/shared/Label';
import CommonTable from '../components/shared/CommonTable';
import reduceToken from '../utils/reduceToken';
import { getInfoCoin } from '../utils/token-utils';
import { ROUTE_INDEX } from '../router/routes';
import { HistoryIcon } from '../assets';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import PressButtonToActionLabel from '../components/game-edition-v2/components/PressButtonToActionLabel';
import { FadeIn } from '../components/shared/animations';
import CommonTableGameEdition from '../components/shared/CommonTableGameEdition';
import { NETWORK_TYPE } from '../constants/contextConstants';
import AppLoader from '../components/shared/AppLoader';

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
        padding: ${({ theme: { layout } }) => `50px ${layout.desktopPadding}px`};
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
  const pact = useContext(PactContext);
  const { gameEditionView, setButtons } = useContext(GameEditionContext);

  useEffect(() => {
    pact.getEventsSwapList();
  }, []);

  const renderColumns = () => {
    return [
      {
        name: 'name',
        width: 160,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            {console.log('item', item)}
            <CryptoContainer style={{ zIndex: 2 }}>{getInfoCoin(item, 3)?.icon} </CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{getInfoCoin(item, 5)?.icon} </CryptoContainer>
            {getInfoCoin(item, 3)?.name}/{getInfoCoin(item, 5)?.name}
          </FlexContainer>
        ),
        geName: 'Swap pair',
        geRender: ({ item }) => `${getInfoCoin(item, 3)?.name}/${getInfoCoin(item, 5)?.name}`,
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
        align: 'right',
        render: ({ item }) => (
          <FlexContainer>
            {item?.params[2]} {getInfoCoin(item, 3)?.name}
          </FlexContainer>
        ),
      },
    ];
  };

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

  return (
    <CardContainer gameEditionView={gameEditionView}>
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
              columns={renderColumns()}
              loading={pact.loadingSwap}
              onClick={(item) => {
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
              }}
            />
          ) : (
            <CommonTable
              items={pact.swapList}
              columns={renderColumns()}
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
