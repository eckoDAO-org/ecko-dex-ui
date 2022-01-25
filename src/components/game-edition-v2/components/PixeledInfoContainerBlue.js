import styled, { css } from 'styled-components/macro';
import pixeledInfoContainerBlue from '../../../assets/images/game-edition/pixeled-info-container-blue.png';

export const PixeledInfoContainerBlue = styled.div`
  display: flex;
  ${({ gameEditionView }) =>
    gameEditionView &&
    css`
      flex-flow: column;
      min-width: 194px;
      min-height: 82px;
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

export default PixeledInfoContainerBlue;
