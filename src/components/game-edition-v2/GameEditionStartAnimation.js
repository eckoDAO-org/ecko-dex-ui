/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { ROUTE_GAME_EDITION_MENU } from '../../router/routes';
import { KaddexLoading } from '../../assets';
import GameEditionProgressBar from '../shared/GameEditionProgressBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
`;

const PROGRESS_BAR_MAX_VALUE = 89;

const GameEditionStartAnimation = () => {
  const history = useHistory();
  const [completed, setCompleted] = useState(1);

  useEffect(() => {
    setInterval(() => setCompleted(PROGRESS_BAR_MAX_VALUE), 1000);
  }, []);

  useEffect(() => {
    if (completed === PROGRESS_BAR_MAX_VALUE) {
      setTimeout(() => {
        history.push(ROUTE_GAME_EDITION_MENU);
      }, 2000);
    }
  }, [completed]);

  return (
    <Container>
      <KaddexLoading />
      <GameEditionProgressBar completed={completed} />
      <span style={{ fontFamily: theme.fontFamily.pressStartRegular, color: '#ffff', marginTop: 50, fontSize: 14 }}>V 1.0.0</span>
    </Container>
  );
};

export default GameEditionStartAnimation;
