import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Accordion, Button, Icon } from 'semantic-ui-react';

import {
  reduceBalance,
  extractDecimal,
  pairUnit,
} from '../../utils/reduceBalance';
import CustomButton from '../../shared/CustomButton';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { theme } from '../../styles/theme';
import {
  ButtonContainer,
  ColumnContainer,
  Container,
  Label,
  RowContainer,
  Value,
} from '../../components/layout/Containers';
import { LightModeContext } from '../../contexts/LightModeContext';

const ResultContainer = styled.div`
  display: flex !important;
  justify-content: space-between;
  margin: ${({ gameEditionView }) =>
    gameEditionView ? '0px' : '0px 0px 22px'};
  flex-direction: row;
  width: 100%;
  height: 100%;

  & > *:not(:last-child) {
    margin-right: 15px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
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
  padding: 10px;

  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView
      ? `${fontFamily.pressStartRegular} !important`
      : `${fontFamily.regular} !important`};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView
      ? `${colors.black} !important`
      : `${colors.white} !important`};
  font-size: ${({ gameEditionView }) =>
    gameEditionView ? '10px' : '16px !important'};
`;

const TokenPair = (props) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);
  let { token0, token1, balance, supply, pooledAmount } = props.pair;

  const handleActiveIndex = (index) => {
    const currentIndex = index;
    return currentIndex === props.activeIndex
      ? props.setActiveIndex(null)
      : props.setActiveIndex(currentIndex);
  };

  return balance ? (
    <Container gameEditionView={gameEditionView}>
      <Accordion fluid>
        <HeaderContainer
          active={props.activeIndex === props.index}
          index={props.index}
          gameEditionView={gameEditionView}
          onClick={() => handleActiveIndex(props.index)}
        >
          {token0} / {token1}
          <Icon name='dropdown' />
        </HeaderContainer>
        <Accordion.Content
          style={{ flexFlow: 'column', padding: 0 }}
          active={props.activeIndex === props.index}
        >
          {!gameEditionView ? (
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
                <Value>
                  {reduceBalance(
                    (extractDecimal(balance) / extractDecimal(supply)) * 100
                  )}
                  %
                </Value>
              </RowContainer>
            </ResultContainer>
          ) : (
            <ResultContainer
              style={{ flexFlow: 'column' }}
              active={props.activeIndex === props.index}
              gameEditionView={gameEditionView}
            >
              <RowContainer gameEditionView={gameEditionView}>
                <ColumnContainer>
                  <Label gameEditionView={gameEditionView}>
                    Your pool tokens:
                  </Label>
                  <Value gameEditionView={gameEditionView}>
                    {pairUnit(extractDecimal(balance))}
                  </Value>
                </ColumnContainer>
                <ColumnContainer>
                  <Label gameEditionView={gameEditionView}>
                    Pooled {token0}:
                  </Label>
                  <Value gameEditionView={gameEditionView}>
                    {pairUnit(extractDecimal(pooledAmount[0]))}
                  </Value>
                </ColumnContainer>
              </RowContainer>
              <RowContainer gameEditionView={gameEditionView}>
                <ColumnContainer>
                  <Label gameEditionView={gameEditionView}>
                    Pooled {token1}:
                  </Label>
                  <Value gameEditionView={gameEditionView}>
                    {pairUnit(extractDecimal(pooledAmount[1]))}
                  </Value>
                </ColumnContainer>
                <ColumnContainer>
                  <Label gameEditionView={gameEditionView}>
                    Your pool share:
                  </Label>
                  <Value gameEditionView={gameEditionView}>
                    {reduceBalance(
                      (extractDecimal(balance) / extractDecimal(supply)) * 100
                    )}
                    %
                  </Value>
                </ColumnContainer>
              </RowContainer>
            </ResultContainer>
          )}

          <ButtonContainer>
            <Button.Group fluid>
              <CustomButton
                buttonStyle={{
                  marginRight: '30px',
                  width: '48%',
                  height: '40px',
                }}
                background='transparent'
                color={
                  gameEditionView
                    ? theme(themeMode).colors.black
                    : theme(themeMode).colors.white
                }
                border={
                  !gameEditionView &&
                  `1px solid ${theme(themeMode).colors.white}99`
                }
                onClick={() => {
                  props.selectRemoveLiquidity();
                  props.setTokenPair(props.pair);
                }}
              >
                Remove
              </CustomButton>
              <CustomButton
                buttonStyle={{
                  marginLeft: '-20px',
                  width: '48%',
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
