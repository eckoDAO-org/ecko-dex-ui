/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ArrowBack } from '../../assets';
import { useApplicationContext } from '../../contexts';
import { ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_LIQUIDITY_TOKENS } from '../../router/routes';
import SlippagePopupContent from '../layout/header/SlippagePopupContent';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { theme } from '../../styles/theme';
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

const Container = styled(FadeIn)`
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 550px;
`;

const AddLiquidityContainer = (props) => {
  const history = useHistory();

  const { pathname } = useLocation();
  const { themeMode } = useApplicationContext();

  const query = useQueryParams();

  const [data, setData] = useState({ pairs: [], volumes: [] });
  const [pair, setPair] = useState({ token0: query.get('token0'), token1: query.get('token1') });

  const [apr, setApr] = useState(null);

  const calculateApr = async () => {
    const pool = data.pairs.find(
      (p) => (p.token0 === pair.token0 && p.token1 === pair.token1) || (p.token0 === pair.token1 && p.token1 === pair.token0)
    );
    const result = await getAllPairValues([pool], data.volumes);
    setApr(result[0]?.apr?.value);
  };

  const fetchData = async () => {
    const pairs = await getPairList();
    const volumes = await getDailyVolume();

    setData({ pairs, volumes });
  };

  useEffect(() => {
    if (data?.pairs?.length && data?.volumes?.length && isValidString(pair?.token0) && isValidString(pair.token1) && pair?.token0 !== pair.token1) {
      calculateApr();
    }
  }, [pair, data]);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="column w-100 relative justify-ce h-100" gap={24}>
      <FlexContainer className="w-100 justify-sb">
        <FlexContainer>
          <ArrowBack
            style={{
              cursor: 'pointer',
              color: theme(themeMode).colors.white,
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

      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED && <SingleSidedLiquidity pair={{ token0: query.get('token0') }} />}
      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED && (
        <DoubleSidedLiquidity
          pair={{ token0: query.get('token0'), token1: query.get('token1') }}
          setPair={(token0, token1) => {
            setPair({ token0, token1 });
          }}
        />
      )}
    </Container>
  );
};

export default AddLiquidityContainer;
