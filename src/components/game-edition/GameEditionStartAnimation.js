/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import theme from '../../styles/theme';
import { ROUTE_GAME_EDITION_MENU } from '../../router/routes';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AnimatedDiv = styled.div`
  div.in {
    animation: in 3s linear;
  }

  @keyframes in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  div.out {
    animation: out 3s;
  }

  @keyframes out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  span {
    font: normal normal normal 64px/77px ${theme.fontFamily.pressStartRegular};
    letter-spacing: 0.64px;
    color: #000000;
    opacity: 1;
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
      font-size: 36px !important;
    }
  }
`;
const GameEditionStartAnimation = () => {
  const [fade, setFade] = useState('in');
  const history = useHistory();

  useEffect(() => {
    if (fade === 'out') {
      let goToSwapTimeout = setTimeout(() => {
        history.push(ROUTE_GAME_EDITION_MENU);
      }, [2500]);
      return () => {
        clearTimeout(goToSwapTimeout);
      };
    }
  }, [fade]);

  return (
    <Container>
      <AnimatedDiv>
        <div
          className={fade}
          onAnimationEnd={() => {
            setFade('out');
          }}
        >
          <span>Mercatus</span>
        </div>
      </AnimatedDiv>
    </Container>
  );
};

export default GameEditionStartAnimation;
