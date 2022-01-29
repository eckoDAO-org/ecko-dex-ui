import React from 'react';
import gameboyDesktop from '../../assets/images/game-edition/gameboy-desktop.svg';
import gameboyMobile from '../../assets/images/game-edition/gameboy-mobile.png';
import loadingBackground from '../../assets/images/game-edition/loading-background.png';
import menuBackground from '../../assets/images/game-edition/menu-background.png';
import modalBackground from '../../assets/images/game-edition/modal-background.png';
import arcadeBackground from '../../assets/images/game-edition/arcade-background.png';
import arcadeDarkBackground from '../../assets/images/game-edition/arcade-dark-background.png';
import pixeledYellowBox from '../../assets/images/game-edition/pixeled-box-yellow.svg';
import pixeledPinkBox from '../../assets/images/game-edition/pixeled-box-pink.svg';
import pixeledPurpleBox from '../../assets/images/game-edition/pixeled-box-purple.svg';
import pixeledInfoContainerBlue from '../../assets/images/game-edition/pixeled-info-container-blue.png';
import pixeledInfoContainerWhite from '../../assets/images/game-edition/pixeled-info-container-white.svg';
import pixeledTokenSelectorBlueIcon from '../../assets/images/game-edition/pixeled-token-selector-blue.svg';
import pixeledTokenSelectorWhiteIcon from '../../assets/images/game-edition/pixeled-token-selector-white.svg';
import centerBackground from '../../assets/images/game-edition/center-background.png';
import appBackground from '../../assets/images/shared/app-background.png';

const backgroundImages = [
  loadingBackground,
  gameboyDesktop,
  gameboyMobile,
  menuBackground,
  modalBackground,
  arcadeBackground,
  arcadeDarkBackground,
  pixeledYellowBox,
  pixeledPinkBox,
  pixeledPurpleBox,
  pixeledInfoContainerBlue,
  pixeledInfoContainerWhite,
  pixeledTokenSelectorBlueIcon,
  pixeledTokenSelectorWhiteIcon,
  centerBackground,
  appBackground,
];
const CacheBackgroundImages = () => {
  return (
    <div style={{ display: 'none' }}>
      {backgroundImages?.map((img, i) => (
        <img key={i} src={img} alt={`img-${i}`} />
      ))}
    </div>
  );
};

export default CacheBackgroundImages;
