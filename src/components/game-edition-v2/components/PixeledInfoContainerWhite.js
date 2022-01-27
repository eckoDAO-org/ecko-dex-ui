import styled from 'styled-components';
import pixeledInfoContainerWhite from '../../../assets/images/game-edition/pixeled-info-container-white.svg';

export const PixeledInfoContainerWhite = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${`url(${pixeledInfoContainerWhite})`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 115px;
  width: 200px;
  padding-left: 18px;

  .chain-icon {
    margin-left: 4px;
    margin-right: 2px;
  }
`;
