import React from 'react';
import styled from 'styled-components/macro';
import { CoinsIcon, EckoOutlineIcon } from '../../assets';
import theme from '../../styles/theme';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const RewardBooster = ({ apr, pair }) => {
  return (
    <>
      <Label fontFamily="syncopate">STANDARD REWARDS</Label>
      <Wrapper gap={16} withGradient className="background-fill w-100 column" style={{ padding: 24 }}>
        <div className="flex justify-sb align-fs">
          <FlexContainer gap={16} className="align-ce">
            <CoinsIcon className="coins-icon" />
            <EckoOutlineIcon
              className="svg-app-color"
              style={{ border: `1px solid ${theme.colors.white}`, borderRadius: '100%' }}
              width={24}
              height={24}
            />
          </FlexContainer>
          <div className="flex column">
            <Label fontSize={24}> APR {apr?.toFixed(2)} %</Label>
          </div>
        </div>
      </Wrapper>
    </>
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