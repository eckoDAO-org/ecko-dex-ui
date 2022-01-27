import React from 'react';
import gameboyDesktop from '../../../assets/images/game-edition/gameboy-desktop.svg';
import gameboyMobile from '../../../assets/images/game-edition/gameboy-mobile.png';
import modalBackground from '../../../assets/images/game-edition/modal-background.png';
import arcadeBackground from '../../../assets/images/game-edition/arcade-background.png';
import arcadeDarkBackground from '../../../assets/images/game-edition/arcade-dark-background.png';

const images = [gameboyDesktop, gameboyMobile, modalBackground, arcadeBackground, arcadeDarkBackground];
const CacheBackgroundImages = () => {
  return (
    <div style={{ display: 'none' }}>
      {images?.map((img, i) => (
        <img key={i} src={img} alt={`img-${i}`} />
      ))}
    </div>
  );
};

export default CacheBackgroundImages;
