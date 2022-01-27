/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useGameEditionContext } from '../../contexts';
import { GameEditionContext, GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';
import menuItems from '../menuItems';
import GameEditionLabel from './components/GameEditionLabel';
import { PixeledArrowDownIcon } from '../../assets';
import { useHistory, useLocation } from 'react-router-dom';

const SCROLL_OFFSET = 95;

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
  width: ${GE_DESKTOP_CONFIGURATION.displayWidth}px;
  overflow-x: auto;
  scroll-behavior: smooth;
  & > div:first-child {
    margin-left: ${SCROLL_OFFSET}px;
  }
  & > div:last-child {
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
  const { closeModal } = useGameEditionContext();
  const [translateX, setTranslateX] = useState(0);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const { setButtons } = useContext(GameEditionContext);

  // init index based on the current route when this page is rendered
  useEffect(() => {
    const routeIndex = menuItems.findIndex((r) => r.route === location.pathname);
    if (routeIndex < 0) {
      if (direction === 'left') {
        onSwitch(direction, 0);
      } else {
        onSwitch(direction, 1);
      }
    } else {
      if (direction === 'right') {
        if (routeIndex === menuItems.length - 1) {
          setSelectedItemIndex(routeIndex);
          setTranslateX(routeIndex * 274);
        } else if (routeIndex >= 0) {
          setSelectedItemIndex(routeIndex + 1);
          setTranslateX((routeIndex + 1) * 274);
        }
      } else {
        if (routeIndex === 0) {
          setSelectedItemIndex(0);
          setTranslateX(0);
        } else if (routeIndex <= menuItems.length - 1) {
          setSelectedItemIndex(routeIndex - 1);
          setTranslateX((routeIndex - 1) * 274);
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

      history.push(menuItems[selectedItemIndex].route);
    }
  }, [seconds]);

  // funcation on L1 and R1 buttons
  const onSwitch = (direction, index, scrollX) => {
    if (direction === 'right' && selectedItemIndex + 1 < menuItems.length) {
      setSelectedItemIndex((prev) => prev + 1);
      setTranslateX((prev) => prev + 274);
    }
    if (direction === 'left' && selectedItemIndex - 1 >= 0) {
      setSelectedItemIndex((prev) => prev - 1);

      setTranslateX((prev) => prev - 274);
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
        {menuItems.map((item, i) => {
          const isSelected = selectedItemIndex === item.id;
          return (
            <Item key={i} selected={isSelected} style={{ minWidth: 274 }}>
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
