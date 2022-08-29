/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ArrowBack } from '../../assets';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS } from '../../router/routes';
import SlippagePopupContent from '../layout/header/SlippagePopupContent';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { FadeIn } from '../shared/animations';
import RewardBooster from './RewardBooster';
import useQueryParams from '../../hooks/useQueryParams';
import DoubleSidedLiquidity from './DoubleSidedLiquidity';
import SingleSidedLiquidity from './SingleSidedLiquidity';
import { getPairList } from '../../api/pact';
import { getGroupedVolume } from '../../api/kaddex-stats';
import { getAllPairValues } from '../../utils/token-utils';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { isValidString } from '../../utils/string-utils';
import { AppLoader } from '../../components/shared/AppLoader';
import { useErrorState } from '../../hooks/useErrorState';
import theme from '../../styles/theme';
import { useLiquidityContext, usePactContext } from '../../contexts';
import { getPairsMultiplier } from '../../api/liquidity-rewards';
import moment from 'moment';

const Container = styled(FadeIn)`
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 550px;
  overflow: visible;

  .arrow-back,
  .arrow-down {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const AddLiquidityContainer = (props) => {
  const history = useHistory();
  const { setWantsKdxRewards } = useLiquidityContext();
  const pact = usePactContext();
  const { pathname } = useLocation();

  const query = useQueryParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useErrorState({ pools: [], volumes: [] });
  const [pair, setPair] = useState({ token0: query?.get('token0'), token1: query.get('token1') });

  const [apr, setApr] = useState(null);

  const calculateApr = async () => {
    let pool = null;
    if (pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED) {
      pool = data.pools.find((p) => p.token0 === pair.token0 || p.token1 === pair.token0);
    } else {
      pool = data.pools.find((p) => (p.token0 === pair.token0 && p.token1 === pair.token1) || (p.token0 === pair.token1 && p.token1 === pair.token0));
    }

    if (pool) {
      const result = await getAllPairValues([pool], data.volumes, pact.allTokens);
      setApr(result[0]?.apr?.value);
    }
  };

  const getCurrentPool = () => {
    let pool = null;
    if (pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED) {
      pool = data.pools.find((p) => p.token0 === pair.token0 || p.token1 === pair.token0);
    } else {
      pool = data.pools.find((p) => (p.token0 === pair.token0 && p.token1 === pair.token1) || (p.token0 === pair.token1 && p.token1 === pair.token0));
    }

    if (pool) {
      return pool;
    }
  };

  const fetchData = async () => {
    const pools = await getPairList(pact.allPairs);
    if (pools.length) {
      const multipliers = await getPairsMultiplier(pools);
      const volumes = await getGroupedVolume(moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate(), 'daily');
      for (const pool of pools) {
        let multiplier = multipliers.find((mult) => mult.pair === pool.name);
        if (multiplier) {
          pool.multiplier = multiplier.multiplier;
        }
      }

      setData({ pools, volumes });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED) {
      if (data?.pools?.length && data?.volumes?.data?.length && isValidString(pair?.token0)) {
        calculateApr();
      }
    } else {
      if (
        data?.pools?.length &&
        data?.volumes?.data?.length &&
        isValidString(pair?.token0) &&
        isValidString(pair.token1) &&
        pair?.token0 !== pair.token1
      ) {
        calculateApr();
      }
    }
  }, [pair, data]);

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <AppLoader className="h-100 w-100 align-ce justify-ce" />
  ) : (
    <Container
      className="column w-100 relative main"
      gap={24}
      mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
    >
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
              history.push(props?.location?.state?.from || ROUTE_LIQUIDITY_TOKENS);
            }}
          />
          <Label fontSize={24} fontFamily="syncopate">
            ADD LIQUIDITY
          </Label>
        </FlexContainer>
        <SlippagePopupContent />
      </FlexContainer>
      {/* REWARDS BOOSTER COMPONENTS */}
      <RewardBooster
        pair={getCurrentPool()}
        apr={apr}
        type={LIQUIDITY_VIEW.ADD_LIQUIDITY}
        handleState={setWantsKdxRewards}
        isBoosted={getCurrentPool() && getCurrentPool().isBoosted}
      />

      <FlexContainer gap={24}>
        <Label
          fontFamily="syncopate"
          withShade={pathname !== ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED}
          onClick={() =>
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${query.get('token0')}`), { from: props?.location?.state?.from })
          }
        >
          SINGLE-SIDED
        </Label>
        <Label
          fontFamily="syncopate"
          withShade={pathname !== ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED}
          onClick={() =>
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${query.get('token0')}`), { from: props?.location?.state?.from })
          }
        >
          DOUBLE-SIDED
        </Label>
      </FlexContainer>

      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED && (
        <SingleSidedLiquidity
          apr={apr}
          pools={data?.pools.filter((p) => p.isBoosted)}
          pair={pair}
          onPairChange={(token0) => {
            setPair({ token0 });
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${token0}`));
          }}
        />
      )}
      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED && (
        <DoubleSidedLiquidity
          pair={{ token0: query.get('token0'), token1: query.get('token1') }}
          onPairChange={(token0, token1) => {
            setPair({ token0, token1 });
            history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED.concat(`?token0=${token0}&token1=${token1}`));
          }}
        />
      )}
    </Container>
  );
};

export default AddLiquidityContainer;
