/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import { HistoryIcon, UnknownLogo, VerifiedLogo } from '../assets';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import PressButtonToActionLabel from '../components/game-edition-v2/components/PressButtonToActionLabel';
import { FadeIn } from '../components/shared/animations';
import CommonTableGameEdition from '../components/shared/CommonTableGameEdition';
import { NETWORK_TYPE } from '../constants/contextConstants';
import AppLoader from '../components/shared/AppLoader';
import { useAccountContext, useGameEditionContext, useNotificationContext, usePactContext } from '../contexts';
import { humanReadableNumber } from '../utils/reduceBalance';
import useWindowSize from '../hooks/useWindowSize';
import { commonTheme } from '../styles/theme';
import { getSwapEventList } from '../api/estats';
import { genRandomString } from '../utils/string-utils';

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

const LIMIT = 10;

const ERRORS = {
  ENVIRONMENT: 'This Devnet environment does not have a block explorer.',
  WALLET_CONNECTION: 'Connect your wallet to view the swap history',
  NO_ROW_FOUND: 'No swap found',
};

const SwapHistoryContainer = () => {
  const history = useHistory();
  const pact = usePactContext();
  const account = useAccountContext();
  const { gameEditionView, setButtons } = useGameEditionContext();
  const { showNotification, STATUSES } = useNotificationContext();
  const [swapList, setSwapList] = useState([]);
  const [swapListError, setSwapListError] = useState(null);
  const [next, setNext] = useState(null);
  const [page, setPage] = useState(1);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [width] = useWindowSize();

  const showErrorNotification = (error) => {
    showNotification({
      toastId: genRandomString(),
      title: 'Swap History error',
      message: error.message,
      type: STATUSES.ERROR,
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  useEffect(async () => {
    //First estats call to retrieve the 'next' value
    if (!account.account.account) {
      setSwapListError(ERRORS.WALLET_CONNECTION);
      setGlobalLoading(false);
      return;
    }

    if (process.env.REACT_APP_KDA_NETWORK_TYPE === 'development') {
      setSwapListError(ERRORS.ENVIRONMENT);
      setGlobalLoading(false);
      return;
    }

    try {
      let res = await getSwapEventList(account.account.account, LIMIT);
      if (res?.data?.length > 0) {
        setSwapList((prev) => [...prev, ...res?.data]);
        setGlobalLoading(false);
      }

      if (res?.next) {
        setNext(res?.next);
      } else {
        setGlobalLoading(false);
      }
    } catch (error) {
      setGlobalLoading(false);
      setSwapListError(ERRORS.NO_ROW_FOUND);
      showErrorNotification(error);
    }
  }, []);

  useEffect(async () => {
    //continuous estats call until retrieves swap list. Also it triggers when the page increase
    if (!account.account.account) {
      setSwapListError(ERRORS.WALLET_CONNECTION);
      return;
    }

    if (process.env.REACT_APP_KDA_NETWORK_TYPE === 'development') {
      setSwapListError(ERRORS.ENVIRONMENT);
      return;
    }

    if (next) {
      if (swapList.length < LIMIT * page) {
        setLoading(true);
        try {
          let res = await getSwapEventList(account.account.account, LIMIT, next);
          if (res?.data?.length > 0) {
            setSwapList((prev) => [...prev, ...res?.data]);
            setGlobalLoading(false);
          }
          setNext(res?.next);
        } catch (error) {
          setGlobalLoading(false);
          setLoading(false);
          setSwapListError(ERRORS.NO_ROW_FOUND);
          showErrorNotification(error);
        }
      }
      if (swapList.length >= LIMIT * page) {
        setLoading(false);
      }
    } else {
      if (swapList.length === 0 && !globalLoading) {
        setSwapListError(ERRORS.NO_ROW_FOUND);
      }
      setLoading(false);
    }
  }, [next, page]);

  useEffect(() => {
    if (gameEditionView && swapList) {
      setButtons((prev) => ({
        ...prev,
        A: async () => setPage(page + 1),
      }));
    } else {
      setButtons((prev) => ({
        ...prev,
        A: null,
      }));
    }
  }, [gameEditionView, swapList]);

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
                <CryptoContainer style={{ zIndex: 2 }}> {getInfoCoin(item, 3, allTokens)?.icon || <UnknownLogo />}</CryptoContainer>
                <CryptoContainer style={{ marginLeft: -12, zIndex: 1 }}>{getInfoCoin(item, 5, allTokens)?.icon || <UnknownLogo />} </CryptoContainer>
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
          swapList && next && <PressButtonToActionLabel actionLabel="load more" />
        ) : (
          <HistoryIconContainer className="justify-ce align-ce pointer" onClick={() => history.push(ROUTE_INDEX)}>
            <HistoryIcon />
          </HistoryIconContainer>
        )}
      </FlexContainer>
      {!swapListError ? (
        swapList.length > 0 ? (
          gameEditionView ? (
            <CommonTableGameEdition
              id="swap-history-list"
              items={swapList}
              columns={renderColumns(pact.allTokens, pact.allPairs, width)}
              loading={loading}
              onClick={(item) => {
                window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
              }}
            />
          ) : (
            <CommonTable
              items={swapList}
              columns={renderColumns(pact.allTokens, pact.allPairs, width)}
              hasMore={next}
              loading={loading}
              loadMore={async () => {
                setPage(page + 1);
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
        <Label>{swapListError}</Label>
      )}
    </CardContainer>
  );
};

export default SwapHistoryContainer;
