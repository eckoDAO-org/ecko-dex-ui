import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Accordion, Button } from 'semantic-ui-react';

import { reduceBalance, extractDecimal, pairUnit } from '../../utils/reduceBalance';
import CustomButton from '../../components/shared/CustomButton';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { theme } from '../../styles/theme';
import { ButtonContainer, ColumnContainer, Container, Label, RowContainer, Value } from '../../components/layout/Containers';
import { LightModeContext } from '../../contexts/LightModeContext';
import { ArrowDown, PixeledArrowDownIcon } from '../../assets';
import useWindowSize from '../../hooks/useWindowSize';

const ResultContainer = styled.div`
  display: flex !important;
  justify-content: space-between;
  margin: ${({ $gameEditionView }) => ($gameEditionView ? '10px 0px 0px 0px' : '16px 0px 32px 0px')};
  flex-direction: row;
  width: 100%;
  height: 100%;

  & > *:not(:last-child) {
    margin-right: 15px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;

    & > *:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;

const HeaderContainer = styled(Accordion.Title)`
  display: flex;
  width: 100%;
  margin: 0;
  text-align: left;
  justify-content: space-between;
  padding: 0px !important;

  font-family: ${({ $gameEditionView, theme: { fontFamily } }) =>
    $gameEditionView ? `${fontFamily.pixeboy} !important` : `${fontFamily.bold} !important`};
  color: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? `${colors.white} !important` : `${colors.white} !important`)};
  font-size: ${({ $gameEditionView }) => ($gameEditionView ? '20px !important' : '16px !important')};

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${({ active }) => (active ? 'rotate(0deg)' : 'rotate(-90deg)')};

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const TokenPair = (props) => {
  const { gameEditionView: $gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);
  let { token0, token1, balance, supply, pooledAmount } = props.pair;

  const handleActiveIndex = (index) => {
    const currentIndex = index;
    return currentIndex === props.activeIndex ? props.setActiveIndex(null) : props.setActiveIndex(currentIndex);
  };

  const [width] = useWindowSize();

  return balance ? (
    <Container $gameEditionView={$gameEditionView}>
      <Accordion fluid>
        <HeaderContainer
          active={props.activeIndex === props.index}
          index={props.index}
          $gameEditionView={$gameEditionView}
          onClick={() => handleActiveIndex(props.index)}
        >
          {token0} / {token1}
          <IconContainer active={props.activeIndex === props.index}>{$gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown />}</IconContainer>
        </HeaderContainer>
        <Accordion.Content style={{ flexFlow: 'column', padding: 0 }} active={props.activeIndex === props.index}>
          {!$gameEditionView ? (
            <ResultContainer>
              <RowContainer>
                <Label>Your pool tokens:</Label>
                <Value>{pairUnit(extractDecimal(balance))}</Value>
              </RowContainer>
              <RowContainer>
                <Label>Pooled {token0}:</Label>
                <Value>{pairUnit(extractDecimal(pooledAmount[0]))}</Value>
              </RowContainer>
              <RowContainer>
                <Label>Pooled {token1}:</Label>
                <Value>{pairUnit(extractDecimal(pooledAmount[1]))}</Value>
              </RowContainer>
              <RowContainer>
                <Label>Your pool share:</Label>
                <Value>{reduceBalance((extractDecimal(balance) / extractDecimal(supply)) * 100)}%</Value>
              </RowContainer>
            </ResultContainer>
          ) : width <= theme().mediaQueries.mobilePixel ? (
            <ResultContainer style={{ flexFlow: 'column' }} active={props.activeIndex === props.index} $gameEditionView={$gameEditionView}>
              <ColumnContainer>
                <Label $gameEditionView={$gameEditionView}>Your pool tokens:</Label>
                <Value $gameEditionView={$gameEditionView}>{pairUnit(extractDecimal(balance))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label $gameEditionView={$gameEditionView}>Pooled {token0}:</Label>
                <Value $gameEditionView={$gameEditionView}>{pairUnit(extractDecimal(pooledAmount[0]))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label $gameEditionView={$gameEditionView}>Pooled {token1}:</Label>
                <Value $gameEditionView={$gameEditionView}>{pairUnit(extractDecimal(pooledAmount[1]))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label $gameEditionView={$gameEditionView}>Your pool share:</Label>
                <Value $gameEditionView={$gameEditionView}>{reduceBalance((extractDecimal(balance) / extractDecimal(supply)) * 100)}%</Value>
              </ColumnContainer>
            </ResultContainer>
          ) : (
            <ResultContainer style={{ flexFlow: 'column' }} active={props.activeIndex === props.index} $gameEditionView={$gameEditionView}>
              <RowContainer $gameEditionView={$gameEditionView}>
                <ColumnContainer>
                  <Label $gameEditionView={$gameEditionView}>Your pool tokens:</Label>
                  <Value $gameEditionView={$gameEditionView}>{pairUnit(extractDecimal(balance))}</Value>
                </ColumnContainer>
                <ColumnContainer>
                  <Label style={{ textAlign: 'right' }} $gameEditionView={$gameEditionView}>
                    Pooled {token0}:
                  </Label>
                  <Value style={{ textAlign: 'right' }} $gameEditionView={$gameEditionView}>
                    {pairUnit(extractDecimal(pooledAmount[0]))}
                  </Value>
                </ColumnContainer>
              </RowContainer>
              <RowContainer $gameEditionView={$gameEditionView}>
                <ColumnContainer>
                  <Label $gameEditionView={$gameEditionView}>Pooled {token1}:</Label>
                  <Value $gameEditionView={$gameEditionView}>{pairUnit(extractDecimal(pooledAmount[1]))}</Value>
                </ColumnContainer>
                <ColumnContainer>
                  <Label style={{ textAlign: 'right' }} $gameEditionView={$gameEditionView}>
                    Your pool share:
                  </Label>
                  <Value style={{ textAlign: 'right' }} $gameEditionView={$gameEditionView}>
                    {reduceBalance((extractDecimal(balance) / extractDecimal(supply)) * 100)}%
                  </Value>
                </ColumnContainer>
              </RowContainer>
            </ResultContainer>
          )}

          <ButtonContainer id="token-pair-button-container">
            <Button.Group fluid style={{ flexDirection: $gameEditionView && width <= theme().mediaQueries.mobilePixel ? 'column' : 'row' }}>
              <CustomButton
                buttonStyle={{
                  marginRight: $gameEditionView && width <= theme().mediaQueries.mobilePixel ? '0px' : '30px',
                  width: $gameEditionView && width <= theme().mediaQueries.mobilePixel ? '100%' : '48%',
                  height: '40px',
                  marginBottom: $gameEditionView && width <= theme().mediaQueries.mobilePixel && '10px',
                }}
                background="transparent"
                color={$gameEditionView ? theme(themeMode).colors.white : theme(themeMode).colors.white}
                border={!$gameEditionView && `1px solid ${theme(themeMode).colors.white}99`}
                onClick={() => {
                  props.selectRemoveLiquidity();
                  props.setTokenPair(props.pair);
                }}
              >
                Remove
              </CustomButton>
              <CustomButton
                buttonStyle={{
                  marginLeft: $gameEditionView && width <= theme().mediaQueries.mobilePixel ? '0px' : '-20px',
                  width: $gameEditionView && width <= theme().mediaQueries.mobilePixel ? '100%' : '48%',
                  height: '40px',
                }}
                onClick={() => {
                  props.selectAddLiquidity();
                  props.setTokenPair(props.pair);
                }}
              >
                Add
              </CustomButton>
            </Button.Group>
          </ButtonContainer>
        </Accordion.Content>
      </Accordion>
    </Container>
  ) : (
    ''
  );
};

export default TokenPair;
