import React, { createContext, useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const RESOLUTIONS = {
  '3840x2160': {
    width: 3840,
    height: 2160,
    'game-edition': {
      scale: 2.3,
      geTranslateY: -346,
      wiresTranslateY: -1360,
    },
  },
  '2560x1600': { width: 2560, height: 1600, 'game-edition': { scale: 1.6, geTranslateY: 246, wiresTranslateY: -430 } },
  '2560x1440': { width: 2560, height: 1440, 'game-edition': { scale: 1.5, geTranslateY: 324, wiresTranslateY: -336 } },
  '2048x1080': { width: 2048, height: 1080, 'game-edition': { scale: 1.3, geTranslateY: 430, wiresTranslateY: -85 } },
  '1920x1080': { width: 1920, height: 1080, 'game-edition': { scale: 1.2, geTranslateY: 430, wiresTranslateY: -85 } },
  '1920x936': { width: 1920, height: 936, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1680x1050': { width: 1680, height: 1050, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1600x900': { width: 1600, height: 900, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1440x900': { width: 1440, height: 900, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1400x1050': { width: 1400, height: 1050, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1366x768': { width: 1366, height: 768, 'game-edition': { scale: 0.8, geTranslateY: 425, wiresTranslateY: 88 } },
  '1360x768': { width: 1360, height: 768, 'game-edition': { scale: 0.8, geTranslateY: 425, wiresTranslateY: 88 } },
  '1280x1024': { width: 1280, height: 1024, 'game-edition': { scale: 1, geTranslateY: 442, wiresTranslateY: 0 } },
  '1280x960': { width: 1280, height: 960, 'game-edition': { scale: 0.9, geTranslateY: 442, wiresTranslateY: 88 } },
  '1280x800': { width: 1280, height: 800, 'game-edition': { scale: 0.8, geTranslateY: 428, wiresTranslateY: 88 } },
  '1280x768': { width: 1280, height: 768, 'game-edition': { scale: 0.8, geTranslateY: 420, wiresTranslateY: 88 } },
  '1280x720': { width: 1280, height: 720, 'game-edition': { scale: 0.8, geTranslateY: 420, wiresTranslateY: 88 } },
  '1280x600': { width: 1280, height: 600, 'game-edition': { scale: 0.7, geTranslateY: 390, wiresTranslateY: 88 } },
  '1152x864': { width: 1152, height: 864, 'game-edition': { scale: 0.8, geTranslateY: 434, wiresTranslateY: 88 } },
  '1024x768': { width: 1024, height: 768, 'game-edition': { scale: 0.8, geTranslateY: 438, wiresTranslateY: 88 } },
};

export const ApplicationContext = createContext(null);

export const ApplicationProvider = (props) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [mountedComponent, setMountedComponent] = useState(false);

  const [resolutionConfiguration, setResolutionConfiguration] = useState(null);

  const [width, height] = useWindowSize();

  useEffect(() => {
    let resolution = RESOLUTIONS['1920x1080'];
    Object.keys(RESOLUTIONS).some((resolutionKey) => {
      const configuration = RESOLUTIONS[resolutionKey];
      if (width >= configuration.width && height >= configuration.height) {
        resolution = RESOLUTIONS[resolutionKey];
        return true;
      }
      return false;
    });

    setResolutionConfiguration(resolution);

    // getGeTranslateY(layout, height);
    // if (width < layout.minimumWidth || height < layout.minimumHeight) {
    //   setGameEditionView(false);
    //   closeModal();
    // }
  }, [width, height]);

  const setMode = (mode) => {
    window.localStorage.setItem('theme', mode);
    setThemeMode(mode);
  };

  const themeToggler = () => {
    themeMode === 'dark' ? setMode('light') : setMode('dark');
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme && setThemeMode(localTheme);
    setMountedComponent(true);
  }, []);

  const contextValues = {
    themeMode,
    themeToggler,
    mountedComponent,
    resolutionConfiguration,
  };
  return <ApplicationContext.Provider value={contextValues}>{props.children}</ApplicationContext.Provider>;
};
