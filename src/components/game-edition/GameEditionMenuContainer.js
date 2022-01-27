import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { MenuGEIcon } from '../../assets';
import theme from '../../styles/theme';
import headerLinks from '../headerLinks';
import menuItems from '../menuItems';
import { FadeIn } from '../shared/animations';
import HeaderItem from '../shared/HeaderItem';

const Container = styled(FadeIn)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const TopListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5%;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    & > a {
      font-size: 24px !important;
    }
  }
`;

const BottomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 5%;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
`;

const RowMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GameEditionMenuContainer = () => {
  const [arrowVisible, setArrowVisible] = useState('');

  const SelectGEIcon = ({ label, rotate }) => {
    return (
      <MenuGEIcon
        style={{
          display: arrowVisible === label ? 'block' : 'none',
          height: 14,
          transform: rotate && 'rotate(180deg)',
        }}
      />
    );
  };

  return (
    <Container>
      <TopListContainer>
        {menuItems.map((item, index) => (
          <RowMenuContainer key={index}>
            <SelectGEIcon label={item.label} />
            <HeaderItem
              className={item.className}
              route={item.route}
              headerItemStyle={{
                fontFamily: theme.fontFamily.pressStartRegular,
                color: 'black',
                margin: '0px 8px',
                fontSize: 14,
              }}
              onMouseOver={() => setArrowVisible(item.label)}
              notChangebleFontOnHover
            >
              {item.label}
            </HeaderItem>
            <SelectGEIcon label={item.label} rotate />
          </RowMenuContainer>
        ))}
      </TopListContainer>
      <BottomListContainer>
        {headerLinks.map((item, index) => (
          <RowMenuContainer key={index}>
            <SelectGEIcon label={item.label} />
            <HeaderItem
              className={item?.className}
              route={item?.route}
              onClick={item?.onClick}
              link={item?.link}
              headerItemStyle={{
                fontFamily: theme.fontFamily.pressStartRegular,
                color: 'black',
                margin: '0px 8px',
                fontSize: 14,
              }}
              onMouseOver={() => setArrowVisible(item.label)}
              notChangebleFontOnHover
            >
              {item.label}
            </HeaderItem>
            <SelectGEIcon label={item.label} rotate />
          </RowMenuContainer>
        ))}
      </BottomListContainer>
    </Container>
  );
};

export default GameEditionMenuContainer;
