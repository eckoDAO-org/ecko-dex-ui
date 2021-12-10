import React from 'react';
import styled from 'styled-components/macro';
import RightHeaderItems from './RightHeaderItems';
import PopupContentList from './PopupContentList';
import HeaderItem from '../../../shared/HeaderItem';
import CustomPopup from '../../../shared/CustomPopup';
import { HamburgerIcon, KaddexLetterLogo } from '../../../assets';
import menuItems from '../../menuItems';
import { useHistory } from 'react-router';
import { ROUTE_SWAP } from '../../../router/routes';

const Container = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  min-height: ${({ theme: { header } }) => `${header.height}px`};
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

const RightContainer = styled.div`
  display: flex;
`;

const MobileHeader = ({ className }) => {
  const history = useHistory();

  return (
    <Container className={className}>
      <LeftContainer>
        <HeaderItem headerItemStyle={{ marginTop: '4px' }}>
          <CustomPopup basic trigger={<HamburgerIcon />} on="click" offset={[0, 14]} position="bottom left">
            <PopupContentList items={menuItems} />
          </CustomPopup>
        </HeaderItem>
        <KaddexLetterLogo onClick={() => history.push(ROUTE_SWAP)} />

        {/* <GameEditionToggle /> */}
      </LeftContainer>
      <RightContainer>
        <RightHeaderItems />
      </RightContainer>
    </Container>
  );
};

export default MobileHeader;
