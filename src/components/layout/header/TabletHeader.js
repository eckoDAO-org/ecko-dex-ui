import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { HamburgerIcon, EckoDexLightModeLogo, EckoDexLogo } from '../../../assets';
import { useApplicationContext } from '../../../contexts';
import useWindowSize from '../../../hooks/useWindowSize';
import { ROUTE_INDEX } from '../../../router/routes';
import menuItems from '../../menuItems';
import GameEditionModeButton from './GameEditionModeButton';
import PopupContentList from './PopupContentList';
import RightHeaderItems from './RightHeaderItems';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: start;
  min-height: ${({ theme: { header } }) => `${header.mobileHeight}px`};
  width: 100%;
  padding: 0 32px;
  padding-top: 16px;

  .hamburger-icon {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
`;

const RightContainer = styled.div`
  display: flex;
`;

const RowContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TabletHeader = ({ className }) => {
  const history = useHistory();
  const { themeMode, resolutionConfiguration } = useApplicationContext();
  const [width, height] = useWindowSize();
  return (
    <Container className={className}>
      <RowContainer>
        <LeftContainer>
          <PopupContentList withoutAccountInfo items={menuItems} icon={<HamburgerIcon className="hamburger-icon" />} className="hamburger" />
          {themeMode === 'dark' ? (
            <EckoDexLogo style={{ cursor: 'pointer', zIndex: 1 }} onClick={() => history.push(ROUTE_INDEX)} />
          ) : (
            <EckoDexLightModeLogo style={{ cursor: 'pointer', zIndex: 1 }} onClick={() => history.push(ROUTE_INDEX)} />
          )}
        </LeftContainer>

        {width >= resolutionConfiguration?.width && height >= resolutionConfiguration?.height && <GameEditionModeButton />}

        <RightContainer>
          <RightHeaderItems />
        </RightContainer>
      </RowContainer>
      {/* <Label outGameEditionView className="mainnet-chain-2 desktop-none mobile-none">
        Chain 2
      </Label> */}
    </Container>
  );
};

export default TabletHeader;
