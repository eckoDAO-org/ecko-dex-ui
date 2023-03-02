/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { useGameEditionContext, useWalletContext } from '../../contexts';
import { PROGRESS_BAR_MAX_VALUE } from '../../contexts/GameEditionContext';
import { ROUTE_GAME_EDITION_MENU } from '../../router/routes';
import { EckoDexLoadingIcon } from '../../assets';
import GameEditionProgressBar from '../shared/GameEditionProgressBar';
import loadingBackground from '../../assets/images/game-edition/loading-background.png';
import GameEditionLabel from './components/GameEditionLabel';
import { WALLET } from '../../constants/wallet';

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
  const { loadingValue, gameEditionView, onWireSelect } = useGameEditionContext();
  const { wallet } = useWalletContext();

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

  useEffect(() => {
    if (wallet) {
      onWireSelect(WALLET[wallet.id]);
    }
  }, [wallet]);

  // check to not render this component when exit from game edition
  return gameEditionView ? (
    <Container style={{ backgroundImage: `url(${loadingBackground})` }}>
      <EckoDexLoadingIcon />
      <GameEditionProgressBar loadingValue={loadingValue} />
      <GameEditionLabel style={{ marginTop: 50 }}>V 1.0.0</GameEditionLabel>
    </Container>
  ) : (
    <></>
  );
};

export default GameEditionStartAnimation;
