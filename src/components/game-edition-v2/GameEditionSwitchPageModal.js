import React, { useState, useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext, GE_DESKTOP_CONFIGURATION } from '../../contexts/GameEditionContext';

import menuItems, { POOL, STATS, SWAP } from '../menuItems';
import GameEditionLabel from './components/GameEditionLabel';
import { PixeledArrowDownIcon } from '../../assets';
import { useHistory, useLocation } from 'react-router-dom';
import { useGameEditionContext } from '../../contexts';

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

const GameEditionSwitchPageModal = ({ direction }) => {
  const location = useLocation();
  const history = useHistory();
  const { closeModal } = useGameEditionContext();
  const [translateX, setTranslateX] = useState(0);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const { setButtons } = useContext(GameEditionContext);

  const getCorrectSwitchIndex = (itemIndex) => {
    let index = null;
    if (direction === 'left') {
      if (itemIndex - 1 < 0) {
        index = itemIndex;
      } else {
        index = itemIndex - 1;
      }
    } else {
      if (itemIndex + 1 > menuItems.length) {
        index = itemIndex;
      } else {
        index = itemIndex + 1;
      }
    }
    return index;
  };

  // init index based on the current route when this page is rendered
  useEffect(() => {
    let index = null;
    const routeIndex = menuItems.findIndex((r) => r.route === location.pathname);
    let scrollX = translateX;
    console.log('routeIndex', routeIndex);
    if (!routeIndex) {
      if (direction === 'left') {
        index = 0;
      } else {
        index = 1;
      }
    } else {
      index = getCorrectSwitchIndex(routeIndex);
      if (direction === 'left') {
        const elementContainer = document.getElementById('switch-items-container');
        if (elementContainer) {
          elementContainer.scrollTo(menuItems.length * 274, 0);
        }
      }
      if (index > menuItems.length - 1) {
        index = menuItems.length - 1;
        console.log('here');
      }
    }
    console.log('index', index);
    // const scrollX = index + 1 === 1 || index + 1 === menuItems.length ? SCROLL_OFFSET : 0;
    onSwitch(direction, index);
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
  console.log('selectedItemIndex', selectedItemIndex);

  // funcation on L1 and R1 buttons
  const onSwitch = (direction, index, scrollX) => {
    if (direction === 'right' && selectedItemIndex + 1 < menuItems.length) {
      setSelectedItemIndex((prev) => index || prev + 1);
      console.log('scrollX', scrollX);
      setTranslateX((prev) => prev + 274 + (scrollX || 0));
    }
    if (direction === 'left' && selectedItemIndex - 1 >= 0) {
      setSelectedItemIndex((prev) => index || prev - 1);

      setTranslateX((prev) => prev - 274 - (scrollX || 0));
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
              <GameEditionLabel fontSize={92} color={isSelected ? 'yellow' : 'grey'}>
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

export default GameEditionSwitchPageModal;
