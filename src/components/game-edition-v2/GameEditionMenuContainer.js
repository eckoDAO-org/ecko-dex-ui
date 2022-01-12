import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { ItemMenuArrowIcon } from '../../assets';
import HeaderItem from '../../components/shared/HeaderItem';
import theme from '../../styles/theme';
import headerLinks from '../headerLinks';
import menuItems from '../menuItems';
import { FadeIn } from '../shared/animations';
import GameEditionLabel from './shared/GameEditionLabel';
import menuBackground from '../../assets/images/game-edition/menu-background.png';

const Container = styled(FadeIn)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const TopListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5%;
  align-items: center;
  justify-content: center;
  /* & > *:not(:last-child) {
    margin-bottom: 25px;
  } */

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    & > a {
      font-size: 24px !important;
    }
  }
`;

const RowMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GameEditionMenuContainer = () => {
  const [arrowVisible, setArrowVisible] = useState('');

  return (
    <Container style={{ backgroundImage: `url(${menuBackground})` }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <GameEditionLabel fontSize={52} fontWeight={400} style={{ marginBottom: 30 }}>
          MENU
        </GameEditionLabel>
        <TopListContainer>
          {menuItems.map((item, index) => (
            <RowMenuContainer key={index}>
              {arrowVisible === item.label && <ItemMenuArrowIcon label={item.label} style={{ marginRight: 5.5 }} />}
              <HeaderItem
                className={item.className}
                route={item.route}
                headerItemStyle={{
                  fontFamily: theme.fontFamily.pixeboy,
                  color: arrowVisible === item.label ? '#FFC107' : '#ffffff',
                  fontSize: 32,
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
                onMouseOver={() => setArrowVisible(item.label)}
                notChangebleFontOnHover
              >
                {item.label}
              </HeaderItem>
            </RowMenuContainer>
          ))}
        </TopListContainer>
      </div>
      <RowMenuContainer>
        {headerLinks.map((item, index) => (
          <HeaderItem
            key={index}
            className={item?.className}
            route={item?.route}
            onClick={item?.onClick}
            link={item?.link}
            headerItemStyle={{
              fontFamily: theme.fontFamily.pixeboy,
              color: '#6D99E4',
              margin: '0px 8px',
              fontSize: 20,
              fontWeight: 400,
              textTransform: 'uppercase',
            }}
            notChangebleFontOnHover
          >
            {item.label}
          </HeaderItem>
        ))}
      </RowMenuContainer>
    </Container>
  );
};

export default GameEditionMenuContainer;
