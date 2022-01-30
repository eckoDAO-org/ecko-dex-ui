import React, { createContext, useEffect, useState } from 'react';
import gameboyDesktop from '../assets/images/game-edition/gameboy-desktop.svg';
import gameboyMobile from '../assets/images/game-edition/gameboy-mobile.png';
import loadingBackground from '../assets/images/game-edition/loading-background.png';
import menuBackground from '../assets/images/game-edition/menu-background.png';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import arcadeBackground from '../assets/images/game-edition/arcade-background.png';
import arcadeDarkBackground from '../assets/images/game-edition/arcade-dark-background.png';
import pixeledYellowBox from '../assets/images/game-edition/pixeled-box-yellow.svg';
import pixeledPinkBox from '../assets/images/game-edition/pixeled-box-pink.svg';
import pixeledPurpleBox from '../assets/images/game-edition/pixeled-box-purple.svg';
import pixeledInfoContainerBlue from '../assets/images/game-edition/pixeled-info-container-blue.png';
import pixeledInfoContainerWhite from '../assets/images/game-edition/pixeled-info-container-white.svg';
import pixeledTokenSelectorBlueIcon from '../assets/images/game-edition/pixeled-token-selector-blue.svg';
import pixeledTokenSelectorWhiteIcon from '../assets/images/game-edition/pixeled-token-selector-white.svg';
import centerBackground from '../assets/images/game-edition/center-background.png';
import appBackground from '../assets/images/shared/app-background.png';

const backgroundImages = [
  { name: 'loadingBackground', src: loadingBackground },
  { name: 'gameboyDesktop', src: gameboyDesktop },
  { name: 'gameboyMobile', src: gameboyMobile },
  { name: 'menuBackground', src: menuBackground },
  { name: 'modalBackground', src: modalBackground },
  { name: 'arcadeBackground', src: arcadeBackground },
  { name: 'arcadeDarkBackground', src: arcadeDarkBackground },
  { name: 'pixeledYellowBox', src: pixeledYellowBox },
  { name: 'pixeledPinkBox', src: pixeledPinkBox },
  { name: 'pixeledPurpleBox', src: pixeledPurpleBox },
  { name: 'pixeledInfoContainerBlue', src: pixeledInfoContainerBlue },
  { name: 'pixeledInfoContainerWhite', src: pixeledInfoContainerWhite },
  { name: 'pixeledTokenSelectorBlueIcon', src: pixeledTokenSelectorBlueIcon },
  { name: 'pixeledTokenSelectorWhiteIcon', src: pixeledTokenSelectorWhiteIcon },
  { name: 'centerBackground', src: centerBackground },
  { name: 'appBackground', src: appBackground },
];

const checkImage = (path) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(path);
    img.onerror = () => reject();

    img.src = path;
  });

export const ImagesContext = createContext(null);

export const ImagesProvider = (props) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    Promise.all(backgroundImages.map((bg) => checkImage(bg.src))).then(
      () => setAllImagesLoaded(true),
      () => console.error('could not load images')
    );
  }, []);

  return <ImagesContext.Provider value={{ allImagesLoaded, immages: backgroundImages }}>{props.children}</ImagesContext.Provider>;
};

export const ImagesConsumer = ImagesContext.Consumer;
