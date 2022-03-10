/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import useButtonScrollEvent from '../hooks/useButtonScrollEvent';
import { GameEditionContext } from '../contexts/GameEditionContext';
import { PactContext } from '../contexts/PactContext';
import { FlexContainer } from '../components/shared/FlexContainer';
import LogoLoader from '../components/shared/Loader';
import Label from '../components/shared/Label';
import CommonTable from '../components/shared/CommonTable';
import reduceToken from '../utils/reduceToken';
import { getInfoCoin } from '../utils/token-utils';
import { ROUTE_INDEX } from '../router/routes';
import { HistoryIcon } from '../assets';

export const CardContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        background-color: #ffffff0d;
        border: 2px dashed #fff;
        padding: 24px;
        max-height: 50vh;
      `;
    } else {
      return css`
        border-radius: 10px;
        position: relative;
        height: 100%;
        z-index: 2;
        padding: ${({ theme: { layout } }) => `50px ${layout.desktopPadding}px`};
      `;
    }
  }}

  opacity: 1;
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

const CryptoContainer = styled.div`
  img {
    width: 32px !important;
    height: 32px !important;
  }
`;

const SwapHistoryContainer = () => {
  const history = useHistory();
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);

  useEffect(() => {
    pact.getEventsSwapList();
  }, []);

  useButtonScrollEvent(gameEditionView && 'history-list');

  const renderColumns = () => {
    return [
      {
        name: 'name',
        width: 160,
        render: ({ item }) => (
          <FlexContainer className="align-ce">
            <CryptoContainer style={{ zIndex: 2 }}>{getInfoCoin(item, 3)?.icon} </CryptoContainer>
            <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{getInfoCoin(item, 5)?.icon} </CryptoContainer>
            {getInfoCoin(item, 3)?.name}/{getInfoCoin(item, 5)?.name}
          </FlexContainer>
        ),
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

  return (
    <CardContainer gameEditionView={gameEditionView}>
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }}>
        <Label fontSize={24} fontFamily="syncopate">
          Swap
        </Label>
        <HistoryIconContainer className="justify-ce align-ce pointer" onClick={() => history.push(ROUTE_INDEX)}>
          <HistoryIcon />
        </HistoryIconContainer>
      </FlexContainer>
      {!pact.swapList?.error ? (
        pact.swapList[0] ? (
          <CommonTable
            items={pact.swapList}
            columns={renderColumns()}
            hasMore={pact.moreSwap}
            loading={pact.loadingSwap}
            loadMore={async () => {
              await pact.getMoreEventsSwapList();
            }}
          />
        ) : (
          <LogoLoader />
        )
      ) : (
        <Label gameEditionView={gameEditionView}>{pact.swapList?.error}</Label>
      )}
    </CardContainer>
  );
};

export default SwapHistoryContainer;
