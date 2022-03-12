import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../contexts';
import RemoveLiquidityContent from '../components/liquidity/RemoveLiquidityContent';
import SlippagePopupContent from '../components/layout/header/SlippagePopupContent';
import { FadeIn } from '../components/shared/animations';
import { FlexContainer } from '../components/shared/FlexContainer';
import { ArrowBack } from '../assets';
import { theme } from '../styles/theme';
import Label from '../components/shared/Label';
import RewardBooster from '../components/liquidity/RewardBooster';
import { ROUTE_LIQUIDITY_MY_LIQUIDITY } from '../router/routes';

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
              history.push(ROUTE_LIQUIDITY_MY_LIQUIDITY);
            }}
          />
          <Label fontSize={24} fontFamily="syncopate">
            REMOVE LIQUIDITY
          </Label>
        </FlexContainer>
        <SlippagePopupContent />
      </FlexContainer>
      <RewardBooster />
      <RemoveLiquidityContent />
    </Container>
  );
};

export default RemoveLiquidityContainer;
