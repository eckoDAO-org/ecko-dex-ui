import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { CoinKaddexIcon, CoinsIcon } from '../../assets';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import Toggle from './Toggle';

const RewardBooster = ({ type, apr }) => {
  const [reward, setReward] = useState('usd');

  return (
    <Wrapper gap={28} withGradient className="background-fill w-100 column" style={{ padding: 24 }}>
      <Label fontFamily="syncopate">REWARD BOOSTER</Label>
      <div className="flex justify-sb align-ce">
        <FlexContainer gap={16} className="align-ce">
          <CoinsIcon className="coins-icon" />
          <Toggle
            onClick={(active) => {
              if (active) {
                setReward('kdx');
              } else {
                setReward('usd');
              }
            }}
          />
          <CoinKaddexIcon />
        </FlexContainer>
        <Label fontSize={24}>{apr?.toFixed(2)}% APR</Label>
      </div>
      {type === LIQUIDITY_VIEW.ADD_LIQUIDITY && (
        <div className="flex justify-sb align-ce">
          <div>
            <Label fontSize={13}>Network Rewards Available</Label>
          </div>
          <Label fontSize={13}>{apr?.toFixed(2)}%</Label>
        </div>
      )}
    </Wrapper>
  );
};

export default RewardBooster;

const Wrapper = styled(FlexContainer)`
  .coins-icon {
    path,
    ellipse {
      stroke: ${({ theme: { colors } }) => colors.white};
    }
  }
`;
