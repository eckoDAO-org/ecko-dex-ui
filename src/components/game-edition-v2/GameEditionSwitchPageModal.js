import React, { useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';

import menuItems, { POOL, STATS, SWAP } from '../menuItems';
import GameEditionLabel from './components/GameEditionLabel';
import { PixeledArrowDownIcon } from '../../assets';
import { useHistory, useLocation } from 'react-router-dom';
import { useGameEditionContext } from '../../contexts';
import { ROUTE_POOL, ROUTE_STATS, ROUTE_SWAP } from '../../router/routes';

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
  transition: transform 0.5s;
  max-width: 100%;

  transform: ${({ translateX }) => `translateX(${translateX}px)`};
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
  ${({ isVisible }) => {
    if (isVisible) {
      return css`
        opacity: 1;
        transition: opacity 0s 0.2s;
      `;
    } else {
      return css`
        opacity: 0;
        /* mask: linear-gradient(270deg,#fff, transparent); */
        transition: opacity 0s;
      `;
    }
  }}
`;
const GameEditionSwitchPageModal = ({ direction }) => {
  const location = useLocation();
  const history = useHistory();
  const { closeModal } = useGameEditionContext();
  const [translateX, setTranslateX] = useState(65);

  //   const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [secondsCount, setSecondsCount] = useState(0);
  const { setButtons } = useContext(GameEditionContext);

  const getCorrectSwitchIndex = (itemIndex) => {
    let index = null;
    console.log('direction', direction);
    if (direction === 'left') {
      if (itemIndex - 1 < 0) {
        index = itemIndex;
      } else {
        index = itemIndex - 1;
      }
    } else {
      console.log('itemIndex', itemIndex);
      if (itemIndex + 1 > menuItems.length) {
        index = itemIndex;
      } else {
        index = itemIndex + 1;
      }
    }
    return index;
  };

  useEffect(() => {
    let index = null;
    switch (location.pathname) {
      case SWAP:
        const swapIndex = menuItems.findIndex((r) => r.id === SWAP.id);
        index = getCorrectSwitchIndex(swapIndex);
        setSelectedItemIndex(index);
        break;
      case POOL:
        const poolIndex = menuItems.findIndex((r) => r.id === POOL.id);
        index = getCorrectSwitchIndex(poolIndex);
        setSelectedItemIndex(index);
        break;
      case STATS:
        const statsIndex = menuItems.findIndex((r) => r.id === STATS.id);
        index = getCorrectSwitchIndex(statsIndex);
        setSelectedItemIndex(index);
        break;
      default:
        if (direction === 'left') {
          index = 0;
        } else {
          index = 1;
        }
        break;
    }
    setSelectedItemIndex(index);
  }, []);
  useEffect(() => {
    setButtons({
      R1: () => onSwitch('right'),
      L1: () => onSwitch('left'),
    });
    // if (selectedItemIndex < menuItems.length) {
    //   setSelectedItem(menuItems[selectedItemIndex]);
    // } else {
    //   setSelectedItem(null);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(() => setSecondsCount((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [selectedItemIndex]);
  //   console.log('selectedItemIndex', selectedItemIndex);

  useEffect(() => {
    if (secondsCount === 2) {
      setButtons({
        R1: null,
        L1: null,
      });
      closeModal();
      history.push(menuItems[selectedItemIndex].route);
      //   console.log('item', menuItems[selectedItemIndex]);
    }
  }, [secondsCount]);

  const onSwitch = (direction) => {
    if (direction === 'right' && selectedItemIndex + 1 < menuItems.length) {
      setSelectedItemIndex((prev) => prev + 1);
      setTranslateX((prev) => prev - 274);
    }
    if (direction === 'left' && selectedItemIndex - 1 >= 0) {
      setSelectedItemIndex((prev) => prev - 1);

      setTranslateX((prev) => prev + 274);
    }
  };

  return (
    <Content>
      <IconContainer>
        <PixeledArrowDownIcon />
      </IconContainer>
      <ItemsContainer translateX={translateX}>
        {menuItems.map((item, i) => {
          const isSelected = selectedItemIndex === item.id;
          return (
            <Item key={i} isVisible={selectedItemIndex === i} selected={isSelected} style={{ minWidth: 274 }}>
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
