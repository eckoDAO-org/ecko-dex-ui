import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { CoinKaddexIcon, CoinsIcon } from '../../assets';
import { LIQUIDITY_VIEW } from '../../constants/liquidityView';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
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

      <div className="flex justify-sb align-ce">
        <div>
          <Label fontSize={13}>
            KDX Rewards Available{' '}
            <InfoPopup>
              Accounting for 40% of the overall supply, Network Rewards serve a crucial function of both attracting liquidity and mitigating
              impermanent loss. Their emission is programmatical, diminishing and time oriented.
            </InfoPopup>
          </Label>
        </div>
        <Label fontSize={13}>{apr?.toFixed(2)}%</Label>
      </div>
      {type === LIQUIDITY_VIEW.REMOVE_LIQUIDITY && (
        <div className="flex justify-sb align-fs">
          <Label fontSize={16}>Fees Collected</Label>
          <div className="column">
            <Label fontSize={16}>123.1234 KDX</Label>
            <Label fontSize={13} className="justify-fe" withShade labelStyle={{ marginTop: 4 }}>
              123.1234 USD
            </Label>
          </div>
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
