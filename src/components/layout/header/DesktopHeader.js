import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import { GameModeIcon, KaddexLightModeLogo, KaddexLogoWhite } from '../../../assets';
import { ROUTE_INDEX } from '../../../router/routes';
import menuItems from '../../menuItems';
import RightHeaderItems from './RightHeaderItems';
import HeaderItem from '../../../components/shared/HeaderItem';
import { LightModeContext } from '../../../contexts/LightModeContext';
import { useGameEditionContext } from '../../../contexts';
import { commonTheme } from '../../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  min-height: ${({ theme: { header } }) => `${header.height}px`};
  padding: 0 48px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
  .fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 1s, opacity 1s linear;
  }
  .fadeIn {
    visibility: visible;
    opacity: 1;
    transition: opacity 1s linear;
  }
`;

const RightContainer = styled.div`
  display: flex;
`;

const AnimatedDiv = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
`;

const GameEditionButton = styled.div`
  cursor: pointer;
  height: fit-content;
  padding: 8px 18px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? 'transparent' : colors.white)}};
  color: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};
  svg{
    path{
      fill: ${({ gameEditionView, theme: { colors } }) => (gameEditionView ? colors.white : colors.primary)};
    }
  }
  ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView &&
    css`
      border: 1px solid ${colors.white}4D;
      box-sizing: border-box;
      border-radius: 40px;
    `}
`;

const DesktopHeader = ({ className }) => {
  const history = useHistory();
  const [buttonHover, setButtonHover] = useState(null);
  const { gameEditionView, setGameEditionView, closeModal } = useGameEditionContext();

  const { themeMode } = useContext(LightModeContext);

  return (
    <Container className={className}>
      <LeftContainer>
        {themeMode === 'dark' ? (
          <KaddexLogoWhite style={{ cursor: 'pointer' }} onClick={() => history.push(ROUTE_INDEX)} />
        ) : (
          <KaddexLightModeLogo style={{ cursor: 'pointer' }} onClick={() => history.push(ROUTE_INDEX)} />
        )}

        <AnimatedDiv className={gameEditionView ? 'fadeOut' : 'fadeIn'}>
          {menuItems.map((item, index) => (
            <HeaderItem
              key={index}
              className={item.className}
              headerItemStyle={{ width: 36 }}
              route={item.route}
              onMouseOver={() => setButtonHover(item.id)}
              onMouseLeave={() => setButtonHover(null)}
              isHover={buttonHover === item.id}
            >
              {item.label}
            </HeaderItem>
          ))}
        </AnimatedDiv>
      </LeftContainer>

      <GameEditionButton
        gameEditionView={gameEditionView}
        onClick={() => {
          setGameEditionView(!gameEditionView);
          closeModal();
        }}
      >
        {!gameEditionView && <GameModeIcon style={{ marginRight: 9.4 }} />}
        <span style={{ fontFamily: commonTheme.fontFamily.bold }}>{gameEditionView ? 'Exit Game Mode' : 'Game Mode'}</span>
      </GameEditionButton>

      <RightContainer>
        <RightHeaderItems />
      </RightContainer>
    </Container>
  );
};

export default DesktopHeader;
