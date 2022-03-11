import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import useQueryParams from '../hooks/useQueryParams';
import { useApplicationContext } from '../contexts';
import RemoveLiquidityContent from '../components/liquidity/RemoveLiquidityContent';
import SlippagePopupContent from '../components/layout/header/SlippagePopupContent';
import { FadeIn } from '../components/shared/animations';
import { FlexContainer } from '../components/shared/FlexContainer';
import { ArrowBack } from '../assets';
import { theme } from '../styles/theme';
import Label from '../components/shared/Label';
import RewardBooster from '../components/liquidity/RewardBooster';
import { ROUTE_LIQUIDITY_TOKENS } from '../router/routes';

const Container = styled(FadeIn)`
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  max-width: 550px;
`;

const RemoveLiquidityContainer = () => {
  const history = useHistory();

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
            REMOVE LIQUIDITY
          </Label>
        </FlexContainer>
        <SlippagePopupContent />
      </FlexContainer>
      <RewardBooster />
      <RemoveLiquidityContent
        pair={{
          token0: query.get('token0'),
          token1: query.get('token1'),
          balance: query.get('balance'),
          pooledAmount: [query.get('pooled0'), query.get('pooled1')],
        }}
      />
    </Container>
  );
};

export default RemoveLiquidityContainer;
