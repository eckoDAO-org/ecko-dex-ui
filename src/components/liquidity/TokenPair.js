import React from 'react';
import styled from 'styled-components/macro';
import { Accordion } from 'semantic-ui-react';
import { extractDecimal, pairUnit } from '../../utils/reduceBalance';
import CustomButton from '../../components/shared/CustomButton';
import { theme } from '../../styles/theme';
import { ColumnContainer, Container, RowContainer, Value } from '../../components/layout/Containers';
import { ArrowDown, PixeledArrowDownIcon } from '../../assets';
import useWindowSize from '../../hooks/useWindowSize';
import Label from '../../components/shared/Label';
import { useGameEditionContext } from '../../contexts';

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
      fill: ${({ $gameEditionView, theme: { colors } }) => ($gameEditionView ? '#fff' : colors.white)};
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
`;

const TokenPair = (props) => {
  const { gameEditionView: $gameEditionView } = useGameEditionContext();
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
          <Label fontFamily="syncopate" geFontSize={20}>
            {token0} / {token1}
          </Label>
          <IconContainer $gameEditionView={$gameEditionView} active={props.activeIndex === props.index}>
            {$gameEditionView ? <PixeledArrowDownIcon /> : <ArrowDown />}
          </IconContainer>
        </HeaderContainer>
        <Accordion.Content style={{ flexFlow: 'column', padding: 0 }} active={props.activeIndex === props.index}>
          {!$gameEditionView ? (
            <ResultContainer>
              <RowContainer>
                <Label fontSize={13} withShade>
                  Your pool tokens:
                </Label>
                <Label fontSize={16}>{pairUnit(extractDecimal(balance))}</Label>
              </RowContainer>
              <RowContainer>
                <Label fontSize={13} withShade>
                  Pooled {token0}:
                </Label>
                <Label fontSize={16}>{pairUnit(extractDecimal(pooledAmount[0]))}</Label>
              </RowContainer>
              <RowContainer>
                <Label fontSize={13} withShade>
                  Pooled {token1}:
                </Label>
                <Label fontSize={16}>{pairUnit(extractDecimal(pooledAmount[1]))}</Label>
              </RowContainer>
              <RowContainer>
                <Label fontSize={13} withShade>
                  Your pool share:
                </Label>

                <Label fontSize={16}>{((extractDecimal(balance) / extractDecimal(supply)) * 100).toPrecision(4)} %</Label>
              </RowContainer>
            </ResultContainer>
          ) : width <= theme().mediaQueries.mobilePixel ? (
            <ResultContainer style={{ flexFlow: 'column' }} active={props.activeIndex === props.index} $gameEditionView={$gameEditionView}>
              <ColumnContainer>
                <Label geColor="yellow">Your pool tokens:</Label>
                <Value>{pairUnit(extractDecimal(balance))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label geColor="yellow">Pooled {token0}:</Label>
                <Value>{pairUnit(extractDecimal(pooledAmount[0]))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label geColor="yellow">Pooled {token1}:</Label>
                <Value>{pairUnit(extractDecimal(pooledAmount[1]))}</Value>
              </ColumnContainer>
              <ColumnContainer>
                <Label geColor="yellow">Your pool share:</Label>
                <Value>{((extractDecimal(balance) / extractDecimal(supply)) * 100).toPrecision(4)} %</Value>
              </ColumnContainer>
            </ResultContainer>
          ) : (
            <ResultContainer style={{ flexFlow: 'column' }} active={props.activeIndex === props.index} $gameEditionView={$gameEditionView}>
              <RowContainer $gameEditionView={$gameEditionView}>
                <ColumnContainer>
                  <Label geColor="yellow" geFontSize={16}>
                    Your pool tokens:
                  </Label>
                  <Label geFontSize={18}>{pairUnit(extractDecimal(balance))}</Label>
                </ColumnContainer>
                <ColumnContainer>
                  <Label geColor="yellow" geLabelStyle={{ justifyContent: 'end' }} geFontSize={16}>
                    Pooled {token0}:
                  </Label>
                  <Label geLabelStyle={{ justifyContent: 'end' }} geFontSize={18}>
                    {pairUnit(extractDecimal(pooledAmount[0]))}
                  </Label>
                </ColumnContainer>
              </RowContainer>
              <RowContainer $gameEditionView={$gameEditionView}>
                <ColumnContainer>
                  <Label geColor="yellow" geFontSize={16}>
                    Pooled {token1}:
                  </Label>
                  <Label geFontSize={18}>{pairUnit(extractDecimal(pooledAmount[1]))}</Label>
                </ColumnContainer>
                <ColumnContainer>
                  <Label geColor="yellow" geLabelStyle={{ justifyContent: 'end' }} geFontSize={16}>
                    Your pool share:
                  </Label>
                  <Label geLabelStyle={{ justifyContent: 'end' }} geFontSize={18}>
                    {((extractDecimal(balance) / extractDecimal(supply)) * 100).toPrecision(4)} %
                  </Label>
                </ColumnContainer>
              </RowContainer>
            </ResultContainer>
          )}

          <ActionContainer>
            <CustomButton
              fluid
              geType="cancel"
              type="primary"
              buttonStyle={{
                marginRight: 10,
              }}
              onClick={() => {
                props.selectRemoveLiquidity();
                props.setTokenPair(props.pair);
              }}
            >
              Remove
            </CustomButton>

            <CustomButton
              fluid
              geType="confirm"
              type="secondary"
              onClick={() => {
                props.selectAddLiquidity();
                props.setTokenPair(props.pair);
              }}
            >
              Add
            </CustomButton>
          </ActionContainer>
        </Accordion.Content>
      </Accordion>
    </Container>
  ) : (
    ''
  );
};

export default TokenPair;
