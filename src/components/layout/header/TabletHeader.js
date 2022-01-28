import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { HamburgerIcon, KaddexLightModeLogo, KaddexLogoWhite } from '../../../assets';
import { useGameEditionContext, useLightModeContext } from '../../../contexts';
import useWindowSize from '../../../hooks/useWindowSize';
import { ROUTE_INDEX } from '../../../router/routes';
import menuItems from '../../menuItems';
import CustomPopup from '../../shared/CustomPopup';
import HeaderItem from '../../shared/HeaderItem';
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
  padding: 0 1.5em;
  padding-top: 16px;
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
  const { themeMode } = useLightModeContext();
  const [width, height] = useWindowSize();
  const { layoutConfiguration } = useGameEditionContext();
  return (
    <Container className={className}>
      <RowContainer>
        <LeftContainer>
          <HeaderItem headerItemStyle={{ marginTop: '4px' }}>
            <CustomPopup basic trigger={<HamburgerIcon />} on="click" offset={[-10, -8]} position="bottom left">
              <PopupContentList withoutAccountInfo items={menuItems} />
            </CustomPopup>
          </HeaderItem>
          {themeMode === 'dark' ? (
            <KaddexLogoWhite style={{ cursor: 'pointer' }} onClick={() => history.push(ROUTE_INDEX)} />
          ) : (
            <KaddexLightModeLogo style={{ cursor: 'pointer' }} onClick={() => history.push(ROUTE_INDEX)} />
          )}
        </LeftContainer>

        {width >= layoutConfiguration.minimumWidth && height >= layoutConfiguration.minimumHeight && <GameEditionModeButton />}

        <RightContainer>
          <RightHeaderItems />
        </RightContainer>
      </RowContainer>
      <span className="mainnet-chain-2 desktop-none mobile-none">Mainnet Chain 2</span>
    </Container>
  );
};

export default TabletHeader;
