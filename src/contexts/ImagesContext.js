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

export const ImagesContext = createContext(null);

export const ImagesProvider = (props) => {
  const [images, setImages] = useState({});
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const onLoadEnd = async (imgs) => {
    setImages(imgs);
    setAllImagesLoaded(true);
  };

  const cacheImages = async () => {
    let imgs = {};

    backgroundImages.forEach((img) => {
      const imageLoader = new Image();
      imageLoader.src = img.src;
      imageLoader.onload = () => {
        imgs[img.name] = img.src;
      };
    });
    return imgs;
  };
  const loadImages = async () => {
    const imgs = await cacheImages();
    await onLoadEnd(imgs);
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <ImagesContext.Provider value={{ images, allImagesLoaded }}>
      {Object.keys(images).map((imgKey, i) => (
        <div key={i} style={{ display: 'none', backgroundImage: `url(${images[imgKey].src})` }} />
      ))}

      {props.children}
    </ImagesContext.Provider>
  );
};

export const ImagesConsumer = ImagesContext.Consumer;
