import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import RightHeaderItems from './RightHeaderItems';
// import Burger from "./burger/Burger";
// import MobileMenu from "./menu/MobileMenu";
import PopupContentList from './PopupContentList';
import HeaderItem from '../../../shared/HeaderItem';
import CustomPopup from '../../../shared/CustomPopup';
import { HamburgerIcon } from '../../../assets';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import menuItems from '../../menuItems';
import GameEditionToggle from '../../../shared/GameEditionToggle';

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
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
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
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));
  const [open, setOpen] = useState(false);

  return (
    <Container className={className}>
      <LeftContainer ref={node}>
        <HeaderItem>
          <CustomPopup basic trigger={<HamburgerIcon />} on="click" offset={[0, 10]} position="bottom left">
            <PopupContentList items={menuItems} />
          </CustomPopup>
        </HeaderItem>

        <GameEditionToggle />
      </LeftContainer>
      <RightContainer>
        <RightHeaderItems />
      </RightContainer>
    </Container>
  );
};

export default MobileHeader;
