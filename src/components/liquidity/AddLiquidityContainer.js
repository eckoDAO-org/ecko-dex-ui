import React from 'react';
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

const Container = styled(FadeIn)`
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 550px;
`;

const AddLiquidityContainer = () => {
  const history = useHistory();

  const { pathname } = useLocation();
  const { themeMode } = useApplicationContext();

  const query = useQueryParams();

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
              history.push(query.get('back') || ROUTE_LIQUIDITY_TOKENS);
            }}
          />
          <Label fontSize={24} fontFamily="syncopate">
            ADD LIQUIDITY
          </Label>
        </FlexContainer>
        <SlippagePopupContent />
      </FlexContainer>
      <RewardBooster />

      <FlexContainer gap={24}>
        <Label
          fontFamily="syncopate"
          withShade={pathname !== ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED}
          onClick={() => history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED)}
        >
          SINGLE-SIDED
        </Label>
        <Label
          fontFamily="syncopate"
          withShade={pathname !== ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED}
          onClick={() => history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED)}
        >
          DOUBLE-SIDED
        </Label>
      </FlexContainer>

      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED && <SingleSidedLiquidity pair={{ token0: query.get('token0') }} />}
      {pathname === ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED && (
        <DoubleSidedLiquidity pair={{ token0: query.get('token0'), token1: query.get('token1') }} />
      )}
    </Container>
  );
};

export default AddLiquidityContainer;
