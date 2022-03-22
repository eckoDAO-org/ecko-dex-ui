import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import InfoPopup from '../components/shared/InfoPopup';
import Label from '../components/shared/Label';
import Analytics from '../components/stake/Analytics';
import Position from '../components/stake/Position';
import Rewards from '../components/stake/Rewards';
import StakeInfo from '../components/stake/StakeInfo';
import UnstakeInfo from '../components/stake/UnstakeInfo';
import VotingPower from '../components/stake/VotingPower';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import { theme } from '../styles/theme';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [stakeKdxAmout, setStakeKdxAmount] = useState(0);
  return (
    <FlexContainer
      className="column w-100"
      desktopClassName="h-100"
      desktopStyle={{ padding: `50px ${theme().layout.desktopPadding}px` }}
      tabletStyle={{ paddingBottom: 40 }}
      mobileStyle={{ paddingBottom: 40 }}
    >
      <FlexContainer className="w-100 justify-sb" mobileClassName="column" style={{ marginBottom: 24 }} mobileStyle={{ marginTop: 24 }}>
        <FlexContainer gap={16} mobileStyle={{ marginBottom: 16 }}>
          <Label
            withShade={pathname !== ROUTE_STAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_STAKE)}
          >
            STAKE
          </Label>
          <Label
            withShade={pathname !== ROUTE_UNSTAKE}
            className="pointer"
            fontSize={24}
            fontFamily="syncopate"
            onClick={() => history.push(ROUTE_UNSTAKE)}
          >
            UNSTAKE
          </Label>
        </FlexContainer>
        <InfoPopup title={pathname.substring(1)} type="modal" size="large">
          {pathname === ROUTE_STAKE ? <StakeInfo /> : <UnstakeInfo />}
        </InfoPopup>
      </FlexContainer>

      <FlexContainer gap={24} tabletClassName="column" mobileClassName="column">
        <Position
          amount={231.3213}
          stakeKdxAmout={stakeKdxAmout}
          setStakeKdxAmount={setStakeKdxAmount}
          buttonLabel={pathname === ROUTE_STAKE ? 'stake' : 'unstake'}
        />
        <Rewards amount={231.3213} rewardsPenality={2} stakedTime={32} disabled={pathname === ROUTE_UNSTAKE} />
        <Analytics apr={32} volume={321232.231321} stakedShare={5.16} totalStaked={35.16} />
      </FlexContainer>

      <VotingPower />
    </FlexContainer>
  );
};

export default StakeContainer;
