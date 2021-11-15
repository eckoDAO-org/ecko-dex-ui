import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  Button,
  Divider,
  Icon,
} from 'semantic-ui-react';

import {
  reduceBalance,
  extractDecimal,
  pairUnit,
} from '../../utils/reduceBalance';
import CustomButton from '../../shared/CustomButton';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const ResultContainer = styled.div`
  display: flex !important;
  justify-content: space-between;
  margin: ${({ gameEditionView }) =>
    gameEditionView ? '0px' : '0px 0px 22px'};
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 10px;

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
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '16px')};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-flow: ${({ gameEditionView }) => (gameEditionView ? 'row' : 'column')};
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? '8px' : '0px')};
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : '#FFFFFF !importsnt'};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  text-align: ${({ gameEditionView }) => gameEditionView && 'left'};

  text-transform: capitalize;
`;

const Value = styled.span`
  font-family: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '16px')};
  line-height: 20px;
  color: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView ? colors.black : '#FFFFFF'};
  text-align: ${({ gameEditionView }) => gameEditionView && 'left'};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
  }
`;

const TokenPair = (props) => {
  const { gameEditionView } = useContext(GameEditionContext);
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
                color={gameEditionView ? theme.colors.black : '#fff'}
                border={!gameEditionView && '1px solid #FFFFFF99'}
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
