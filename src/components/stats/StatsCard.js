import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { extractDecimal, reduceBalance } from '../../utils/reduceBalance';
import { ColumnContainer } from '../layout/Containers';
import Label from '../../components/shared/Label';
import { commonTheme } from '../../styles/theme';
import useWindowSize from '../../hooks/useWindowSize';

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img:first-child {
    z-index: 2;
  }
  img:not(:first-child):not(:last-child) {
    margin-left: -15px;
  }
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 4px 0px;
`;

const DesktopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  cursor: pointer;
`;

const StatsCard = ({ pair }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const [width] = useWindowSize();
  return gameEditionView ? (
    <CustomGrid>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start' }} geColor="yellow">
        Pair
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block' }}>
        {pair.token0}/{pair.token1}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start' }} geColor="yellow">
        {pair.token0}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block' }}>
        {reduceBalance(pair.reserves[0])}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start' }} geColor="yellow">
        {pair.token1}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block' }}>
        {reduceBalance(pair.reserves[1])}
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'start' }} geColor="yellow">
        Rate
      </Label>
      <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block' }}>
        {reduceBalance(extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1]))} {pair.token0}/{pair.token1}
      </Label>
    </CustomGrid>
  ) : (
    <>
      {width >= commonTheme.mediaQueries.mobilePixel ? (
        <DesktopGrid>
          {/* ICONS */}
          <IconsContainer style={{ marginRight: '16px' }}>
            {tokenData[pair.token0].icon}
            {tokenData[pair.token1].icon}
            <Label fontFamily="bold">{`${pair.token0}-${pair.token1}`}</Label>
          </IconsContainer>
          {/* TR TOKEN 0 */}
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Total Reserve - Token0</Label>
            <Label>{reduceBalance(pair.reserves[0])}0</Label>
          </ColumnContainer>
          {/* TR TOKEN 1 */}
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Total Reserve - Token1</Label>
            <Label>{reduceBalance(pair.reserves[1])}0</Label>
          </ColumnContainer>
          {/* RATE */}
          <ColumnContainer style={{ marginRight: '16px' }}>
            <Label withShade>Rate</Label>
            <Label>{`${reduceBalance(extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1]))} ${pair.token0}/${pair.token1}`}</Label>
          </ColumnContainer>
        </DesktopGrid>
      ) : (
        <div style={{ display: 'flex', flex: 1, width: '100%', justifyContent: 'space-between' }}>
          <ColumnContainer>
            <IconsContainer>
              {tokenData[pair.token0].icon}
              {tokenData[pair.token1].icon}
              <Label fontFamily="bold">{`${pair.token0}-${pair.token1}`}</Label>
            </IconsContainer>

            <ColumnContainer style={{ marginTop: 32 }}>
              <Label withShade>Rate</Label>
              <Label>{`${reduceBalance(extractDecimal(pair.reserves[0]) / extractDecimal(pair.reserves[1]))} ${pair.token0}/${pair.token1}`}</Label>
            </ColumnContainer>
          </ColumnContainer>

          <ColumnContainer>
            <ColumnContainer>
              <Label withShade>Total Reserve - Token0</Label>
              <Label>{reduceBalance(pair.reserves[0])}0</Label>
            </ColumnContainer>
            <ColumnContainer style={{ marginTop: 16 }}>
              <Label withShade>Total Reserve - Token1</Label>
              <Label>{reduceBalance(pair.reserves[1])}0</Label>
            </ColumnContainer>
          </ColumnContainer>
        </div>
      )}
    </>
  );
};

export default StatsCard;
