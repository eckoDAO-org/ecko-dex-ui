import React from 'react';
import styled, { css } from 'styled-components/macro';
import pixeledInfoContainerBlue from '../../../assets/images/game-edition/pixeled-info-container-blue.png';
import { GE_DESKTOP_CONFIGURATION } from '../../../contexts/GameEditionContext';
import Label from '../../shared/Label';

export const InfoContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  width: ${GE_DESKTOP_CONFIGURATION.DISPLAY_WIDTH}px;

  & > div:not(:last-child) {
    margin-right: 16px;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export const PixeledInfoContainerBlue = styled.div`
  display: flex;
  ${({ gameEditionView }) =>
    gameEditionView &&
    css`
      flex-flow: column;
      min-width: 160px;
      min-height: 68px;
      justify-content: center;
      text-align: center;
      align-items: center;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      background-image: ${`url(${pixeledInfoContainerBlue})`};
      span {
        text-align: center;
        display: block;
      }
    `}
`;

const PixeledBlueContainer = ({ label, value, style }) => {
  return (
    <PixeledInfoContainerBlue gameEditionView style={style}>
      <Label geFontSize={18} geColor="blue">
        {label}
      </Label>
      <Label geFontSize={20}>{value}</Label>
    </PixeledInfoContainerBlue>
  );
};

export default PixeledBlueContainer;
