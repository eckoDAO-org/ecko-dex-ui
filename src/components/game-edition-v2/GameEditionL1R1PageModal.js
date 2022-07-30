/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import { gameEditionRoutes } from '../menuItems';
import GameEditionLabel from './components/GameEditionLabel';
import { PixeledArrowDownIcon } from '../../assets';
import { useHistory, useLocation } from 'react-router-dom';

const SCROLL_OFFSET = 95;
const WIDTH = 274;
const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 100%;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-flow: row;
  width: ${GE_DESKTOP_CONFIGURATION.DISPLAY_WIDTH}px;
  overflow-x: auto;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  & > div:first-child {
    margin-left: ${SCROLL_OFFSET}px;
  }
  & > div:last-child {
    margin-left: 44px;
    margin-right: ${SCROLL_OFFSET}px;
  }
`;
const IconContainer = styled.div`
  margin-bottom: 10px;
  .rotated {
    transform: rotate(180deg);
  }
  svg {
    width: 20px;
    height: 20px;

    path {
      fill: ${({ theme: { colors } }) => colors.gameEditionYellow};
    }
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
`;

const GameEditionL1R1PageModal = ({ direction }) => {
  const location = useLocation();
  const history = useHistory();
  const { closeModal, setButtons } = useGameEditionContext();
  const [translateX, setTranslateX] = useState(0);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // init index based on the current route when this page is rendered
  useEffect(() => {
    const routeIndex = gameEditionRoutes.findIndex((r) => r.route === location.pathname);
    if (routeIndex < 0) {
      if (direction === 'left') {
        onSwitch(direction, 0);
      } else {
        onSwitch(direction, 1);
      }
    } else {
      if (direction === 'right') {
        if (routeIndex === gameEditionRoutes.length - 1) {
          setSelectedItemIndex(routeIndex);
          setTranslateX(routeIndex * WIDTH);
        } else if (routeIndex >= 0) {
          setSelectedItemIndex(routeIndex + 1);
          setTranslateX((routeIndex + 1) * WIDTH);
        }
      } else {
        if (routeIndex === 0) {
          setSelectedItemIndex(0);
          setTranslateX(0);
        } else if (routeIndex <= gameEditionRoutes.length - 1) {
          setSelectedItemIndex(routeIndex - 1);
          setTranslateX((routeIndex - 1) * WIDTH);
        }
      }
    }
  }, []);

  const startTimer = () => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    setIntervalId(interval);
  };

  const stopTimer = () => {
    setSeconds(0);
    clearInterval(intervalId);
  };

  // init buttons and starting interval to navigate into selected page after 2 seconds
  useEffect(() => {
    setButtons({
      R1: () => onSwitch('right'),
      L1: () => onSwitch('left'),
      Menu: () => null,
      Swap: () => null,
    });
    stopTimer();
    startTimer();
  }, [selectedItemIndex]);

  // navigate to page if secondsCount === 2
  useEffect(() => {
    if (seconds === 2) {
      setButtons({
        R1: null,
        L1: null,
      });
      closeModal();

      history.push(gameEditionRoutes[selectedItemIndex].route);
    }
  }, [seconds]);

  // funcation on L1 and R1 buttons
  const onSwitch = (direction) => {
    if (direction === 'right' && selectedItemIndex + 1 < gameEditionRoutes.length) {
      // for last item too long
      const offset = selectedItemIndex + 1 === gameEditionRoutes.length - 1 ? 20 : 0;
      setSelectedItemIndex((prev) => prev + 1);
      setTranslateX((prev) => prev + WIDTH + offset);
    }
    if (direction === 'left' && selectedItemIndex - 1 >= 0) {
      // for last item too long
      const offset = selectedItemIndex - 1 === gameEditionRoutes.length - 2 ? 20 : 0;
      setSelectedItemIndex((prev) => prev - 1);

      setTranslateX((prev) => prev - WIDTH - offset);
    }
  };

  useEffect(() => {
    const elementContainer = document.getElementById('switch-items-container');
    if (elementContainer) {
      elementContainer.scrollTo(translateX, 0);
    }
  }, [translateX]);

  useEffect(() => {
    return () => {
      setButtons({
        R1: null,
        L1: null,
      });
    };
  }, []);

  return (
    <Content>
      <IconContainer>
        <PixeledArrowDownIcon />
      </IconContainer>
      <ItemsContainer id="switch-items-container" translateX={translateX}>
        {gameEditionRoutes.map((item, i) => {
          const isSelected = selectedItemIndex === item.id;
          return (
            <Item key={i} selected={isSelected} style={{ minWidth: WIDTH }}>
              <GameEditionLabel fontSize={92} color={isSelected ? 'yellow' : 'white-grey'}>
                {item.label}
              </GameEditionLabel>
            </Item>
          );
        })}
      </ItemsContainer>
      <IconContainer>
        <PixeledArrowDownIcon className="rotated" />
      </IconContainer>
    </Content>
  );
};

export default GameEditionL1R1PageModal;
