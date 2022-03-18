import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import InfoPopup from '../components/shared/InfoPopup';
import Label from '../components/shared/Label';
import Analytics from '../components/stake/Analytics';
import MyPosition from '../components/stake/MyPosition';
import Rewards from '../components/stake/Rewards';
import { ROUTE_STAKE, ROUTE_UNSTAKE } from '../router/routes';
import theme from '../styles/theme';

const StakeContainer = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  return (
    <FlexContainer
      className="column w-100 h-100"
      desktopStyle={{ padding: `50px ${theme.layout.desktopPadding}px` }}
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

        <InfoPopup></InfoPopup>
      </FlexContainer>

      <FlexContainer>
        <MyPosition />
        <Rewards />
        <Analytics />
      </FlexContainer>
    </FlexContainer>
  );
};

export default StakeContainer;
