import React, { useState } from 'react';
import styled from 'styled-components';
import { MenuGEIcon } from '../../assets';
import HeaderItem from '../../shared/HeaderItem';
import theme from '../../styles/theme';
import headerLinks from '../headerLinks';
import menuItems from '../menuItems';
import { FadeIn } from '../shared/animations';

const Container = styled(FadeIn)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
`;

const BottomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  return (
    <Container>
      <TopListContainer>
        {menuItems.map((item, index) => (
          <RowMenuContainer>
            <MenuGEIcon
              style={{
                display: arrowVisible === item.label ? 'block' : 'none',
              }}
            />
            <HeaderItem
              key={index}
              className={item.className}
              route={item.route}
              headerItemStyle={{
                fontFamily: theme.fontFamily.pressStartRegular,
                color: 'black',
                margin: '0px 8px',
              }}
              onMouseOver={() => setArrowVisible(item.label)}
            >
              {item.label}
            </HeaderItem>
            <MenuGEIcon
              style={{
                transform: 'rotate(180deg)',
                display: arrowVisible === item.label ? 'block' : 'none',
              }}
            />
          </RowMenuContainer>
        ))}
      </TopListContainer>
      <BottomListContainer>
        {headerLinks.map((item, index) => (
          <RowMenuContainer>
            <MenuGEIcon
              style={{
                display: arrowVisible === item.label ? 'block' : 'none',
              }}
            />
            <HeaderItem
              className={item?.className}
              route={item?.route}
              key={index}
              onClick={item?.onClick}
              link={item?.link}
              headerItemStyle={{
                fontFamily: theme.fontFamily.pressStartRegular,
                color: 'black',
                margin: '0px 8px',
              }}
              onMouseOver={() => setArrowVisible(item.label)}
            >
              {item.label}
            </HeaderItem>
            <MenuGEIcon
              style={{
                transform: 'rotate(180deg)',
                display: arrowVisible === item.label ? 'block' : 'none',
              }}
            />
          </RowMenuContainer>
        ))}
      </BottomListContainer>
    </Container>
  );
};

export default GameEditionMenuContainer;
