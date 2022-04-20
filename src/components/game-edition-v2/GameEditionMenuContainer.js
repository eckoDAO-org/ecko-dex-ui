/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { GeArrowIcon } from '../../assets';
import HeaderItem from '../../components/shared/HeaderItem';
import theme, { commonColors } from '../../styles/theme';
import headerLinks from '../headerLinks';
import { gameEditionRoutes } from '../menuItems';
import { FadeIn } from '../shared/animations';
import GameEditionLabel from './components/GameEditionLabel';
import menuBackground from '../../assets/images/game-edition/menu-background.png';
import { useGameEditionContext } from '../../contexts';
import { useHistory } from 'react-router-dom';
import PressButtonToActionLabel from './components/PressButtonToActionLabel';

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
  align-items: flex-start;

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
    & > a {
      font-size: 24px !important;
    }
  }
`;

const RowMenuContainer = styled.div`
  display: flex;
  align-items: center;
  svg {
    path {
      fill: ${({ showArrow, theme: { colors } }) => (showArrow ? colors.gameEditionYellow : 'transparent')};
    }
  }
`;

const GameEditionMenuContainer = () => {
  const history = useHistory();
  const [activeItem, setActiveItem] = useState(gameEditionRoutes[0]);
  const { gameEditionView, setButtons } = useGameEditionContext();

  useEffect(() => {
    setButtons({
      A: () => history.push(activeItem.route),
      Up: () => {
        const selectedIndex = gameEditionRoutes.findIndex((i) => i.id === activeItem.id);
        setActiveItem(gameEditionRoutes[selectedIndex - 1 < 0 ? gameEditionRoutes.length - 1 : (selectedIndex - 1) % gameEditionRoutes.length]);
      },
      Down: () => {
        const selectedIndex = gameEditionRoutes.findIndex((i) => i.id === activeItem.id);
        setActiveItem(gameEditionRoutes[(selectedIndex + 1) % gameEditionRoutes.length]);
      },
    });
  }, [activeItem]);

  // check to not render this component when exit from game edition
  return gameEditionView ? (
    <Container gameEditionStyle={{ backgroundImage: `url(${menuBackground})` }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <GameEditionLabel fontSize={52} fontWeight={400} style={{ marginBottom: 10 }}>
          MENU
        </GameEditionLabel>
        <TopListContainer>
          {gameEditionRoutes.map((item, index) => (
            <RowMenuContainer key={index} showArrow={activeItem.id === item.id}>
              <GeArrowIcon label={item.label} style={{ marginRight: 5.5 }} />
              <HeaderItem
                disableUnderline
                item={item}
                headerItemStyle={{
                  fontFamily: theme.fontFamily.pixeboy,
                  color: activeItem.id === item.id ? commonColors.gameEditionYellow : '#ffffff',
                  fontSize: 32,
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </HeaderItem>
            </RowMenuContainer>
          ))}
        </TopListContainer>
      </div>
      <RowMenuContainer>
        {headerLinks
          ?.filter((item) => !item?.hideOnGameEdition)
          .map((item, index) => (
            <HeaderItem
              key={index}
              disableUnderline
              hideIcon
              item={item}
              headerItemStyle={{
                fontFamily: theme.fontFamily.pixeboy,
                color: commonColors.gameEditionBlue,
                margin: '0px 22px',
                fontSize: 20,
                fontWeight: 400,
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </HeaderItem>
          ))}
      </RowMenuContainer>
      <PressButtonToActionLabel actionLabel="select" />
    </Container>
  ) : (
    <></>
  );
};

export default GameEditionMenuContainer;
