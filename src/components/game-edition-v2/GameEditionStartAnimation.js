/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { PROGRESS_BAR_MAX_VALUE } from '../../contexts/GameEditionContext';
import { ROUTE_GAME_EDITION_MENU } from '../../router/routes';
import { KaddexLoadingIcon } from '../../assets';
import GameEditionProgressBar from '../shared/GameEditionProgressBar';
import loadingBackground from '../../assets/images/game-edition/loading-background.png';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;
  width: 100%;
`;

const GameEditionStartAnimation = () => {
  const history = useHistory();
  const { loadingValue, gameEditionView } = useGameEditionContext();

  useEffect(() => {
    if (loadingValue === PROGRESS_BAR_MAX_VALUE) {
      let goToSwapTimeout = setTimeout(() => {
        history.push(ROUTE_GAME_EDITION_MENU);
      }, [2000]);
      return () => {
        clearTimeout(goToSwapTimeout);
      };
    }
  }, [loadingValue, gameEditionView]);

  return (
    <Container style={{ backgroundImage: `url(${loadingBackground})` }}>
      <KaddexLoadingIcon />
      <GameEditionProgressBar loadingValue={loadingValue} />
      <span style={{ fontFamily: theme.fontFamily.pixeboy, color: '#ffff', marginTop: 50, fontSize: 14 }}>V 1.0.0</span>
    </Container>
  );
};

export default GameEditionStartAnimation;
