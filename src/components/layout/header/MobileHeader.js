import React from 'react';
import styled from 'styled-components/macro';
import RightHeaderItems from './RightHeaderItems';
import PopupContentList from './PopupContentList';
import { HamburgerIcon, EckoDexLightModeLogo, EckoDexLogo } from '../../../assets';
import menuItems from '../../menuItems';
import { useHistory } from 'react-router';
import { ROUTE_INDEX } from '../../../router/routes';
import { useApplicationContext } from '../../../contexts';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: start;
  min-height: ${({ theme: { header } }) => `${header.mobileHeight}px`};
  width: 100%;
  padding: ${({ theme: { layout } }) => `0 ${layout.mobilePadding}px`};

  padding-top: 16px;

  .hamburger-icon {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;
const RowContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 24px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobileSmallPixel}px`}) {
    margin-right: 10px;
    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }
`;

const MobileHeader = ({ className }) => {
  const history = useHistory();
  const { themeMode } = useApplicationContext();

  return (
    <Container className={className}>
      <RowContainer>
        <LeftContainer>
          <PopupContentList withoutAccountInfo items={menuItems} icon={<HamburgerIcon className="hamburger-icon" />} className="hamburger" />
          {themeMode === 'dark' ? (
            <EckoDexLightModeLogo className="w-100" style={{ cursor: 'pointer', zIndex: 1, height: 20 }} onClick={() => history.push(ROUTE_INDEX)} />
          ) : (
            <EckoDexLogo className="w-100" style={{ cursor: 'pointer', zIndex: 1, height: 20 }} onClick={() => history.push(ROUTE_INDEX)} />
          )}
        </LeftContainer>

        {/* <GameEditionModeButton /> */}
        <RightHeaderItems />
      </RowContainer>
    </Container>
  );
};

export default MobileHeader;
