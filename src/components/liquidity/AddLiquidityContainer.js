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
import { getPairList } from '../../api/pact-pair';
import { getDailyVolume } from '../../api/kaddex-stats';
import { getAllPairValues } from '../../utils/token-utils';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { isValidString } from '../../utils/string-utils';
import { AppLoader } from '../../components/shared/AppLoader';
import { useErrorState } from '../../hooks/useErrorState';

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

const AddLiquidityContainer = (props) => {
  const history = useHistory();

  const { pathname } = useLocation();

  const query = useQueryParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useErrorState({ pools: [], volumes: [] });
  const [pair, setPair] = useState({ token0: query?.get('token0'), token1: query.get('token1') });

  const [apr, setApr] = useState(null);

  const calculateApr = async () => {
    const pool = data.pools.find(
      (p) => (p.token0 === pair.token0 && p.token1 === pair.token1) || (p.token0 === pair.token1 && p.token1 === pair.token0)
    );
    const result = await getAllPairValues([pool], data.volumes);
    setApr(result[0]?.apr?.value);
  };

  const fetchData = async () => {
    const pools = await getPairList();
    if (pools.length) {
      console.log('in1');
      const volumes = await getDailyVolume();

      setData({ pools, volumes });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (data?.pools?.length && data?.volumes?.length && isValidString(pair?.token0) && isValidString(pair.token1) && pair?.token0 !== pair.token1) {
      calculateApr();
    }
  }, [pair, data]);
  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <AppLoader className="h-100 w-100 align-ce justify-ce" />
  ) : (
    <Container className="column w-100 relative justify-ce h-100" gap={24}>
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
      <RewardBooster apr={apr} type={LIQUIDITY_VIEW.ADD_LIQUIDITY} />

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
          pools={data.pools}
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
