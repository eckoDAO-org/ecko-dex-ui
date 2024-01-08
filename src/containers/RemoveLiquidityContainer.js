/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAccountContext, useLiquidityContext, usePactContext } from '../contexts';
import RemoveDoubleSideLiquidity from '../components/liquidity/RemoveDoubleSideLiquidity';
import SlippagePopupContent from '../components/layout/header/SlippagePopupContent';
import { FadeIn } from '../components/shared/animations';
import { FlexContainer } from '../components/shared/FlexContainer';
import { ArrowBack } from '../assets';
import Label from '../components/shared/Label';
import RewardBooster from '../components/liquidity/RewardBooster';
import {
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED,
} from '../router/routes';
import { getPairList, getPairListAccountBalance } from '../api/pact';
import useQueryParams from '../hooks/useQueryParams';
import AppLoader from '../components/shared/AppLoader';
import { LIQUIDITY_VIEW } from '../constants/liquidityView';
import { getAllPairsData } from '../utils/token-utils';
import theme from '../styles/theme';
import RemoveSingleSideLiquidity from '../components/liquidity/RemoveSingleSideLiquidity';

const Container = styled(FadeIn)`
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 550px;
  overflow: visible;

  .arrow-back {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const RemoveLiquidityContainer = (props) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const query = useQueryParams();
  const liquidity = useLiquidityContext();
  const { account } = useAccountContext();
  const { tokensUsdPrice, allTokens, allPairs } = usePactContext();

  const [loading, setLoading] = useState(false);
  const [pair, setPair] = useState(null);
  const [apr, setApr] = useState(null);
  const [previewObject, setPreviewObject] = useState(null);
  const [previewAmount, setPreviewAmount] = useState(1);

  const calculateApr = async (resultPairList, currentPair, pairs) => {
    const allPairsData = await getAllPairsData(tokensUsdPrice, allTokens, allPairs, pairs);
    const pool = resultPairList.find(
      (p) =>
        (p.token0 === currentPair.token0 && p.token1 === currentPair.token1) || (p.token0 === currentPair.token1 && p.token1 === currentPair.token0)
    );
    if (pool) {
      let apr = allPairsData.find((p) => p.name === pool.name)?.apr || 0;
      setApr(apr);
    }
  };

  const fetchData = async () => {
    if (allPairs) {
      const token0 = query.get('token0');
      const token1 = query.get('token1');
      const pairs = await getPairList(allPairs);

      const resultPairList = await getPairListAccountBalance(
        account.account,
        pairs.filter((x) => x.reserves[0] !== 0)
      );
      if (resultPairList.length) {
        const currentPair = resultPairList.find((p) => p.token0 === token0 && p.token1 === token1);
        setPair(currentPair);
        if (currentPair) {
          await calculateApr(resultPairList, currentPair, pairs);
          if (currentPair?.isBoosted) {
            await removePreview(currentPair);
          }
        }
      }
    }
    setLoading(false);
  };

  /* useInterval(async () => {
    if (pair) {
      await removePreview(pair);
    }
  }, 60000); */

  const removePreview = async (currentPair) => {
    const res = await liquidity.removeLiquidityPreview(allTokens[currentPair?.token0].code, allTokens[currentPair?.token1].code, previewAmount);
    if (!res.errorMessage) {
      setPreviewObject(res);
    }
  };

  useEffect(() => {
    if (account.account) {
      setLoading(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, [account, allPairs]);

  useEffect(() => {
    if (pathname && pair) {
      if (pathname === ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED && pair.notAllowedRemoveSingleSide) {
        history.push(ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${query.get('token0')}&token1=${query.get('token1')}`), {
          from: props?.location?.state?.from,
        });
      }
    }
  }, [pair, pathname]);

  return loading ? (
    <AppLoader className="h-100 w-100 justify-ce align-ce" />
  ) : (
    <Container
      className="column w-100 relative justify-ce main"
      gap={24}
      mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
    >
      {!pair ? (
        <Label>no pair</Label>
      ) : (
        <>
          <FlexContainer className="w-100 justify-sb">
            <FlexContainer>
              <ArrowBack
                className="arrow-back"
                style={{
                  cursor: 'pointer',

                  marginRight: '15px',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  history.push(ROUTE_LIQUIDITY_MY_LIQUIDITY);
                }}
              />
              <Label fontSize={24} fontFamily="syncopate">
                REMOVE LIQUIDITY
              </Label>
            </FlexContainer>
            <SlippagePopupContent />
          </FlexContainer>
          <RewardBooster
            isBoosted={pair.isBoosted}
            apr={apr}
            type={LIQUIDITY_VIEW.REMOVE_LIQUIDITY}
            handleState={liquidity.setWantsKdxRewards}
            previewObject={previewObject}
            pair={pair}
          />
          <FlexContainer gap={24}>
            {!pair.notAllowedRemoveSingleSide && (
              <Label
                fontFamily="syncopate"
                withShade={pathname !== ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED}
                onClick={() =>
                  history.push(ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${query.get('token0')}&token1=${query.get('token1')}`), {
                    from: props?.location?.state?.from,
                  })
                }
              >
                SINGLE-SIDED
              </Label>
            )}
            <Label
              fontFamily="syncopate"
              withShade={pathname !== ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED}
              onClick={() =>
                history.push(ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${query.get('token0')}&token1=${query.get('token1')}`), {
                  from: props?.location?.state?.from,
                })
              }
            >
              DOUBLE-SIDED
            </Label>
          </FlexContainer>
          {pathname === ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_SINGLE_SIDED && (
            <RemoveSingleSideLiquidity pair={pair} previewObject={previewObject} previewAmount={previewAmount} setPreviewAmount={setPreviewAmount} />
          )}
          {pathname === ROUTE_LIQUIDITY_REMOVE_LIQUIDITY_DOUBLE_SIDED && (
            <RemoveDoubleSideLiquidity pair={pair} previewObject={previewObject} previewAmount={previewAmount} setPreviewAmount={setPreviewAmount} />
          )}
        </>
      )}
    </Container>
  );
};

export default RemoveLiquidityContainer;
